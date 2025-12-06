import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import SplashScreen from "./src/components/SplashScreen";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [initialRoute, setInitialRoute] = useState(null);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const email = await AsyncStorage.getItem("email");

      if (email) {
        setInitialRoute("MainTabs");
      } else {
        setInitialRoute("Login");
      }
    };

    checkLoginStatus();
  }, []);

  if (showSplash) {
    return <SplashScreen onAnimationFinish={handleSplashFinish} />;
  }

  // Wait until initialRoute is decided
  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AppNavigator initialRoute={initialRoute} />
      <StatusBar style="auto" />
    </View>
  );
}
