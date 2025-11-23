import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import colors from "../theme/colors";

const exampleOrders = [
  { id: "o1", title: "Order #1001", date: "2025-11-23", status: "Delivered" },
  { id: "o2", title: "Order #1002", date: "2025-11-20", status: "Shipped" },
];

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      <FlatList
        data={exampleOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderTitle}>{item.title}</Text>
            <Text style={styles.orderMeta}>{item.date}</Text>
            <Text style={styles.orderStatus}>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.light,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: colors.dark,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  orderTitle: {
    fontWeight: "700",
    color: colors.dark,
  },
  orderMeta: {
    color: colors.gray,
    fontSize: 12,
  },
  orderStatus: {
    marginTop: 6,
    color: colors.primary,
    fontWeight: "700",
  },
});
