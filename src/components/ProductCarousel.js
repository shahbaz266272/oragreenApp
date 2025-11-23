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

export default function ProductCarousel({
  items = [],
  title = "Offers",
  onPressItem,
  containerHeight = 220,
}) {
  const { width } = Dimensions.get("window");
  const cardWidth = Math.round((width - 20 - 24) / 3); // approximate 3 items per row with padding

  const imageHeight = Math.round(containerHeight * 0.44);
  return (
    <View style={[styles.container, { height: containerHeight }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity style={styles.seeMoreButton} onPress={() => {}}>
          <Text style={styles.seeMoreText}>See More</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((item) => (
          <View key={item.id} style={[styles.card, { width: cardWidth }]}>
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
            <Text style={styles.variant}>{item.variant}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => onPressItem && onPressItem(item)}
            >
              <Text style={styles.addText}>Add To Cart</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
  scrollContent: {
    // paddingLeft: 8,
    // paddingRight: 8,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginRight: 12,
    paddingBottom: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.light,
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
    fontSize: 1,
  },
  addButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 6,
    borderRadius: 6,
    paddingVertical: 4,
    alignItems: "center",
  },
  addText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 10,
  },
});
