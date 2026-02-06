import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import colors from "../theme/colors";
import { useSelector, useDispatch } from "react-redux";
import { increaseQty, decreaseQty } from "../features/cart/cartSlice";
import { getImageUrl } from "../services/utils";
import axios from "axios";
import { useState } from "react";

export default function CheckoutScreen({ navigation }) {
  const dispatch = useDispatch();
  const loginItems = useSelector((state) => state.loginInfo?.item);
  console.log(loginItems, "00");
  const cartItems = useSelector((state) => state.cart.items);
  const selectedAddress = useSelector((state) => state.selectedAddress?.item);
  const [loading, setLoading] = useState(false);
  /** ------------ PRICE CALCULATIONS ------------ */
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.sku.price.sale * item.quantity,
    0,
  );

  const deliveryFee = "Free";
  const total = subtotal + (deliveryFee === "Free" ? 0 : deliveryFee);

  /** ------------ UI ------------ */
  const createOrderBody = () => {
    if (!selectedAddress || cartItems.length === 0) return null;

    const subTotal = cartItems.reduce(
      (sum, item) => sum + item.sku.price.sale * item.quantity,
      0,
    );

    const shipping = 200;
    const grandTotal = subTotal + shipping;

    return {
      status: "new",
      subTotal: subTotal,
      tax: 0,
      flatDiscount: 0,
      userId: loginItems?.user?._id,
      shippingInfo: {
        firstName: selectedAddress.firstName,
        lastName: selectedAddress.lastName,
        mobile: selectedAddress.mobile,
        line: selectedAddress.line,
        city: selectedAddress.city,
        country: selectedAddress.country,
        type: selectedAddress.type,
        gender: selectedAddress.gender,
        apartment: selectedAddress.apartment,
        subTotal,
        grandTotal,
        location: {
          type: "Point",
          coordinates: [33.6951, 72.9724],
        },
        userId: loginItems?.user?._id,
      },
      items: cartItems.map((item) => ({
        productId: item._id,
        categoryId: item.categoryId,
        subCategoryId: item.subCategoryId,
        productCategoryId: item.productCategoryId,
        brandId: item.brandId,
        quantity: item.quantity,
        price: {
          base: item.sku.price.base,
          discount: item.sku.price.discount,
          sale: item.sku.price.sale,
        },
      })),
      shipping,
      grandTotal,
    };
  };
  const placeOrder = async () => {
    const body = createOrderBody();
    if (!body) {
      alert("Missing address or cart items!");
      return;
    }
    console.log(loginItems, loginItems?.user?._id, loginItems?.jwt);
    setLoading(true);
    try {
      const response = await axios.post(
        `https://apioragreen.najeebmart.com/api/v1/app/user/orders/${loginItems?.user?._id}`,
        body,
        {
          headers: {
            "x-api-key":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXBwIiwidGl0bGUiOiJ0b2tlbiBmb3IgYXBpIGtleSIsImlhdCI6MTYzNjQ0ODczOH0.zmvB5qcMd5k_-A2igZjpZppjc-C_PYVb2Saapo38Gi4",
            Authorization: `Bearer ${loginItems?.jwt}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("ORDER SUCCESS:", response.data);

      navigation.navigate("OrderSuccess");
    } catch (error) {
      console.log("ORDER ERROR:", error.response?.data || error.message);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

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
                <Text style={styles.price}>Rs-{item.sku.price.sale}</Text>
                {item.sku.price.discount > 0 && (
                  <Text style={styles.originalPrice}>
                    Rs {item.sku.price.base}
                  </Text>
                )}
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.price}>Quantity:</Text>

                <Text style={styles.price}>{item.quantity}</Text>
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
          <Text style={styles.addressText}>{selectedAddress.content}</Text>
          <Text style={styles.addressText}>
            {` ${selectedAddress.content}`}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Address")}>
            <Text style={styles.change}>Change Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addAddress}
          onPress={() => navigation.navigate("Address")}
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
          <Text>{deliveryFee}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.total}>Rs {total}</Text>
        </View>
      </View>

      {/* ================= PLACE ORDER ================= */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <TouchableOpacity
          disabled={!cartItems.length || !selectedAddress}
          onPress={placeOrder}
          style={[
            styles.placeOrderButton,
            (!cartItems.length || !selectedAddress) && { opacity: 0.5 },
          ]}
        >
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
        </TouchableOpacity>
      )}
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
  placeOrderButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },

  placeOrderButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
