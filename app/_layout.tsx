import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import SplashScreen from "../src/components/SplashScreen";
import AppNavigator from "../src/navigation/AppNavigator";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onAnimationFinish={handleSplashFinish} />;
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style="light" />
    </>
  );
}
