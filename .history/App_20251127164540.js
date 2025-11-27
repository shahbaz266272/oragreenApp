import colors from "./src/theme/colors";
import "react-native-gesture-handler";
import React, { useEffect, useState, useCallback } from "react";
import { Provider } from "react-redux";

import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
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

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// Keep the splash screen visible while we fetch resources

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Prevent auto-hide of the native splash screen
        await SplashScreen.preventAutoHideAsync();
        // Pre-load other resources (fonts, API calls, etc.) if needed
        // Simulate loading other resources or initialization
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

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
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: "Settings",
          title: "Settings",
          drawerIcon: ({ color, size, focused }) => (
            <DrawerIcon name="cog" focused={focused} color={color} size={18} />
          ),
        }}
      />
      <Drawer.Screen
        name="Favourites"
        component={FavoritesScreen}
        options={{
          drawerLabel: "Favourites",
          title: "My Favourites",
          drawerIcon: ({ color, size, focused }) => (
            <DrawerIcon name="star" focused={focused} color={color} size={18} />
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
    </Drawer.Navigator>
  );

  return (
    <Provider store={store}>
      <NavigationContainer>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <Stack.Navigator
            initialRouteName="Main"
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: colors.white,
              headerTitleStyle: {
                fontWeight: "bold",
              },
              headerTitle: (props) => <HeaderLogo title={props.children} />,
            }}
          >
            <Stack.Screen
              name="Main"
              component={DrawerNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProductDetail"
              getComponent={() =>
                require("./src/screens/ProductDetailScreen").default
              }
              options={({ route }) => ({
                title: route?.params?.item?.variant || "Product",
              })}
            />
            <Stack.Screen
              name="Address"
              component={AddressesScreen}
              options={{ title: "Addresses" }}
            />
            <Stack.Screen
              name="AddAddress"
              getComponent={() =>
                require("./src/screens/AddAddressScreen").default
              }
              options={{ title: "Add Address" }}
            />
            <Stack.Screen
              name="cartScreen"
              getComponent={() => require("./src/screens/CartScreen").default}
              options={{ title: "Cart Screen" }}
            />
            <Stack.Screen
              name="Checkout"
              getComponent={() =>
                require("./src/screens/CheckoutScreen").default
              }
              options={{ title: "Checkout" }}
            />
            <Stack.Screen
              name="Orders"
              getComponent={() => require("./src/screens/OrdersScreen").default}
              options={{ title: "My Orders" }}
            />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </Provider>
  );
}
