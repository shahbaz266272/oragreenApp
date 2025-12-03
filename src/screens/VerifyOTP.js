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
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Import AsyncStorage
import { setLoginInfo } from "../features/loginInfo/LoginInfo";
import { useDispatch } from "react-redux";

export default function VerifyOtpScreen({ route, navigation }) {
  const { _id, deviceToken } = route.params;
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const handleVerify = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter OTP");
      return;
    }

    try {
      const response = await axios.post(
        "https://apioragreen.najeebmart.com/api/v1/app/user/verify-phone-otp",
        { otp, deviceToken, userId: _id },
        {
          headers: {
            "x-api-key":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXBwIiwidGl0bGUiOiJ0b2tlbiBmb3IgYXBpIGtleSIsImlhdCI6MTYzNjQ0ODczOH0.zmvB5qcMd5k_-A2igZjpZppjc-C_PYVb2Saapo38Gi4",
            "Content-Type": "application/json",
          },
        }
      );

      const { jwt, user } = response.data.data;

      // ✅ Save JWT and user info to AsyncStorage
      dispatch(
        setLoginInfo({
          jwt: jwt,
          user: user,
          isLoggedIN: true,
        })
      );
      await AsyncStorage.setItem("jwt", jwt);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("isLoggedIn", JSON.stringify("true"));

      console.log("JWT and user saved locally:", jwt, user);

      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Invalid OTP");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <TextInput
        placeholder="Enter OTP"
        keyboardType="number-pad"
        style={styles.input}
        value={otp}
        onChangeText={setOtp}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify OTP</Text>
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
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
});
