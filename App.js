import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import SplashScreen from "./src/components/SplashScreen";
import AppNavigator from "./src/navigation/AppNavigator";
import { authService } from "./src/services/auth";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [initialRoute, setInitialRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
  try {
    console.log('🔍 Checking auth status...');
    
    // CORRECTED: Check the actual keys that LoginScreen saves
    const [email, user_id, token] = await Promise.all([
      AsyncStorage.getItem('email'),        // Without @ symbol!
      AsyncStorage.getItem('user_id'),      // Without @ symbol!
      AsyncStorage.getItem('token')         // Without @ symbol!
    ]);

    console.log('📊 Auth check results:', {
      email: email || 'NOT FOUND',
      user_id: user_id || 'NOT FOUND',
      token: token ? 'FOUND' : 'NOT FOUND'
    });

    // If we have email AND user_id, user is logged in
    if (email && user_id) {
      console.log('✅ User is logged in, redirecting to MainTabs');
      setInitialRoute("MainTabs");
    } else {
      console.log('❌ User not logged in, showing Login screen');
      // Clear any partial auth data
      await AsyncStorage.multiRemove(['email', 'token', 'user_id', 'paid_status']);
      setInitialRoute("Login");
    }
  } catch (error) {
    console.error('❌ Error checking auth status:', error);
    setInitialRoute("Login");
  } finally {
    setIsLoading(false);
  }
};

    checkAuthStatus();
  }, []);

  // Show splash screen if it's still active
  if (showSplash) {
    return <SplashScreen onAnimationFinish={handleSplashFinish} />;
  }

  // Show loading indicator while checking auth status
  if (isLoading || initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6366f1" />
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
