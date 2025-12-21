import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { WebView } from 'react-native-webview';

export default function DepressionMeterWeb() {
  const navigation = useNavigation();

  const handleMessage = (event) => {
    console.log('WebView message:', event.nativeEvent.data);

    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'GO_HOME') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    } catch (err) {
      console.log('Message parse error', err);
    }
  };

  return (
    <WebView
      source={{ uri: 'https://mindyatra.in/Api/ai_analysis' }}

      /** 🔴 REQUIRED FOR EXPO */
      javaScriptEnabled={true}
      domStorageEnabled={true}
      originWhitelist={['*']}

      /** communication */
      onMessage={handleMessage}

      /** block website redirects */
      onShouldStartLoadWithRequest={(req) => {
        if (req.url === 'https://mindyatra.in/') {
          return false;
        }
        return true;
      }}

      style={{ flex: 1 }}
    />
  );
}
