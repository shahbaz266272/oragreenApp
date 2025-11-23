import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../theme/colors";

const sampleAddresses = [
  { id: "1", label: "Home", address: "123 Main St, Springfield, IL" },
  { id: "2", label: "Work", address: "456 Office Ave, Metropolis, NY" },
  { id: "3", label: "Parents", address: "789 Family Ln, Smallville, KS" },
];

export default function AddressesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
      </View>

      <FlatList
        data={sampleAddresses}
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
});
