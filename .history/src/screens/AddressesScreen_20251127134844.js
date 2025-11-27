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

export default function AddressesScreen({ navigation }) {
  const [addresses, setAddresses] = useState([]);

  // Load addresses from local storage
  const loadAddresses = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@addresses");
      if (jsonValue != null) {
        setAddresses(JSON.parse(jsonValue));
      } else {
        setAddresses([]); // initialize empty
      }
    } catch (e) {
      console.log("Error loading addresses", e);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadAddresses);
    return unsubscribe;
  }, [navigation]);

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
          <TouchableOpacity style={styles.item}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={26}
              color={colors.primary}
            />
            <View style={styles.itemText}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemAddress}>{item.address}</Text>
            </View>
          </TouchableOpacity>
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
  addButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.light,
    backgroundColor: colors.white,
  },
});
