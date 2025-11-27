import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import colors from "../theme/colors";
import { useSelector, useDispatch } from "react-redux";
import { increaseQty, decreaseQty } from "../features/cart/cartSlice";
import { getImageUrl } from "../services/utils";

export default function CheckoutScreen({ navigation }) {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const selectedAddress = useSelector((state) => state.selectedAddress.item);
  console.log(selectedAddress, "1--tye");
  /** ------------ PRICE CALCULATIONS ------------ */
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.sku.price.sale * item.quantity,
    0
  );

  const deliveryFee = 200;
  const total = subtotal + deliveryFee;

  /** ------------ UI ------------ */
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Checkout</Text>

      {/* ================= PRODUCTS ================= */}
      <Text style={styles.sectionTitle}>Items</Text>

      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <View key={item._id} style={styles.fullCard}>
            <Image
              source={{ uri: getImageUrl(item?.image?.path) }}
              style={styles.image}
            />

            <View style={styles.infoSection}>
              <Text style={styles.productName} numberOfLines={1}>
                {item.title}
              </Text>

              <View style={styles.priceRow}>
                <Text style={styles.price}>Rs {item.sku.price.sale}</Text>
                {item.sku.price.base > 0 && (
                  <Text style={styles.originalPrice}>
                    Rs {item.sku.price.base}
                  </Text>
                )}
              </View>

              {/* Quantity */}
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
        <Text style={styles.description}>No items in cart</Text>
      )}

      {/* ================= ADDRESS ================= */}
      <Text style={styles.sectionTitle}>Delivery Address</Text>

      {selectedAddress ? (
        <View style={styles.addressCard}>
          <Text style={styles.addressName}>
            {[
              selectedAddress.firstName,
              selectedAddress.middleName,
              selectedAddress.lastName,
            ]
              .filter(Boolean)
              .join(" ")}{" "}
            ({selectedAddress.type})
          </Text>

          <Text style={styles.addressText}>
            Apt {selectedAddress.apartment}, Line {selectedAddress.line},{" "}
            {selectedAddress.city}, {selectedAddress.province},{" "}
            {selectedAddress.country}
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate("Addresses")}>
            <Text style={styles.change}>Change Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addAddress}
          onPress={() => navigation.navigate("AddAddress")}
        >
          <Text style={styles.addAddressText}>+ Add Address</Text>
        </TouchableOpacity>
      )}

      {/* ================= PAYMENT ================= */}
      <Text style={styles.sectionTitle}>Payment Summary</Text>

      <View style={styles.paymentCard}>
        <View style={styles.row}>
          <Text>Subtotal</Text>
          <Text>Rs {subtotal}</Text>
        </View>

        <View style={styles.row}>
          <Text>Delivery Fee</Text>
          <Text>Rs {deliveryFee}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.total}>Rs {total}</Text>
        </View>
      </View>

      {/* ================= PLACE ORDER ================= */}
      <Button
        title="Place Order"
        color={colors.primary}
        disabled={!cartItems.length || !selectedAddress}
        onPress={() => navigation.navigate("Orders")}
      />
    </ScrollView>
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
    fontWeight: "700",
    marginBottom: 16,
    color: colors.dark,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 12,
  },

  fullCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
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
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },

  price: {
    fontWeight: "700",
    marginRight: 6,
  },

  originalPrice: {
    textDecorationLine: "line-through",
    fontSize: 12,
    color: colors.gray,
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  qtyButton: {
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  qtyButtonText: {
    color: colors.white,
    fontSize: 18,
  },

  qtyValue: {
    marginHorizontal: 12,
  },

  addressCard: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },

  addressName: {
    fontWeight: "700",
  },

  addressText: {
    color: colors.gray,
    marginVertical: 4,
  },

  change: {
    color: colors.primary,
    fontWeight: "600",
    marginTop: 4,
  },

  addAddress: {
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginBottom: 16,
  },

  addAddressText: {
    color: colors.primary,
    fontWeight: "700",
  },

  paymentCard: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },

  divider: {
    height: 1,
    backgroundColor: colors.light,
    marginVertical: 8,
  },

  totalLabel: {
    fontWeight: "700",
  },

  total: {
    fontWeight: "700",
    color: colors.primary,
  },

  description: {
    color: colors.gray,
  },
});
