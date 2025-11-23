import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import colors from "../theme/colors";

export default function ProfileScreen() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceText}>Push Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#ccc", true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
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
  avatarSection: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 30,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.white,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.dark,
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.light,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  preferenceText: {
    fontSize: 16,
    color: colors.dark,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
