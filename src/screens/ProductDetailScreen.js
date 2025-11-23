import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ScrollView,
} from "react-native";
import colors from "../theme/colors";

export default function ProductDetailScreen({ route, navigation }) {
  const { item } = route.params || {};
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: item?.image }} style={styles.image} />
      <Text style={styles.title}>{item?.variant || "Product"}</Text>
      <Text style={styles.price}>Rs {item?.price}</Text>
      {item?.originalPrice ? (
        <Text style={styles.originalPrice}>Rs {item?.originalPrice}</Text>
      ) : null}
      <Text style={styles.description}>
        This is a placeholder product detail screen. You can show product
        description, variants, reviews and other details here.
      </Text>
      <View style={{ marginTop: 24 }}>
        <Button
          title="Proceed to Checkout"
          color={colors.primary}
          onPress={() => navigation.navigate("Checkout", { item })}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.light,
    flexGrow: 1,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.dark,
    marginBottom: 8,
  },
  price: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: colors.gray,
  },
  description: {
    color: colors.gray,
    marginTop: 12,
    textAlign: "left",
    width: "100%",
  },
});
