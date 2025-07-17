import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

import { AppProvider, useAppContext } from "./context/AppContext"; // ✅ Budget + currency context
import { UserProvider } from "./context/UserContext"; // ✅ Profile context

import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import OtpScreen from "./screens/OtpScreen";
import HomeScreen from "./screens/HomeScreen";
import MoneyScreen from "./screens/MoneyScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MoneyTabIcon({ focused }) {
  const { currencySymbol } = useAppContext();
  return (
    <View
      style={{
        top: -20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#4A90E2",
        width: 70,
        height: 70,
        borderRadius: 35,
        shadowColor: "#4A90E2",
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        elevation: 8,
        borderWidth: focused ? 3 : 0,
        borderColor: "#fff",
      }}
    >
      <Text style={{ color: "#fff", fontSize: 40 }}>{currencySymbol}</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 10,
          height: 80,
          position: "absolute",
          borderRadius: 20,
          marginHorizontal: 20,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ marginTop: 10, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name={focused ? "home" : "home-outline"} size={28} color={focused ? "#4A90E2" : "#999"} />
              {focused && (
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#4A90E2", marginTop: 4 }} />
              )}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Money"
        component={MoneyScreen}
        options={{
          tabBarIcon: ({ focused }) => <MoneyTabIcon focused={focused} />,
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ marginTop: 10, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="ellipsis-horizontal" size={28} color={focused ? "#4A90E2" : "#999"} />
              {focused && (
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#4A90E2", marginTop: 4 }} />
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="OtpScreen" component={OtpScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </AppProvider>
  );
}
