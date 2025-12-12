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
import authService from "../services/authService";
import authBackground from "../../assets/images/auth-background.png";
import authLogo from "../../assets/images/auth-logo.png";
import colors from "../theme/colors";

const STEPS = {
  email: 0,
  otp: 1,
  reset: 2,
};

export default function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState(STEPS.email);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      Alert.alert("Missing info", "Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      await authService.sendForgotPasswordOtp(email.trim().toLowerCase());
      setStep(STEPS.otp);
      Alert.alert(
        "OTP sent",
        "Please check your email for the verification code."
      );
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send OTP. Please try again.";
      Alert.alert("Request failed", message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = () => {
    if (!otp.trim()) {
      Alert.alert("Missing info", "Enter the OTP sent to your email.");
      return;
    }
    setStep(STEPS.reset);
  };

  const handleResetPassword = async () => {
    if (!password || password.length < 6) {
      Alert.alert("Weak password", "Password should be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword: password,
      });

      Alert.alert("Success", "Password updated successfully.", [
        {
          text: "Back to Login",
          onPress: () => navigation.navigate("LoginScreen"),
        },
      ]);

      setStep(STEPS.email);
      setEmail("");
      setOtp("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to reset password. Please try again.";
      Alert.alert("Reset failed", message);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (step) {
      case STEPS.email:
        return (
          <>
            <Text style={styles.description}>
              Enter the email associated with your account and we will send an
              OTP.
            </Text>

            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleEmailSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </>
        );

      case STEPS.otp:
        return (
          <>
            <Text style={styles.description}>
              Enter the OTP sent to {email}.
            </Text>

            <TextInput
              placeholder="OTP"
              keyboardType="number-pad"
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleOtpSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryLink}
              onPress={handleEmailSubmit}
            >
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          </>
        );

      case STEPS.reset:
      default:
        return (
          <>
            <Text style={styles.description}>
              Create a new password for your account.
            </Text>

            <TextInput
              placeholder="New Password"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />

            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Update Password</Text>
              )}
            </TouchableOpacity>
          </>
        );
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
              <Text style={styles.title}>Forgot Password</Text>
              {renderContent()}
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
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
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
  description: {
    fontSize: 14,
    color: colors.secondary,
    textAlign: "center",
    marginBottom: 16,
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
  secondaryLink: { marginTop: 16 },
  resendText: {
    color: "#cce2ff",
    fontWeight: "600",
  },
});
