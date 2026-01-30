import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import colors from "../theme/colors";
import { addToCart } from "../features/cart/cartSlice";
import { useDispatch } from "react-redux";
import { getImageUrl } from "../services/utils";

export default function ProductDetailScreen({ route, navigation }) {
  const { item } = route.params || {};
  const dispatch = useDispatch();
  const handleAdd = (item) => {
    dispatch(addToCart(item));
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: getImageUrl(item?.image?.path) }}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.info}>
          <Text style={styles.title}>
            {item?.title || item?.variant || "Product"}
          </Text>
          <Text style={styles.quantity}>Quantity: 1</Text>
          <View style={styles.priceWrapper}>
            <Text style={styles.price}>Rs {item?.sku?.price?.sale}</Text>
            <Text style={styles.originalPrice}>
              {item?.sku?.price?.discount !== 0 &&
                `Rs ${item?.sku?.price?.base}`}
            </Text>
          </View>
          <View style={styles.descriptionWrapper}>
            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              <Text style={styles.description}>{item?.content}</Text>
            </ScrollView>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleAdd(item);
          navigation.navigate("cartScreen", { item });
        }}
      >
        <Text style={styles.buttonText}>Add To Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.light,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 24,
  },
  image: {
    width: "100%",
    height: 260,
  },
  info: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.dark,
    marginBottom: 8,
  },
  quantity: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
  },
  priceWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 16,
    color: colors.gray,
    textDecorationLine: "line-through",
  },
  description: {
    fontSize: 15,
    color: colors.gray,
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  descriptionWrapper: {
    width: "100%",
    maxHeight: 220, // adjust as you want
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
});
