import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import ProductCarousel from "../components/ProductCarousel";

export default function HomeScreen({ navigation }) {
  const { width } = Dimensions.get("window");
  const sliderPadding = 24; // same as card padding
  const gap = 12; // gap between slides
  const sliderWidth = width - sliderPadding * 2; // container width available for slides
  const slideWidth = sliderWidth - gap; // width of each slide (leaves gap at right side)
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const images = [
    "https://plus.unsplash.com/premium_photo-1763466939715-c2efc8499f3b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1763466939715-c2efc8499f3b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1763466939715-c2efc8499f3b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1763466939715-c2efc8499f3b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (activeIndex + 1) % images.length;
      setActiveIndex(next);
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          x: next * (slideWidth + gap),
          animated: true,
        });
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [activeIndex, images.length, slideWidth, gap]);
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
            {images.map((uri, idx) => (
              <View key={uri} style={{ width: slideWidth, marginRight: gap }}>
                <Image
                  source={{ uri }}
                  style={[styles.slideImage, { width: slideWidth }]}
                />
              </View>
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {images.map((_, idx) => (
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

        <ProductCarousel
          title="Offers"
          items={[
            {
              id: "1",
              image:
                "https://www.shutterstock.com/image-vector/transparent-realistic-vector-mineral-water-600nw-2104613384.jpg",
              price: 170,
              originalPrice: 200,
              variant: "pack",
              discount: "-15%",
            },
            {
              id: "2",
              image:
                "https://www.shutterstock.com/image-vector/transparent-realistic-vector-mineral-water-600nw-2104613384.jpg",
              price: 172.73,
              originalPrice: 200,
              variant: "250ml",
              discount: "-13.6%",
            },
            {
              id: "3",
              image:
                "https://www.shutterstock.com/image-vector/transparent-realistic-vector-mineral-water-600nw-2104613384.jpg",
              price: 520,
              originalPrice: 600,
              variant: "1.5 litre",
              discount: "-13.3%",
            },
            {
              id: "4",
              image:
                "https://www.shutterstock.com/image-vector/transparent-realistic-vector-mineral-water-600nw-2104613384.jpg",
              price: 172.73,
              originalPrice: 200,
              variant: "250ml",
              discount: "-13.6%",
            },
            {
              id: "5",
              image:
                "https://www.shutterstock.com/image-vector/transparent-realistic-vector-mineral-water-600nw-2104613384.jpg",
              price: 520,
              originalPrice: 600,
              variant: "1.5 litre",
              discount: "-13.3%",
            },
          ]}
          onPressItem={(item) => navigation.navigate("ProductDetail", { item })}
          containerHeight={220}
        />

        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardIcon}>
              <MaterialCommunityIcons
                name="cellphone"
                size={32}
                color={colors.primary}
              />
            </View>
            <Text style={styles.cardTitle}>Features</Text>
            <Text style={styles.cardDescription}>
              Explore amazing features of this app
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <View style={styles.cardIcon}>
              <MaterialCommunityIcons
                name="rocket"
                size={32}
                color={colors.primary}
              />
            </View>
            <Text style={styles.cardTitle}>Performance</Text>
            <Text style={styles.cardDescription}>
              Built with performance in mind
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <View style={styles.cardIcon}>
              <MaterialCommunityIcons
                name="palette"
                size={32}
                color={colors.primary}
              />
            </View>
            <Text style={styles.cardTitle}>Design</Text>
            <Text style={styles.cardDescription}>
              Beautiful and intuitive UI
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <View style={styles.cardIcon}>
              <MaterialCommunityIcons
                name="flash"
                size={32}
                color={colors.primary}
              />
            </View>
            <Text style={styles.cardTitle}>Fast</Text>
            <Text style={styles.cardDescription}>
              Lightning-fast experience
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Getting Started</Text>
          <Text style={styles.infoText}>
            • Open the sidebar to navigate between screens
          </Text>
          <Text style={styles.infoText}>
            • Explore different features and settings
          </Text>
          <Text style={styles.infoText}>
            • Customize your experience in Settings
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
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
    height: 170,
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
