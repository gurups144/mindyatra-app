import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Alert, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';

const PayUWebViewScreen = ({ route, navigation }) => {
  const { payuData } = route.params;
  const webViewRef = useRef(null);
  let paymentHandled = false; // Flag to prevent multiple handling

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

  // Handle messages from WebView
  const handleMessage = (event) => {
    if (paymentHandled) return; // Prevent multiple handling
    
    const message = event.nativeEvent.data;
    console.log("Message from WebView:", message);
    
    if (message === "PAYMENT_SUCCESS" || message === "PAYMENT_SUCCESS_REDIRECT") {
      paymentHandled = true;
      
      // Update AsyncStorage
      AsyncStorage.setItem('paid_status', '1').then(() => {
        console.log("Paid status updated to 1");
        
        // Navigate to success screen
        navigation.replace('PaymentSuccess');
      });
      
    } else if (message === "PAYMENT_FAILED") {
      paymentHandled = true;
      
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
    console.log("WebView URL:", state.url);
    
    // Check if we're on success or failure page
    if (state.url.includes('/payment_success') && !paymentHandled) {
      console.log("Detected payment_success URL");
      
      // Inject script to check for success message
      const injectScript = `
        (function() {
          // Check if page contains success indicators
          var isSuccessPage = 
            document.body.innerText.includes('Payment Successful') ||
            document.body.innerText.includes('Payment Success') ||
            document.title.includes('Payment Successful');
          
          if (isSuccessPage && window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage("PAYMENT_SUCCESS_DETECTED");
          }
          
          // Also check for any JSON response
          try {
            var json = JSON.parse(document.body.innerText);
            if (json.success === true && window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage("PAYMENT_SUCCESS_JSON");
            }
          } catch(e) {}
        })();
      `;
      
      // Inject the script
      setTimeout(() => {
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(injectScript);
        }
      }, 1000);
    }
    
    // If URL contains failure
    if (state.url.includes('/payment_failure') && !paymentHandled) {
      console.log("Detected payment_failure URL");
      paymentHandled = true;
      navigation.goBack();
      setTimeout(() => {
        Alert.alert('Payment Failed', 'Please try again.');
      }, 500);
    }
  };

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert(
          'Cancel Payment?',
          'Are you sure you want to cancel the payment?',
          [
            { text: 'No', style: 'cancel' },
            { 
              text: 'Yes', 
              onPress: () => navigation.goBack() 
            }
          ]
        );
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  return (
    <WebView
      ref={webViewRef}
      source={{ html }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      renderLoading={() => <ActivityIndicator size="large" color="#6366f1" />}
      onNavigationStateChange={handleNavigation}
      onMessage={handleMessage}
      injectedJavaScript={`
        // Listen for form submission and page changes
        (function() {
          // Override console to send logs
          var originalLog = console.log;
          console.log = function() {
            originalLog.apply(console, arguments);
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage("CONSOLE: " + Array.from(arguments).join(' '));
            }
          };
          
          // Monitor for payment completion
          var checkPaymentStatus = function() {
            var bodyText = document.body.innerText || '';
            var titleText = document.title || '';
            
            // Check for success indicators
            if (bodyText.includes('Payment Successful') || 
                bodyText.includes('success') && bodyText.includes('transaction') ||
                titleText.includes('Payment Successful')) {
              
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage("PAYMENT_SUCCESS_AUTO");
                return true;
              }
            }
            return false;
          };
          
          // Check initially
          setTimeout(checkPaymentStatus, 1000);
          
          // Check on any DOM changes
          var observer = new MutationObserver(function() {
            checkPaymentStatus();
          });
          
          observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
          });
          
          // Also check every 2 seconds as backup
          setInterval(checkPaymentStatus, 2000);
        })();
      `}
      onError={(error) => {
        console.error("WebView Error:", error);
        Alert.alert('Error', 'Failed to load payment page. Please check your internet connection.');
      }}
      onLoadEnd={() => {
        console.log("WebView loaded");
      }}
    />
  );
};

export default PayUWebViewScreen;