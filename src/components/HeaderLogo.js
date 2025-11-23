import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import colors from "../theme/colors";

export default function HeaderLogo({ title }) {
  // keep small logo for header
  let tplTitle = title;
  if (typeof title === "object" && title && title.props) {
    // If children includes nested text, fallback to blank
    tplTitle = title.props.children || "";
  }
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/splash.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text numberOfLines={1} style={styles.title}>
        {tplTitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 36,
    height: 28,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    color: colors.white,
    fontWeight: "700",
  },
});
