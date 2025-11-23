import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

export default function CustomDrawerContent(props) {
  return (
    <View style={styles.container}>
      <View style={styles.drawerHeader}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john.doe@example.com</Text>
          </View>
        </View>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.drawerSection}>
          <DrawerItemList {...props} />
        </View>

        <View style={styles.drawerSection}>
          <Text style={styles.sectionTitle}>More</Text>

          <DrawerItem
            label="Rate Us"
            icon={({ color, size }) => (
              <MaterialIcons name="star-border" size={size} color={color} />
            )}
            onPress={() => {
              console.log("Rate Us pressed");
            }}
            labelStyle={styles.drawerLabel}
          />

          <DrawerItem
            label="Share App"
            icon={({ color, size }) => (
              <MaterialIcons name="share" size={size} color={color} />
            )}
            onPress={() => {
              console.log("Share App pressed");
            }}
            labelStyle={styles.drawerLabel}
          />

          <DrawerItem
            label="Privacy Policy"
            icon={({ color, size }) => (
              <MaterialIcons name="lock-outline" size={size} color={color} />
            )}
            onPress={() => {
              console.log("Privacy Policy pressed");
            }}
            labelStyle={styles.drawerLabel}
          />
        </View>
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton}>
          <View style={styles.logoutInner}>
            <MaterialIcons name="logout" size={18} color={colors.danger} />
            <Text style={styles.logoutText}> Logout</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  drawerHeader: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.sidebarActive,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.light,
  },
  drawerContent: {
    paddingTop: 10,
  },
  drawerSection: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.gray,
    paddingHorizontal: 20,
    paddingVertical: 10,
    textTransform: "uppercase",
  },
  drawerLabel: {
    fontSize: 15,
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.light,
    padding: 20,
  },
  logoutButton: {
    backgroundColor: colors.light,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  logoutInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.danger,
  },
  versionText: {
    fontSize: 12,
    color: colors.gray,
    textAlign: "center",
  },
});
