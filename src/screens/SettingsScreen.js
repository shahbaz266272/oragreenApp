import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import colors from "../theme/colors";

export default function SettingsScreen() {
  const [user, setUser] = useState(null);

  // Edit Modal States
  const [editVisible, setEditVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUser();
  }, [editVisible]);

  const loadUser = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (userString) {
        const parsed = JSON.parse(userString);
        setUser(parsed);
        setFirstName(parsed.firstName || "");
        setLastName(parsed.lastName || "");
      }
    } catch (error) {
      console.log("Error loading user:", error);
    }
  };

  const getInitials = () => {
    if (!user) return "";
    const f = user.firstName?.charAt(0) || "";
    const l = user.lastName?.charAt(0) || "";
    return (f + l).toUpperCase();
  };

  // -------------------------
  // UPDATE USER NAME API CALL
  // -------------------------
  const updateName = async () => {
    if (!firstName.trim() || !lastName.trim()) return;

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("jwt"); // Store token when login

      const response = await axios.put(
        `http://localhost:8985/api/v1/app/user/${user._id}`,
        {
          firstName,
          lastName,
          middleName: "",
        },
        {
          headers: {
            "x-api-key":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXBwIiwidGl0bGUiOiJ0b2tlbiBmb3IgYXBpIGtleSIsImlhdCI6MTYzNjQ0ODczOH0.zmvB5qcMd5k_-A2igZjpZppjc-C_PYVb2Saapo38Gi4",

            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.data;
      console.log(updatedUser, "--");
      // Save updated user to AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      // Update UI
      setUser(updatedUser);
      setEditVisible(false);
    } catch (error) {
      console.log("Error updating user:", error.response?.data || error);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* USER PROFILE SECTION */}
        {user && (
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </View>

            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>
                  {user.firstName} {user.lastName}
                </Text>

                <TouchableOpacity onPress={() => setEditVisible(true)}>
                  <MaterialIcons name="edit" size={22} color={colors.primary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.userPhone}>{user.mobile}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ----------------------- */}
      {/* EDIT NAME MODAL         */}
      {/* ----------------------- */}
      <Modal visible={editVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Name</Text>

            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
              style={styles.input}
            />

            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={updateName}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  scrollContent: { padding: 20 },

  profileSection: {
    backgroundColor: colors.white,
    padding: 25,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 30, color: colors.white, fontWeight: "bold" },

  userInfo: { marginLeft: 20, flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center" },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.dark,
    marginRight: 10,
  },
  userPhone: { marginTop: 6, color: colors.gray, fontSize: 16 },

  // MODAL
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.dark,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },

  modalButtons: { flexDirection: "row", justifyContent: "flex-end" },
  cancelBtn: { padding: 12, marginRight: 10 },
  cancelText: { color: colors.gray, fontSize: 16 },

  saveBtn: {
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
