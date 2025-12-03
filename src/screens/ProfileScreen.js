import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import colors from "../theme/colors";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function ProfileScreen() {
  const loginItems = useSelector((state) => state.loginInfo?.item);

  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [notifications, setNotifications] = useState(true);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
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
        `https://apioragreen.najeebmart.com/api/v1/app/user/${user._id}`,
        {
          firstName,
          lastName,
          middleName: "",
        },
        {
          headers: {
            "x-api-key":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXBwIiwidGl0bGUiOiJ0b2tlbiBmb3IgYXBpIGtleSIsImlhdCI6MTYzNjQ0ODczOH0.zmvB5qcMd5k_-A2igZjpZppjc-C_PYVb2Saapo38Gi4",

            Authorization: `Bearer ${loginItems?.jwt}`,
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
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          {/* <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Photo</Text>
          </TouchableOpacity> */}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <Text style={styles.label}>Name</Text>
          <View style={styles.inputGroupN}>
            <TextInput
              style={styles.input}
              value={`${user?.firstName} ${user?.lastName}`}
              onChangeText={setName}
              placeholder="Enter your name"
              readOnly
            />
            <TouchableOpacity onPress={() => setEditVisible(true)}>
              <MaterialIcons name="edit" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={user?.mobile}
              onChangeText={setEmail}
              placeholder="Enter Mobile"
              keyboardType="email-address"
              readOnly
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal visible={editVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Name</Text>

            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
              style={styles.inputn}
            />

            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
              style={styles.inputn}
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
  inputGroupN: {
    marginBottom: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
    width: "100%",
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
  modalButtons: { flexDirection: "row", justifyContent: "flex-end" },
  cancelBtn: { padding: 12, marginRight: 10 },
  cancelText: { color: colors.gray, fontSize: 16 },

  saveBtn: {
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  inputn: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
});
