import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../theme/colors";

export default function AddAddressScreen({ navigation }) {
  // Required fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [line, setLine] = useState("1");
  const [city, setCity] = useState("Islamabad");
  const [country, setCountry] = useState("Pakistan");
  const [type, setType] = useState("Work"); // e.g., Home, Work
  const [gender, setGender] = useState("Male");
  const [apartment, setApartment] = useState("1");

  // Optional fields
  const [middleName, setMiddleName] = useState("");
  const [province, setProvince] = useState("Islamabad Capital Territory");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isDefault, setIsDefault] = useState(true);
  const [location, setLocation] = useState({
    type: "Point",
    coordinates: [33.6951, 72.9724],
  });

  const handleSave = async () => {
    if (!firstName || !lastName || !content) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    try {
      // Load existing addresses
      const existing = await AsyncStorage.getItem("@addresses");
      let parsed = existing ? JSON.parse(existing) : [];

      // If marking new address as default, unset previous default
      if (isDefault) {
        parsed = parsed.map((addr) => ({ ...addr, isDefault: false }));
      }

      const newAddress = {
        id: Date.now().toString(),
        firstName,
        middleName,
        lastName,
        mobile,
        email,
        line,
        city,
        province,
        country,
        isActive,
        isDefault,
        content,
        type,
        gender,
        apartment,
        location,
      };

      parsed.push(newAddress);
      await AsyncStorage.setItem("@addresses", JSON.stringify(parsed));
      navigation.goBack();
    } catch (e) {
      console.log("Error saving address", e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Personal Info */}
        <Text style={styles.label}>First Name*</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Last Name*</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Mobile*</Text>
        <TextInput
          style={styles.input}
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />

        {/* Address Info */}
        <Text style={styles.label}>Complete Address</Text>
        <TextInput
          style={styles.input}
          value={content}
          onChangeText={setContent}
          multiline
        />

        <View style={{ marginTop: 24, marginBottom: 40 }}>
          <Button
            title="Save Address"
            color={colors.primary}
            onPress={handleSave}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: colors.light,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.dark,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.light,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
