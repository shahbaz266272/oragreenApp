import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";

import colors from "../theme/colors";
import ProductCarousel from "../components/ProductCarousel";
import { useSelector } from "react-redux";
import productService from "../services/productService";
import bannerService from "../services/BannerService";
import { getImageUrl } from "../services/utils";

export default function HomeScreen({ navigation }) {
  // Set up header with cart icon
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.length;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("cartScreen")}
          style={{ marginRight: 16 }}
        >
          <View style={{ position: "relative" }}>
            <Feather name="shopping-cart" size={24} color="white" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartCount > 9 ? "9+" : cartCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, cartCount]);
  const { width } = Dimensions.get("window");
  const sliderPadding = 24; // same as card padding
  const gap = 12; // gap between slides
  const sliderWidth = width - sliderPadding * 2; // container width available for slides
  const slideWidth = sliderWidth - gap; // width of each slide (leaves gap at right side)
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const managerId = "68f37574e486969ccd8109b1"; // your adminId
  const token = "BearerTokenHere"; // your JWT token

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ Loader state

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts(managerId, token);
      setProducts(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const getBanners = () => {
    setLoading(true); // start loader
    bannerService
      .getBanners()
      .then((banners) => {
        setBanners(banners?.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      })
      .finally(() => setLoading(false)); // stop loader
  };

  useEffect(() => {
    getBanners();
    fetchProducts();
  }, []);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const next = (activeIndex + 1) % banners.length;
  //     setActiveIndex(next);
  //     if (scrollRef.current) {
  //       scrollRef.current.scrollTo({
  //         x: next * (slideWidth + gap),
  //         animated: true,
  //       });
  //     }
  //   }, 3500);
  //   return () => clearInterval(interval);
  // }, [activeIndex, banners.length, slideWidth, gap]);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.welcomeSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: "center" }}
            ref={scrollRef}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / (slideWidth + gap)
              );
              setActiveIndex(index);
            }}
            snapToInterval={slideWidth + gap}
            decelerationRate="fast"
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              banners.map((item, idx) => (
                <View
                  key={item?.id ?? item?._id ?? idx}
                  style={{ width: slideWidth, marginRight: gap }}
                >
                  <Image
                    source={{
                      uri: `https://apioragreen.najeebmart.com/${item?.image?.path}`,
                    }}
                    style={[styles.slideImage, { width: slideWidth }]}
                  />
                </View>
              ))
            )}
          </ScrollView>
          <View style={styles.pagination}>
            {banners.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  idx === activeIndex ? styles.dotActive : null,
                ]}
              />
            ))}
          </View>
        </View>
        {loadingProducts ? (
          <ActivityIndicator
            size="large"
            color="blue"
            style={{ marginTop: 20 }}
          />
        ) : (
          <ProductCarousel
            title="Products"
            items={products.filter((data) => data?.sku?.price?.discount > 0)}
            products={products}
            onPressItem={(item) =>
              navigation.navigate("ProductDetail", { item })
            }
            containerHeight={220}
          />
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  cartBadge: {
    position: "absolute",
    right: -8,
    top: -8,
    backgroundColor: colors.danger || "#ff5252",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollContent: {
    padding: 20,
  },
  welcomeSection: {
    borderRadius: 12,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    width: "48%",
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIcon: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.dark,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.gray,
  },
  infoSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  slideImage: {
    height: 200,
    borderRadius: 10,
    backgroundColor: "#ddd",
  },
  slideOverlay: {
    position: "absolute",
    left: 24,
    top: 24,
    right: 24,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.dark,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: colors.gray,
    marginBottom: 8,
    lineHeight: 22,
  },
});
