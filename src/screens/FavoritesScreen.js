import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../theme/colors";

const sampleFavorites = [
  { id: "1", title: "Home", subtitle: "123 Main St, Springfield" },
  { id: "2", title: "Work", subtitle: "456 Office Ave, Metropolis" },
  { id: "3", title: "Gym", subtitle: "789 Fitness Blvd, Gotham" },
];

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>

      <FlatList
        data={sampleFavorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <MaterialCommunityIcons
              name="star-outline"
              size={28}
              color={colors.primary}
            />
            <View style={styles.itemText}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
            </View>
          </View>
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
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
  },
  itemSubtitle: {
    fontSize: 13,
    color: colors.gray,
  },
});
