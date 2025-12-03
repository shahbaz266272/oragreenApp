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
  const [line, setLine] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState(""); // e.g., Home, Work
  const [gender, setGender] = useState("");
  const [apartment, setApartment] = useState("");

  // Optional fields
  const [middleName, setMiddleName] = useState("");
  const [province, setProvince] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isDefault, setIsDefault] = useState(false);
  const [location, setLocation] = useState({
    type: "Point",
    coordinates: [33.6951, 72.9724],
  });

  const handleSave = async () => {
    if (
      !firstName ||
      !lastName ||
      !mobile ||
      !line ||
      !city ||
      !country ||
      !type ||
      !gender ||
      !apartment
    ) {
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

        <Text style={styles.label}>Middle Name</Text>
        <TextInput
          style={styles.input}
          value={middleName}
          onChangeText={setMiddleName}
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

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Address Info */}
        <Text style={styles.label}>Line*</Text>
        <TextInput style={styles.input} value={line} onChangeText={setLine} />

        <Text style={styles.label}>City*</Text>
        <TextInput style={styles.input} value={city} onChangeText={setCity} />

        <Text style={styles.label}>Province</Text>
        <TextInput
          style={styles.input}
          value={province}
          onChangeText={setProvince}
        />

        <Text style={styles.label}>Country*</Text>
        <TextInput
          style={styles.input}
          value={country}
          onChangeText={setCountry}
        />

        <Text style={styles.label}>Apartment*</Text>
        <TextInput
          style={styles.input}
          value={apartment}
          onChangeText={setApartment}
        />

        <Text style={styles.label}>Type* (Home / Work / Other)</Text>
        <TextInput style={styles.input} value={type} onChangeText={setType} />

        <Text style={styles.label}>Gender*</Text>
        <TextInput
          style={styles.input}
          value={gender}
          onChangeText={setGender}
        />

        <Text style={styles.label}>Content</Text>
        <TextInput
          style={styles.input}
          value={content}
          onChangeText={setContent}
          multiline
        />

        {/* Default Toggle */}
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Set as Default</Text>
          <Switch value={isDefault} onValueChange={setIsDefault} />
        </View>

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
