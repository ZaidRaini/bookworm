import { View, Text, StyleSheet } from "react-native";
import React, { ReactNode } from "react";
import COLORS from "@/constant/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeScreenProps {
  children: ReactNode; // Explicitly type children
}

export default function SafeScreen({ children }: SafeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.conatiner, { paddingTop: insets.top }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
