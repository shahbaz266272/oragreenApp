import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import colors from "../theme/colors";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [saveData, setSaveData] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Enable dark theme</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#ccc", true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>Auto Update</Text>
              <Text style={styles.settingDescription}>
                Automatically update the app
              </Text>
            </View>
            <Switch
              value={autoUpdate}
              onValueChange={setAutoUpdate}
              trackColor={{ false: "#ccc", true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>Data Saver</Text>
              <Text style={styles.settingDescription}>Reduce data usage</Text>
            </View>
            <Switch
              value={saveData}
              onValueChange={setSaveData}
              trackColor={{ false: "#ccc", true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Terms of Service</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Help & Support</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.versionRow}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
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
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  settingInfo: {
    flex: 1,
    marginRight: 10,
  },
  settingText: {
    fontSize: 16,
    color: colors.dark,
    fontWeight: "500",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.gray,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  menuText: {
    fontSize: 16,
    color: colors.dark,
  },
  chevron: {
    fontSize: 24,
    color: colors.gray,
    fontWeight: "300",
  },
  versionRow: {
    paddingTop: 15,
    alignItems: "center",
  },
  versionText: {
    fontSize: 14,
    color: colors.gray,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
