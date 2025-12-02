// OrderSuccessScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";

export default function OrderSuccessScreen() {
  const navigation = useNavigation();

  const handleGoToOrders = () => {
    navigation.navigate("Orders"); // Make sure 'MyOrders' is a valid route in your navigator
  };

  return (
    <View style={styles.container}>
      {/* Animated checkmark */}
      <Animatable.View
        animation="bounceIn"
        duration={1500}
        style={styles.iconContainer}
      >
        <Text style={styles.checkmark}>✅</Text>
      </Animatable.View>

      {/* Animated message */}
      <Animatable.Text
        animation="fadeInUp"
        delay={500}
        duration={1000}
        style={styles.message}
      >
        Order Placed Successfully!
      </Animatable.Text>

      <Animatable.Text
        animation="fadeInUp"
        delay={1000}
        duration={1000}
        style={styles.subMessage}
      >
        Thank you for your order. You can track it in My Orders.
      </Animatable.Text>

      {/* Button at bottom */}
      <TouchableOpacity style={styles.button} onPress={handleGoToOrders}>
        <Text style={styles.buttonText}>Go to My Orders</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  iconContainer: {
    marginBottom: 30,
    backgroundColor: "#e0ffe0",
    padding: 30,
    borderRadius: 100,
  },
  checkmark: {
    fontSize: 60,
  },
  message: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 50,
  },
  button: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
