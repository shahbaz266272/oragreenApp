import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import colors from "../theme/colors";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  increaseQty,
  decreaseQty,
  removeFromCart,
} from "../features/cart/cartSlice";

import { getImageUrl } from "../services/utils";

export default function CartScreen({ navigation }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>

      <View style={styles.listContainer}>
        {cartItems?.length > 0 ? (
          cartItems.map((item) => (
            <View key={item._id} style={styles.fullCard}>
              {/* DELETE ICON */}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => dispatch(removeFromCart(item._id))}
              >
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={22}
                  color="red"
                />
              </TouchableOpacity>

              {/* Product Image */}
              <Image
                source={{ uri: getImageUrl(item?.image?.path) }}
                style={styles.image}
              />

              {/* Info */}
              <View style={styles.infoSection}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.title}
                </Text>

                <View style={styles.priceRow}>
                  <Text style={styles.price}>Rs {item.sku?.price?.sale}</Text>
                  {item.sku?.price?.base > 0 && (
                    <Text style={styles.originalPrice}>
                      Rs {item.sku?.price?.base}
                    </Text>
                  )}
                </View>

                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => dispatch(decreaseQty(item._id))}
                  >
                    <Text style={styles.qtyButtonText}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.qtyValue}>{item.quantity}</Text>

                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => dispatch(increaseQty(item._id))}
                  >
                    <Text style={styles.qtyButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.description}>No items in checkout</Text>
        )}
      </View>

      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          style={[styles.actionButton]}
          activeOpacity={0.8}
          onPress={() =>
            cartItems?.length > 0
              ? navigation.navigate("Checkout")
              : navigation.navigate("Main")
          }
        >
          <Text style={styles.actionButtonText}>
            {cartItems?.length > 0 ? "Place Order" : "Add Items"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: colors.blue,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },

  disabledButton: {
    backgroundColor: colors.gray,
    opacity: 0.7,
  },

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

  /** FULL-WIDTH CARD */
  listContainer: {
    marginTop: 6,
  },
  fullCard: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.light,
    flexDirection: "row",
    alignItems: "center",
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },

  infoSection: {
    flex: 1,
  },

  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 4,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  price: {
    color: colors.dark,
    fontWeight: "700",
    marginRight: 6,
  },
  originalPrice: {
    color: colors.gray,
    textDecorationLine: "line-through",
    fontSize: 12,
  },

  /** Quantity UI */
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    marginTop: -2,
  },
  qtyValue: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
  },

  description: {
    color: colors.gray,
  },
  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
});
