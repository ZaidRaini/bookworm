import { View, ActivityIndicator } from "react-native";
import React from "react";
import COLORS from "@/constant/colors";

type LoaderSize = "small" | "large" | number;

const Loader = ({ size = "large" }: { size: LoaderSize }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <ActivityIndicator color={COLORS.primary} size={size} />
    </View>
  );
};

export default Loader;
