import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

export default function LoginScreen({ navigation }) {
  const [mobile, setMobile] = useState("");
  const formatMobile = (input) => {
    let number = input.replace(/\D/g, ""); // remove all non-numeric chars

    // If starts with 0 → replace 0 with 92
    if (number.startsWith("0")) {
      return "92" + number.substring(1);
    }

    // If starts with country code but missing 9
    if (number.startsWith("92") && number.length === 10) {
      return "92" + number;
    }

    // If starts with '920' → remove extra zero
    if (number.startsWith("920")) {
      return "92" + number.substring(3);
    }

    // If already correct format (923xxxxxxxx)
    if (number.startsWith("923") && number.length === 12) {
      return number;
    }

    return number; // fallback (rare cases)
  };

  const handleLogin = async () => {
    if (!mobile) {
      Alert.alert("Error", "Please enter your mobile number");
      return;
    }

    const formattedMobile = formatMobile(mobile);

    try {
      const response = await axios.post(
        "https://apioragreen.najeebmart.com/api/v1/app/user/register-login",
        { mobile: formattedMobile, email: `user${Math.random()}@mail.com` },
        {
          headers: {
            "x-api-key":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXBwIiwidGl0bGUiOiJ0b2tlbiBmb3IgYXBpIGtleSIsImlhdCI6MTYzNjQ0ODczOH0.zmvB5qcMd5k_-A2igZjpZppjc-C_PYVb2Saapo38Gi4",
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        console.log(response, "-=-=");
        const { _id, deviceToken } = response?.data?.data;

        navigation.navigate("VerifyOtpScreen", { _id, deviceToken });
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to send OTP");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Enter Mobile Number"
        keyboardType="phone-pad"
        style={styles.input}
        value={mobile}
        onChangeText={setMobile}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Send OTP</Text>
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
  },
  title: { fontSize: 24, marginBottom: 20 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
});
