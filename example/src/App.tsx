/* eslint-disable react-native/no-inline-styles */
import * as React from "react";

import { StyleSheet, View } from "react-native";
import DragDropEntry, { DragItem } from "react-native-drag-and-order";

const items = [
  { id: "a", name: "Coconut Milk", pos: 0 },
  { id: "b", name: "Lettuce", pos: 1 },
  { id: "c", name: "Walnuts", pos: 2 },
  { id: "d", name: "Chips", pos: 3 },
  { id: "e", name: "Ice Cream", pos: 4 },
  { id: "f", name: "Carrots", pos: 5 },
  { id: "g", name: "Onions", pos: 6 },
  { id: "h", name: "Cheese", pos: 7 },
  { id: "i", name: "Frozen Dinners", pos: 8 },
  { id: "j", name: "Yogurt", pos: 9 },
  { id: "k", name: "Kombucha", pos: 10 },
  { id: "l", name: "Lemons", pos: 11 },
  { id: "m", name: "Bread", pos: 12 },
];

export default function App() {
  return (
    <View style={styles.container}>
      <DragDropEntry
        scrollStyles={{ width: "80%", borderWidth: 1, borderColor: "#aaa" }}
        updatePositions={(positions) => console.log(positions)}
        itemHeight={50}
        handlePosition="left"
        enableDragIndicator={true}
      >
        {items.map((item) => {
          return <DragItem itemHeight={50} id={item.id} name={item.name} />;
        })}
      </DragDropEntry>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
