/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { View } from "react-native";
import { MotiView, Text } from "moti";

export type DragIndicatorConfig = {
  translateXDistance: number;
  indicatorBackgroundColor: string;
  indicatorBorderWidth: number;
  indicatorBorderColor: string;
  indicatorBorderRadius: number;
};

export type DragIndicatorProps = {
  itemHeight: number;
  fromLeftOrRight?: "left" | "right";
  currentPosition: number;
  totalItems: number;
  config: Partial<DragIndicatorConfig>;
};

const defaultDragConfig = {
  translateXDistance: 10,
  indicatorBorderWidth: 1,
  indicatorBorderColor: "black",
  indicatorBackgroundColor: "#eee",
  indicatorBorderRadius: 10,
};
/**.
 * Currently this single component encapsulates the drag indicator.
 * It is used in the MoveableItem.tsx.
 * The Problem is that it forces a single drag indicator across whole project
 * even though you can move it to come in from left or right, it would be nice to
 * give more control to change for each scroll.
 * NOTE: The DragIndicator is the wrapper animation and inside of it is the actual visual.
 * The DragIndicator is simply a view that moves in and out of the screen.  It does have some
 * styling on it too...  Maybe just let the style for this be passed through???
 */
const DefaultDragIndicator: React.FC<DragIndicatorProps> = ({
  itemHeight,
  fromLeftOrRight = "right",
  currentPosition,
  totalItems,
  config,
}) => {
  const direction = fromLeftOrRight === "left" ? -1 : 1;
  const {
    translateXDistance,
    indicatorBackgroundColor,
    indicatorBorderWidth,
    indicatorBorderColor,
    indicatorBorderRadius,
  } = { ...defaultDragConfig, ...config };

  return (
    <MotiView
      style={{
        position: "absolute",
        [fromLeftOrRight]: 0,
        backgroundColor: indicatorBackgroundColor
          ? indicatorBackgroundColor
          : "#eee",
        justifyContent: "center",
        borderWidth: indicatorBorderWidth,
        borderColor: indicatorBorderColor,
        marginTop: (itemHeight - itemHeight / 1.5) / 2,
        height: itemHeight / 1.5,
        borderRadius: indicatorBorderRadius,
      }}
      from={{
        opacity: 0.5,
        translateX: 100 * direction,
        // scale: 0.5,
      }}
      animate={{
        opacity: 1,
        translateX: translateXDistance! * direction * -1,
        // scale: 1,
      }}
      exit={{
        opacity: 0.5,
        translateX: 100 * direction,
        // scale: 0.5,
      }}
      transition={{
        type: "spring",
        delay: 100,
      }}
      exitTransition={{
        type: "spring",
        delay: 500,
      }}
    >
      <DragIndicatorDisplay
        currentPosition={currentPosition}
        totalItems={totalItems}
      />
    </MotiView>
  );
};

export default DefaultDragIndicator;

const DragIndicatorDisplay: React.FC<{
  currentPosition: number;
  totalItems: number;
}> = ({ currentPosition, totalItems }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingRight: 10,
        paddingLeft: 20,
      }}
    >
      <MotiView
        from={{ scale: 2.25 }}
        animate={{ scale: 1.5 }}
        transition={{ type: "timing", duration: 500 }}
        key={currentPosition}
      >
        <Text style={{ color: "green", paddingRight: 3 }}>
          {currentPosition}
        </Text>
      </MotiView>
      <Text> of {totalItems} </Text>
    </View>
  );
};
