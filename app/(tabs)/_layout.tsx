import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constant/colors";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabLayout = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        headerTitleStyle: {
          color: COLORS.textPrimary,
          backgroundColor: COLORS.textPrimary,
        },
        tabBarStyle: {
          position: "absolute",
          bottom: 2 + insets.bottom,
          height: 60 + insets.bottom,
          borderRadius: 45,
          margin: 10,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 5,
          shadowColor: "black",
        },
        tabBarButton: (props) => (
          <View style={{ flex: 1 }}>
            <Pressable
              {...props}
              android_ripple={null}
              style={({ pressed }) => [
                props.style,
                {
                  opacity: 1, // Force opacity to 1 to remove iOS press effect
                  backgroundColor: "transparent",
                },
              ]}
            />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",

          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
