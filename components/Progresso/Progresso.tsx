import React from "react";
import { View, StyleSheet } from "react-native";

type ProgressIndicatorProps = {
  currentScreen: number;
  totalScreens: number;
};

export default function ProgressIndicator({ currentScreen, totalScreens }: ProgressIndicatorProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalScreens }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            index + 1 === currentScreen ? styles.active : styles.inactive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  indicator: {
    width: 40,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  active: {
    backgroundColor: "black",
  },
  inactive: {
    backgroundColor: "lightgray",
  },
});
