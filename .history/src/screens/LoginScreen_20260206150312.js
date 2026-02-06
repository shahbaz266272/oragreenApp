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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setLoginInfo } from "../features/loginInfo/LoginInfo";
import authService from "../services/authService";
import authBackground from "../../assets/images/auth-background.png";
import authLogo from "../../assets/images/auth-logo.png";
import colors from "../theme/colors";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing info", "Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.loginWithEmail(
        email.trim().toLowerCase(),
        password,
      );

      const { jwt, user } = response?.data?.data || {};

      if (!jwt || !user) {
        throw new Error("Invalid response from server");
      }

      await AsyncStorage.multiSet([
        ["jwt", jwt],
        ["user", JSON.stringify(user)],
        ["isLoggedIn", "true"],
      ]);

      dispatch(
        setLoginInfo({
          jwt,
          user,
          isLoggedIN: true,
        }),
      );

      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (error) {
      console.log("Login error", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to login. Please try again.";
      Alert.alert("Login failed", message);
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.overlay}>
            <View style={styles.container}>
              <Image
                source={authLogo}
                style={styles.heroLogo}
                resizeMode="contain"
              />

              <Text style={styles.title}>Welcome Back</Text>

              <TextInput
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#000000"
              />

              <View style={styles.passwordWrapper}>
                <TextInput
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  style={[styles.input, styles.passwordInput]}
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#000000"
                />
                <TouchableOpacity
                  style={styles.toggleVisibility}
                  onPress={() => setShowPassword((prev) => !prev)}
                >
                  <Text style={styles.toggleText}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}
                style={styles.linkWrapper}
              >
                <Text style={styles.linkText}>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footerTextWrapper}>
                <Text style={styles.footerText}>New here? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                  <Text style={[styles.footerText, styles.linkText]}>
                    Create an account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  container: {
    width: "100%",
    justifyContent: "center",
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
    marginBottom: 20,
    fontWeight: "600",
    color: colors.primary,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  passwordWrapper: {
    width: "100%",
    position: "relative",
  },
  passwordInput: {
    paddingRight: 70,
    marginBottom: 0,
  },
  toggleVisibility: {
    position: "absolute",
    right: 16,
    top: 12,
  },
  toggleText: {
    color: colors.primary,
    fontWeight: "600",
  },
  linkWrapper: {
    alignSelf: "flex-end",
    marginVertical: 12,
  },
  linkText: {
    color: colors.primary,
    fontWeight: "600",
  },
  button: {
    backgroundColor: colors.blue,
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
  footerTextWrapper: {
    flexDirection: "row",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.primary,
  },
});
