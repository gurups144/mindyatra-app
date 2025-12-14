import { ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

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

  const handleNavigation = (state) => {
    if (state.url.includes('/api/payu/success')) {
      navigation.replace('PaymentSuccess');
    }

    if (state.url.includes('/api/payu/failure')) {
      navigation.replace('PaymentFailed');
    }
  };

  return (
    <WebView
      source={{ html }}
      javaScriptEnabled
      domStorageEnabled
      startInLoadingState
      renderLoading={() => <ActivityIndicator size="large" />}
      onNavigationStateChange={handleNavigation}
    />
  );
};

export default PayUWebViewScreen;
