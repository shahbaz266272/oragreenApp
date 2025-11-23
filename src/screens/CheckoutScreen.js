import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import colors from "../theme/colors";

export default function CheckoutScreen({ route, navigation }) {
  const { item } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      {item ? (
        <View style={{ marginVertical: 12 }}>
          <Text style={styles.label}>Item:</Text>
          <Text style={styles.value}>{item.variant}</Text>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.value}>Rs {item.price}</Text>
        </View>
      ) : (
        <Text style={styles.description}>No items in checkout</Text>
      )}
      <View style={{ marginTop: 12 }}>
        <Button
          title="Place Order"
          color={colors.primary}
          onPress={() => navigation.navigate("Orders")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.dark,
    marginBottom: 12,
  },
  label: {
    color: colors.gray,
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 6,
  },
  description: {
    color: colors.gray,
  },
});
