import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Importando os ícones

export default function Navbar() {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("surdos/modulos" as never)}
      >
        <Icon name="view-dashboard-outline" size={24} color="white" />
        <Text style={styles.navText}>Módulos</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("surdos/dicionario" as never)}
      >
        <Icon name="book-outline" size={24} color="white" />
        <Text style={styles.navText}>Dicionário</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("surdos/forum" as never)}
      >
        <Icon name="forum-outline" size={24} color="white" />
        <Text style={styles.navText}>Fórum</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("surdos/perfil" as never)}
      >
        <Icon name="account-outline" size={24} color="white" />
        <Text style={styles.navText}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#0B8DCD",
    height: 70,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 10,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
});
