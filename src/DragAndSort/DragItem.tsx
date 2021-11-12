/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

//ADD Delete icon and delete function from Store so Deletoing of item can be tested.
//Update Items array to be generic items (maybe grocery list)
//Make item ids alpha
const DragItem = ({
  name,
  id,
  itemHeight,
  onRemoveItem,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isMoving = false, // injected into component when list created
}: {
  name: string;
  id: string | number;
  itemHeight: number;
  onRemoveItem?: () => void;
  isMoving?: boolean;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: itemHeight,
        padding: 10,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#aaa",
        flex: 1,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          marginRight: 10,
        }}
      >
        {name}
      </Text>

      <Text
        style={{ fontSize: 16, color: "gray", fontWeight: "600" }}
      >{`(id-${id})`}</Text>
      {onRemoveItem && (
        <TouchableOpacity
          onPress={onRemoveItem}
          style={{ position: "absolute", right: 15 }}
        >
          <MaterialIcons name="delete" size={25} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DragItem;
