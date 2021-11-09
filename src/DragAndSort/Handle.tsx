import React from "react";
import { View, StyleProp, TextStyle } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type DragHandleIconProps = {
  size: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};
const DragHandleIcon = ({ size, color, style }: DragHandleIconProps) => {
  return <MaterialIcons name="drag-handle" size={size} color={color} style={style} />;
};

const DefaultHandle: React.FC = () => (
  <View
    style={{
      borderRightWidth: 1,
      borderRightColor: "#aaa",
      borderBottomWidth: 0.5,
      borderBottomColor: "#aaa",
      borderTopWidth: 0.5,
      borderTopColor: "#aaa",
      height: "100%",
      backgroundColor: "white",
      justifyContent: "center",
      paddingHorizontal: 5,
    }}
  >
    <DragHandleIcon size={25} />
  </View>
);

export default DefaultHandle;
