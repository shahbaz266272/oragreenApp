import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  useDrawerStatus,
} from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import DrawerIcon from "./DrawerIcon";

export default function CustomDrawerContent(props) {
  const { navigation } = props; // <-- use the navigation prop directly
  const status = useDrawerStatus(); // <-- returns 'open' | 'closed'
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [loggedOutPress, setloggedOutPress] = useState(false);
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          setUser(JSON.parse(userString));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log("Error loading user:", error);
      }
    };
    const loadLoggedIN = async () => {
      try {
        const userString = await AsyncStorage.getItem("isLoggedIn");
        if (userString) {
          setIsLoggedIn(JSON.parse(userString));
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.log("Error loading isloggedin:", error);
      }
    };

    loadUser();
    loadLoggedIN();
  }, [status, loggedOutPress]);

  // console.log(user, isLoggedIn, "juzarva");
  return (
    <View style={styles.container}>
      <View style={styles.drawerHeader}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName?.split("")[0]}
              {user?.lastName?.split("")[0]}
            </Text>
          </View>
          {user ? (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user?.firstName} {user?.middleName} {user?.lastName}
              </Text>
              <Text style={styles.userEmail}>{user?.mobile}</Text>
            </View>
          ) : (
            <View style={{}}>
              <Button
                title="Login"
                color={colors.secondary}
                onPress={() => navigation.navigate("LoginScreen")}
              />
            </View>
          )}
        </View>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.drawerSection}>
          {!isLoggedIn ? (
            <DrawerItem
              label="Home"
              icon={({ color, size }) => (
                <DrawerIcon
                  name="home"
                  focused={true}
                  color={color}
                  size={20}
                />
              )}
              onPress={() => {
                navigation.closeDrawer();
              }}
              style={styles.drawerLabelF}
              labelStyle={styles.drawerLabel}
            />
          ) : (
            <DrawerItemList {...props} />
          )}
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
        {isLoggedIn && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={async () => {
              try {
                await AsyncStorage.removeItem("jwt");
                await AsyncStorage.removeItem("user");
                await AsyncStorage.removeItem("isLoggedIn");

                setloggedOutPress((prev) => !prev); // re-render

                navigation.reset({
                  index: 0,
                  routes: [{ name: "Home" }],
                });
              } catch (error) {
                console.log("Logout Error:", error);
              }
            }}
          >
            <View style={styles.logoutInner}>
              <MaterialIcons name="logout" size={18} color={colors.danger} />
              <Text style={styles.logoutText}> Logout</Text>
            </View>
          </TouchableOpacity>
        )}
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
  drawerLabelF: {
    fontSize: 15,
    backgroundColor: colors.sidebarActiveBg,
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
