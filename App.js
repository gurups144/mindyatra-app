import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";
import SplashScreen from "./src/components/SplashScreen";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onAnimationFinish={handleSplashFinish} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <AppNavigator />
      <StatusBar style="auto" />
    </View>
  );
}
