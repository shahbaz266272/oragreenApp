import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import colors from "../theme/colors";
import { useDispatch } from "react-redux";

export default function ProductCarousel({
  items = [],
  products = null,
  title = "Offers",
  onPressItem,
  carouselHeight = 220,
  containerHeight,
  showGrid = true,
  gridTitle = "Products",
}) {
  const { width } = Dimensions.get("window");
  const cardWidth = Math.round((width - 20 - 24) / 3);
  const effectiveCarouselHeight =
    typeof containerHeight !== "undefined" ? containerHeight : carouselHeight;
  const imageHeight = Math.round(effectiveCarouselHeight * 0.44);
  const effectiveGridTitle = gridTitle || "Products";
  const gridItems =
    Array.isArray(products) && products.length > 0 ? products : items;
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity style={styles.seeMoreButton} onPress={() => {}}>
          <Text style={styles.seeMoreText}>See More</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[styles.carouselWrapper, { height: effectiveCarouselHeight }]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {items.map((item) => (
            <View key={item.id} style={[styles.card, { width: cardWidth }]}>
              <TouchableOpacity
                style={styles.cardContent}
                onPress={() => onPressItem && onPressItem(item)}
                activeOpacity={0.85}
              >
                {item.discount ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.discount}</Text>
                  </View>
                ) : null}
                <Image
                  source={{ uri: item.image }}
                  style={[styles.image, { height: imageHeight }]}
                />
                <View style={styles.priceRow}>
                  <Text style={styles.price}>Rs {item.price}</Text>
                  {item.originalPrice ? (
                    <Text style={styles.originalPrice}>
                      Rs {item.originalPrice}
                    </Text>
                  ) : null}
                </View>
                {item.name ? (
                  <Text
                    style={styles.productName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.name}
                  </Text>
                ) : null}
                <Text style={styles.variant}>{item.variant}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  dispatch({ type: "cart/addToCart", payload: item })
                }
              >
                <Text style={styles.addText}>Add To Cart</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {showGrid ? (
        <View style={styles.gridSection}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{effectiveGridTitle}</Text>
            <TouchableOpacity style={styles.seeMoreButton} onPress={() => {}}>
              <Text style={styles.seeMoreText}>See More</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gridContainer}>
            {gridItems.map((item, index) => (
              <View
                key={`grid-${item.id}`}
                style={[
                  styles.card,
                  styles.gridCard,
                  index % 2 === 0 ? styles.gridCardLeft : styles.gridCardRight,
                ]}
              >
                <TouchableOpacity
                  style={styles.cardContent}
                  onPress={() => onPressItem && onPressItem(item)}
                  activeOpacity={0.85}
                >
                  {item.discount ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.discount}</Text>
                    </View>
                  ) : null}
                  <Image
                    source={{ uri: item.image }}
                    style={[
                      styles.image,
                      { height: Math.round(effectiveCarouselHeight * 0.45) },
                    ]}
                  />
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>Rs {item.price}</Text>
                    {item.originalPrice ? (
                      <Text style={styles.originalPrice}>
                        Rs {item.originalPrice}
                      </Text>
                    ) : null}
                  </View>
                  {item.name ? (
                    <Text
                      style={styles.productName}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.name}
                    </Text>
                  ) : null}
                  <Text style={styles.variant}>{item.variant}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() =>
                    dispatch({ type: "cart/addToCart", payload: item })
                  }
                >
                  <Text style={styles.addText}>Add To Cart</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal: 6,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.dark,
  },
  seeMoreButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  seeMoreText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 12,
  },
  scrollContent: {},
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginRight: 12,
    paddingBottom: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.light,
  },
  cardContent: {
    padding: 0,
  },
  badge: {
    position: "absolute",
    left: 8,
    top: 8,
    zIndex: 2,
    backgroundColor: colors.sidebarActive,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
  },
  image: {
    width: "100%",
    height: 80,
    resizeMode: "cover",
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
    paddingHorizontal: 8,
    paddingBottom: 6,
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
  variant: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    color: colors.gray,
    fontSize: 12,
  },
  productName: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 2,
    color: colors.dark,
    fontSize: 14,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 6,
    borderRadius: 6,
    paddingVertical: 4,
    alignItems: "center",
    margin: 6,
  },
  addText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 10,
  },
  carouselWrapper: {
    marginBottom: 10,
  },
  gridSection: {
    marginTop: 8,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridCard: {
    width: "48%",
    marginBottom: 12,
    // override margins used by carousel card
    marginRight: 0,
  },
  gridCardLeft: {
    marginRight: 0,
  },
  gridCardRight: {
    marginRight: 0,
  },
});
// (Removed duplicate styles block)
