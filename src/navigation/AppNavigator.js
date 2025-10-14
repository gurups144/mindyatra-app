// src/navigation/AppNavigator.js
import { Ionicons } from "@expo/vector-icons"; // Use Expo icons
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import Screens
import ActivityHubScreen from "../screens/ActivityHubScreen";
import AIAnalysisScreen from "../screens/AIAnalysisScreen";
import BookingScreen from "../screens/BookingScreen";
import DepressionMeterScreen from "../screens/DepressionMeterScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
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
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Booking") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
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

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: "#6366f1" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
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
        name="DepressionMeter"
        component={DepressionMeterScreen}
        options={{ title: "Depression Assessment" }}
      />
      <Stack.Screen
        name="Unarathma"
        component={UnarathmaScreen}
        options={{ title: "Unarathma Service" }}
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
