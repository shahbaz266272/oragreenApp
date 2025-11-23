import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../theme/colors";

export default function DrawerIcon({ name, focused, size = 22, color }) {
  const bg = focused ? colors.sidebarActive : "transparent";
  const iconColor = focused ? colors.white : color || colors.gray;
  return (
    <View style={[styles.container, focused && { backgroundColor: bg }]}>
      <MaterialCommunityIcons name={name} size={size} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
