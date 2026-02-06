import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import { useDispatch } from "react-redux";
import { setSelectedAddress } from "../features/address/addressCart";

export default function AddressesScreen({ navigation }) {
  const [addresses, setAddresses] = useState([]);
  const dispatch = useDispatch();

  // Load addresses from local storage
  const loadAddresses = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@addresses");
      if (jsonValue != null) {
        setAddresses(JSON.parse(jsonValue));
      } else {
        setAddresses([]);
      }
    } catch (e) {
      console.log("Error loading addresses", e);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadAddresses);
    return unsubscribe;
  }, [navigation]);

  /** ===================== DELETE ADDRESS ===================== **/
  const deleteAddress = async (id) => {
    try {
      const updated = addresses.filter((a) => a.id !== id);
      setAddresses(updated); // update UI

      await AsyncStorage.setItem("@addresses", JSON.stringify(updated)); // save updated list
    } catch (error) {
      console.log("Error deleting address", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
      </View>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {/* SELECT ADDRESS */}
            <TouchableOpacity
              style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
              onPress={() => {
                dispatch(setSelectedAddress(item));
                navigation.navigate("Checkout");
              }}
            >
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={26}
                color={colors.primary}
              />

              <View style={styles.itemText}>
                <Text style={styles.itemLabel}>
                  {`${item.firstName} ${item.middleName ?? ""} ${
                    item.lastName
                  }`.trim()}
                  {item.type ? ` (${item.type})` : ""}
                </Text>

                <Text style={styles.itemAddress}>
                  {`Address: ${item.content}`}
                </Text>
                <Text style={styles.itemAddress}>
                  {`Mobile: ${item.mobile}`}
                </Text>
              </View>
            </TouchableOpacity>

            {/* DELETE BUTTON */}
            <TouchableOpacity
              onPress={() => deleteAddress(item.id)}
              style={styles.deleteButton}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={24}
                color={colors.danger || "red"}
              />
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.addButtonContainer}>
        <Button
          title="Add Address"
          color={colors.primary}
          onPress={() => navigation.navigate("AddAddress")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.dark,
  },
  list: {
    padding: 16,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemText: {
    marginLeft: 12,
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
  },
  itemAddress: {
    fontSize: 13,
    color: colors.gray,
  },

  deleteButton: {
    padding: 4,
  },

  addButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.light,
    backgroundColor: colors.white,
  },
});
