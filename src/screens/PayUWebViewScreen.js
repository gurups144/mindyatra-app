import { ActivityIndicator, Alert, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PayUWebViewScreen = ({ route, navigation }) => {
  const { payuData } = route.params;

  const html = `
    <html>
      <body onload="document.forms[0].submit()">
        <form method="post" action="${payuData.payu_url}">
          ${Object.keys(payuData.params)
            .map(
              key =>
                `<input type="hidden" name="${key}" value="${payuData.params[key]}" />`
            )
            .join('')}
        </form>
      </body>
    </html>
  `;

  // Handle messages from WebView (from PHP script)
  const handleMessage = (event) => {
    const message = event.nativeEvent.data;
    console.log("Message from WebView:", message);
    
    if (message === "PAYMENT_SUCCESS") {
      // Update AsyncStorage with new paid status
      AsyncStorage.setItem('paid_status', '1');
      
      // Navigate to success screen
      navigation.replace('PaymentSuccess');
    } else if (message === "PAYMENT_FAILED") {
      Alert.alert(
        'Payment Failed',
        'Your payment was not successful. Please try again.',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack() 
          }
        ]
      );
    }
  };

  const handleNavigation = (state) => {
    console.log("Current URL:", state.url);
    
    // Check for success/failure URLs
    if (state.url.includes('payment_success')) {
      console.log("Payment success URL detected");
      // The PHP will handle showing success page and sending message
    } 
    else if (state.url.includes('payment_failure')) {
      console.log("Payment failure URL detected");
      navigation.goBack();
      Alert.alert('Payment Failed', 'Please try again.');
    }
    
    // If URL contains "mindyatra://payment-success" custom scheme
    if (state.url.includes('mindyatra://payment-success')) {
      AsyncStorage.setItem('paid_status', '1');
      navigation.replace('PaymentSuccess');
    }
  };

  return (
    <WebView
      source={{ html }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      renderLoading={() => <ActivityIndicator size="large" />}
      onNavigationStateChange={handleNavigation}
      onMessage={handleMessage}
      injectedJavaScript={`
        // Inject script to listen for page changes
        (function() {
          // Listen for form submission completion
          window.addEventListener('load', function() {
            // Check if we're on success page
            if (document.body.innerHTML.includes('Payment Successful')) {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage("PAYMENT_SUCCESS");
              }
            }
          });
          
          // Override console.log to send to React Native
          var originalLog = console.log;
          console.log = function(message) {
            originalLog.apply(console, arguments);
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage("LOG: " + message);
            }
          };
        })();
      `}
      onError={(error) => {
        console.error("WebView Error:", error);
        Alert.alert('Error', 'Failed to load payment page');
      }}
    />
  );
};

export default PayUWebViewScreen;