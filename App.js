import colors from "./src/theme/colors";
import "react-native-gesture-handler";
import React, { useEffect, useState, useCallback } from "react";
import { Provider } from "react-redux";

import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { View, TouchableOpacity } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { MaterialIcons } from "@expo/vector-icons";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import AddressesScreen from "./src/screens/AddressesScreen";
import OrdersScreen from "./src/screens/OrdersScreen";
import DrawerIcon from "./src/components/DrawerIcon";
import HeaderLogo from "./src/components/HeaderLogo";
// removed direct MaterialCommunityIcons import - components use icons instead
import CustomDrawerContent from "./src/components/CustomDrawerContent";
import { store } from "./src/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Drawer = createDrawerNavigator();

// Keep the splash screen visible while we fetch resources

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function loadApp() {
      try {
        await SplashScreen.preventAutoHideAsync();

        // 🔥 Load login state from async storage
        const value = await AsyncStorage.getItem("isLoggedIn");
        console.log(value);
        setIsLoggedIn(value === "true" ? true : false);

        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    loadApp();
  }, []);
  console.log(isLoggedIn, "--");
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately after the root view
      // has been laid out.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // Keep native splash screen visible while app is preparing
  }
  const DrawerNavigator = () => (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
      
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitle: (props) => <HeaderLogo title={props.children} />,
        drawerActiveBackgroundColor: colors.sidebarActiveBg,
        drawerActiveTintColor: colors.sidebarActive,
        drawerInactiveTintColor: colors.gray,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerLabel: "Home",
          title: "Home",
          drawerIcon: ({ color, size, focused }) => (
            <DrawerIcon name="home" focused={focused} color={color} size={20} />
          ),
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerLabel: "Profile",
          title: "My Profile",
          drawerIcon: ({ color, size, focused }) => (
            <DrawerIcon
              name="account"
              focused={focused}
              color={color}
              size={18}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Addresses"
        component={AddressesScreen}
        options={{
          drawerLabel: "Addresses",
          title: "My Addresses",
          drawerIcon: ({ color, size, focused }) => (
            <DrawerIcon
              name="map-marker"
              focused={focused}
              color={color}
              size={18}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          drawerLabel: "Orders",
          title: "Orders",
          drawerIcon: ({ color, size, focused }) => (
            <DrawerIcon
              name="tshirt-crew"
              focused={focused}
              color={color}
              size={18}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="LoginScreen"
        getComponent={() => require("./src/screens/LoginScreen").default}
        options={({ navigation }) => ({
          drawerItemStyle: { display: "none" },
          title: "Login",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginRight: 15 }}
            >
              <MaterialIcons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen
        name="SignUp"
        getComponent={() => require("./src/screens/SignUpScreen").default}
        options={({ navigation }) => ({
          drawerItemStyle: { display: "none" },
          title: "Sign Up",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginRight: 15 }}
            >
              <MaterialIcons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen
        name="ForgotPassword"
        getComponent={() =>
          require("./src/screens/ForgotPasswordScreen").default
        }
        options={({ navigation }) => ({
          drawerItemStyle: { display: "none" },
          title: "Forgot Password",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginRight: 15 }}
            >
              <MaterialIcons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen
        name="ProductDetail"
        getComponent={() =>
          require("./src/screens/ProductDetailScreen").default
        }
        options={({ route, navigation }) => ({
          drawerItemStyle: { display: "none" },
          title: route?.params?.item?.variant || "Product",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginRight: 15 }}
            >
              <MaterialIcons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen
        name="Address"
        component={AddressesScreen}
        options={({ navigation }) => ({
          drawerItemStyle: { display: "none" },
          title: "Addresses",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginRight: 15 }}
            >
              <MaterialIcons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen
        name="AddAddress"
        getComponent={() => require("./src/screens/AddAddressScreen").default}
        options={({ navigation }) => ({
          drawerItemStyle: { display: "none" },
          title: "Add Address",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginRight: 15 }}
            >
              <MaterialIcons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen
        name="OrderSuccess"
        getComponent={() => require("./src/screens/OrderSucess").default}
        options={({ navigation }) => ({
          drawerItemStyle: { display: "none" },
          title: "Order Success",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginRight: 15 }}
            >
              <MaterialIcons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen
        name="cartScreen"
        getComponent={() => require("./src/screens/CartScreen").default}
        options={({ navigation }) => ({
          drawerItemStyle: { display: "none" },
          title: "Cart Screen",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginRight: 15 }}
            >
              <MaterialIcons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen
        name="Checkout"
        getComponent={() => require("./src/screens/CheckoutScreen").default}
        options={({ navigation }) => ({
          drawerItemStyle: { display: "none" },
          title: "Checkout",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginRight: 15 }}
            >
              <MaterialIcons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        })}
      />
    </Drawer.Navigator>
  );

  return (
    <Provider store={store}>
      <NavigationContainer>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <DrawerNavigator />
        </View>
      </NavigationContainer>
    </Provider>
  );
}
