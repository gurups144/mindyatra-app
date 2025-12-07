import React from 'react';
import { WebView } from 'react-native-webview';

export default function DepressionMeterWeb() {
  return (
    <WebView 
      source={{ uri: "https://mindyatra.in/Api/ai_analysis" }}
      style={{ flex: 1 }}
    />
  );
}