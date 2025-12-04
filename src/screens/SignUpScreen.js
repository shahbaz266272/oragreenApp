import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Image,
} from "react-native";
import authService from "../services/authService";
import authBackground from "../../assets/images/auth-background.png";
import authLogo from "../../assets/images/auth-logo.png";
import colors from "../theme/colors";

export default function SignUpScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (
      !firstName.trim() ||
      !email.trim() ||
      !password ||
      !phoneNumber.trim()
    ) {
      Alert.alert("Missing info", "All fields are required.");
      return;
    }

    setLoading(true);
    try {
      await authService.signUp({
        firstName: firstName.trim(),
        email: email.trim().toLowerCase(),
        password,
        mobile: phoneNumber.trim(),
      });

      Alert.alert("Account created", "You can now log in.", [
        {
          text: "Go to Login",
          onPress: () => navigation.navigate("LoginScreen"),
        },
      ]);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to sign up. Please try again.";
      Alert.alert("Sign up failed", message);
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
        <ScrollView contentContainerStyle={styles.container}>
          <Image
            source={authLogo}
            style={styles.heroLogo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Create Account</Text>
          <TextInput
            placeholder="First Name"
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            placeholder="Phone Number"
            keyboardType="phone-pad"
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerTextWrapper}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text style={[styles.footerText, styles.linkText]}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    paddingTop: 40,
  },
  container: {
    flexGrow: 1,
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
  linkText: {
    color: colors.primary,
    fontWeight: "600",
  },
});
