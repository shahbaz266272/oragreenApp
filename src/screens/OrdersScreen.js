import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import colors from "../theme/colors";
import orderService from "../services/orderService";
import { getImageUrl } from "../services/utils";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ Loader state

  const getOrders = () => {
    setLoading(true); // start loader
    orderService
      .getUserOrders()
      .then((orders) => {
        setOrders(orders?.data?.reverse() || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false)); // stop loader
  };

  useEffect(() => {
    getOrders();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.header}>
        <Text style={styles.invoice}>Invoice: {item.invoiceNo}</Text>
        <Text
          style={[
            styles.status,
            item.status === "delivered" ? styles.delivered : styles.new,
          ]}
        >
          {item.status.toUpperCase()}
        </Text>
      </View>

      <Text style={styles.customer}>
        {item.shippingInfo.firstName} {item.shippingInfo.lastName} -{" "}
        {item.shippingInfo.city}
      </Text>

      <FlatList
        data={item.items}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.productsList}
        renderItem={({ item: product }) => (
          <View style={styles.productCard}>
            <Image
              source={{ uri: getImageUrl(product?.productDetail?.image?.path) }}
              style={styles.productImage}
            />
            <Text style={styles.productTitle}>
              {product.productDetail.title}
            </Text>
            <Text style={styles.productQty}>Qty: {product.quantity}</Text>
            <Text style={styles.productPrice}>RS{product.price.sale}</Text>
          </View>
        )}
      />

      <Text style={styles.total}>Grand Total: RS{item.grandTotal}</Text>
      <Text style={styles.date}>
        Ordered on: {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>

      {loading ? (
        // ✅ Show loader while fetching
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: colors.dark,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  invoice: {
    fontWeight: "700",
    color: colors.dark,
  },
  status: {
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    color: colors.white,
    fontSize: 12,
  },
  delivered: { backgroundColor: colors.green },
  new: { backgroundColor: colors.primary },
  customer: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
  },
  productsList: {
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: colors.light,
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
    alignItems: "center",
    width: 120,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: "cover",
  },
  productTitle: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  productQty: {
    fontSize: 12,
    color: colors.gray,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
    color: colors.dark,
  },
  total: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: colors.gray,
  },
});
