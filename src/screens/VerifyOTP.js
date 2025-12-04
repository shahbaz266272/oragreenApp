import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground,
  Image,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Import AsyncStorage
import { setLoginInfo } from "../features/loginInfo/LoginInfo";
import { useDispatch } from "react-redux";
import authBackground from "../../assets/images/auth-background.png";
import authLogo from "../../assets/images/auth-logo.png";
import colors from "../theme/colors";

export default function VerifyOtpScreen({ route, navigation }) {
  const { _id, deviceToken } = route.params;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleVerify = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter OTP");
      return;
    }
    setLoading(true);
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

      const { jwt, user } = await response.data.data;

      // ✅ Save JWT and user info to AsyncStorage
      dispatch(
        setLoginInfo({
          jwt: response.data.data?.jwt,
          user: response.data.data?.user,
          isLoggedIN: true,
        })
      );
      await AsyncStorage.setItem("jwt", response.data.data?.jwt);
      await AsyncStorage.setItem(
        "user",
        JSON.stringify(response.data.data?.user)
      );
      await AsyncStorage.setItem("isLoggedIn", JSON.stringify("true"));

      console.log("JWT and user saved locally:", jwt, user);

      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={authBackground}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image
            source={authLogo}
            style={styles.heroLogo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the code we sent to your phone number.
          </Text>
          <TextInput
            placeholder="Enter OTP"
            keyboardType="number-pad"
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerLink}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.linkText}>Wrong number? Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  heroLogo: {
    width: 140,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 6,
    fontWeight: "600",
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 4,
    fontSize: 18,
    color: colors.primary,
  },
  button: {
    backgroundColor: colors.blue,
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
  footerLink: {
    marginTop: 24,
  },
  linkText: {
    color: colors.primary,
    fontWeight: "600",
  },
});
