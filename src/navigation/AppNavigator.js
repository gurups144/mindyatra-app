// src/navigation/AppNavigator.js
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { COLORS } from "../utils/constants";

// Screens
import ActivityHubScreen from "../screens/ActivityHubScreen";
import AIAnalysisScreen from "../screens/AIAnalysisScreen";
import BookingScreen from "../screens/BookingScreen";
import DepressionMeterScreen from "../screens/DepressionMeterScreen";
import HomeScreen from "../screens/HomeScreen";
import KnowYourMentalHealthScreen from "../screens/KnowYourMentalHealthScreen";
import LoginScreen from "../screens/LoginScreen";
import PaymentSuccessScreen from "../screens/PaymentSuccessScreen";
import PayUWebViewScreen from "../screens/PayUWebViewScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SubscriptionScreen from "../screens/SubscriptionScreen";
import UnarathmaScreen from "../screens/UnarathmaScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let name;

          if (route.name === "Home") {
            name = focused ? "home" : "home-outline";
          } else if (route.name === "Booking") {
            name = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Profile") {
            name = focused ? "person" : "person-outline";
          }

          return <Ionicons name={name} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Booking" component={BookingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = ({ initialRoute }) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerStyle: { backgroundColor: "#6366f1" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AIAnalysis"
        component={AIAnalysisScreen}
        options={{ title: "AI Text Analysis" }}
      />

      <Stack.Screen
  name="PaymentSuccess"
  component={PaymentSuccessScreen}
  options={{ 
    headerShown: false,
    gestureEnabled: false // Prevent going back
  }}
/>

      <Stack.Screen
        name="DepressionMeter"
        component={DepressionMeterScreen}
        options={{ title: "Depression Assessment" }}
      />

      <Stack.Screen
  name="PayUWebView"
  component={PayUWebViewScreen}
  options={{ headerShown: false }}
/>

     <Stack.Screen
  name="KnowYourMentalHealth"
  component={KnowYourMentalHealthScreen}
  options={{ title: "Know Your Mental Health" }}
/>

      <Stack.Screen
        name="Unarathma"
        component={UnarathmaScreen}
        options={{
          title: "Unarathma Service",
          headerStyle: {
            backgroundColor: COLORS.primary || "#6366f1",
          },
          headerTintColor: "#fff",
        }}
      />

      <Stack.Screen
        name="ActivityHub"
        component={ActivityHubScreen}
        options={{ title: "Activity Hub" }}
      />

      <Stack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{ title: "Get Premium" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
