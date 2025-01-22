import React from "react";
import {
  StyleSheet,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ForumScreen from "./forum";
import DicionarioScreen from "./dicionario";
import PerfilScreen from "./perfil";
import ModulosScreen from "./modulosScreen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

export default function SurdosScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "alert";

          if (route.name === "Módulos") {
            iconName = focused ? "view-dashboard" : "view-dashboard-outline";
          } else if (route.name === "Dicionário") {
            iconName = focused ? "bookmark" : "bookmark-outline";
          } else if (route.name === "Perfil") {
            iconName = focused ? "account" : "account-outline";
          } else if (route.name === "Fórum") {
            iconName = focused ? "forum" : "forum-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarStyle: [styles.tabBarStyle],
        tabBarItemStyle: styles.tabBarItemStyle,
        headerTitleAlign: "center",
      })}
    >
      <Tab.Screen name="Módulos" component={ModulosScreen} />
      <Tab.Screen name="Dicionário" component={DicionarioScreen} />
      <Tab.Screen name="Fórum" component={ForumScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarStyle: {
    backgroundColor: "#0B8DCD",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 70,
    position: "absolute",
    borderTopWidth: 0,
  },
  tabBarItemStyle: {
    marginHorizontal: 10,
    marginTop: 7,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    marginBottom: 50,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 16,
    marginRight: 8,
  },
  picker: {
    flex: 1,
    height: 60,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 20,
    backgroundColor: "#f9f9f9",
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1,
  },
  icon: {
    fontSize: 32,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  searchIcon: {
    marginRight: 8,
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
});
