import React, { useState } from "react";
import { Platform, View } from "react-native";
import { MotiView, Text, AnimatePresence } from "moti";
import { clamp } from "react-native-redash";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useAnimatedReaction,
  scrollTo,
  withSequence,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";

import {
  DragIndicatorProps,
  DragIndicatorConfig,
} from "./DefaultDragIndicator";

import { Positions } from "./helperFunctions";
import { usePositions } from "./DragSortContext";

interface Props {
  id: number | string;
  scrollY: Animated.SharedValue<number>;
  scrollViewRef: React.RefObject<Animated.ScrollView>;
  numberOfItems: number;
  handlePosition: "left" | "right";
  containerHeight: number;
  handle: React.FC;
  enableHapticFeedback: boolean;
  enableDragIndicator: boolean;
  dragIndicator: React.FC<DragIndicatorProps>;
  dragIndicatorConfig: Partial<DragIndicatorConfig>;
  updatePositions: (positions: Positions) => void;
  itemHeight: number;
  children: React.ReactElement<{ id: number | string }>;
}
//*-----------------
//*= HELPER FUCTIONS - Using redash's clamp instead
// function clamp(value: number, lowerBound: number, upperBound: number) {
//   "worklet";
//   return Math.max(lowerBound, Math.min(value, upperBound));
// }

//*-----------------
function objectMove(object: Positions, from: number, to: number) {
  "worklet";
  const newObject = { ...object };

  for (const id in object) {
    if (object[id] === from) {
      newObject[id] = to;
    }

    if (object[id] === to) {
      newObject[id] = from;
    }
  }

  return newObject;
}
//*-----------------
const MoveableItem = ({
  id,
  scrollY,
  scrollViewRef,
  numberOfItems,
  handlePosition,
  containerHeight,
  updatePositions,
  children,
  itemHeight,
  handle,
  enableDragIndicator,
  dragIndicator,
  dragIndicatorConfig,
  enableHapticFeedback,
}: Props) => {
  const positions = usePositions();
  const Handle = handle;
  const DragIndicator = dragIndicator;
  const moving = useSharedValue(false);
  const [isActive, setIsActive] = useState(false);
  // Used in the drag indicator to show where the item being dragged is located.
  const [movingPos, setMovingPos] = useState(positions.value[id] + 1);
  const scale = useSharedValue({ x: 1, y: 1 });
  const translateY = useSharedValue(positions.value[id] * itemHeight);
  const translateX = useSharedValue(0);
  // initialRender is used if another animation happens on NON moving items when they
  // change position.  It keeps that animation from running on the first render.
  const initialRender = useSharedValue(true);
  const contentHeight = React.useMemo(
    () => numberOfItems * itemHeight,
    [numberOfItems]
  );
  const boundY = numberOfItems * itemHeight - itemHeight;

  // Whenever the positions.value changes, this reaction will run
  // Thus, whenever we update the position (swap two items) this
  // hook will run the second function, passing to it, the
  // new Position from the return of the first function (the positions.value[id]) and the previous value
  useAnimatedReaction(
    () => positions.value[id],
    (newPosition, previousPosition) => {
      // If newPosition is undefined, this means that the item was deleted, so just return (do nothing)
      if (newPosition === undefined) {
        return;
      }
      // If the new position is different than the previous state, then set the translateY.value
      if (newPosition !== previousPosition) {
        // If moving set the movingPos state (for drag indicator) to correct position.
        if (moving.value) {
          runOnJS(setMovingPos)(newPosition + 1);
        }
        // Only move the value if it is not moving (i.e. not the item where the gesture is active)
        if (!moving.value && !initialRender.value) {
          // animate the moving
          translateY.value = withSpring(newPosition * itemHeight);
          //*- Another animation option --
          // translateY.value = withTiming(newPosition * itemHeight, { duration: 200 });
          // translateX.value = withSequence(
          //   withTiming(20, { duration: 150 }),
          //   withTiming(0, { duration: 100 })
          // );
          //*-----------------------------
          runOnJS(setMovingPos)(newPosition + 1);
          // translateY.value = withTiming(newPosition * itemHeight, { duration: 200 });
        } else {
          initialRender.value = false;
        }
      }
    },
    []
  );

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startingY: number }
  >({
    onStart(event, ctx) {
      moving.value = true;
      runOnJS(setIsActive)(true);
      scale.value = { x: 0.97, y: 1 };
      ctx.startingY = translateY.value;
      if (Platform.OS === "ios" && enableHapticFeedback) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      }
      //OR IF above doesn't work use:
      // runOnJS(setMoving)(true);
    },
    onActive(event, ctx) {
      //* Caclulate the Initial new top position of this item
      //* Use the clamp function to make sure it doesn't move outside the bounds of the container
      //* NOTE: the translateY.value will move from zero to the full content height (minus the itemHeight)
      //*     even if the containerHeight is small
      translateY.value = clamp(ctx.startingY + event.translationY, 0, boundY);

      //* Calculation the position based on items current Y value
      //* The translateY.value/itemHeight return a decimal between 0 to numberOfItems
      //* I add .5 so that the we get a new position at the center of the next item
      //* whether moving up or down
      const newPosition = clamp(
        Math.floor(translateY.value / itemHeight + 0.5),
        0,
        numberOfItems
      );

      //* Check to see if we need to set a new position and do it if so
      if (newPosition !== positions.value[id]) {
        positions.value = objectMove(
          positions.value,
          positions.value[id],
          newPosition
        );
        if (Platform.OS === "ios" && enableHapticFeedback) {
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        }
      }

      //*--- START Scroll Logic ---
      //* Check to see if we need to scroll the scrollview
      const lowerBound = scrollY.value;
      const upperBound = lowerBound + containerHeight - itemHeight;

      if (translateY.value < lowerBound) {
        const diff = Math.min(lowerBound - translateY.value, lowerBound);
        //Scroll up
        scrollY.value -= diff;
        scrollTo(scrollViewRef, 0, scrollY.value, false);
        ctx.startingY -= diff;
        translateY.value = ctx.startingY + event.translationY;
      } else if (translateY.value > upperBound) {
        const scrollLeft = contentHeight - containerHeight - scrollY.value;
        //Scroll down
        const diff = Math.min(translateY.value - upperBound, scrollLeft);
        scrollY.value += diff;
        scrollTo(scrollViewRef, 0, scrollY.value, false);
        ctx.startingY += diff;
        translateY.value = ctx.startingY + event.translationY;
      }
      //*--- END Scroll Logic

      //*----- Scroll Logic Take 2 ------------
      // set the lower and upper bound dynamically as we update the scroll position
      // scrollY will always be the lower bound and
      // the upper bound will be
      //*----- END Scroll Logic Take 2 ------------

      // translateY.value = positionY;
    },
    onEnd(event, ctx) {
      moving.value = false;
      runOnJS(setIsActive)(false);
      scale.value = { x: 1, y: 1 };
      translateY.value = withSpring(positions.value[id] * itemHeight);
      runOnJS(updatePositions)(positions.value);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      flexDirection: "row",
      flex: 1,
      width: "100%",
      backgroundColor: "white",
      left: 0,
      right: 0,
      top: 0, //withTiming(translateY.value, { duration: 16 }),
      zIndex: moving.value ? 1 : 0,
      shadowColor: "black",
      shadowOffset: { height: 0, width: 0 },
      // borderWidth: 1,
      shadowOpacity: withSpring(moving.value ? 1 : 0),
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        { scaleX: scale.value.x },
      ],
      shadowRadius: 10,
    };
  }, [moving.value]);
  return (
    <Animated.View style={animatedStyle}>
      {handlePosition === "right" && (
        <View style={{ flex: 1 }}>
          {React.cloneElement(children as React.ReactElement<any>, {
            isMoving: moving.value,
          })}
          <AnimatePresence>
            {isActive && enableDragIndicator && (
              <DragIndicator
                itemHeight={itemHeight}
                fromLeftOrRight="left"
                currentPosition={movingPos}
                totalItems={numberOfItems}
                config={dragIndicatorConfig}
              />
            )}
          </AnimatePresence>
        </View>
      )}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View>
          <Handle />
        </Animated.View>
      </PanGestureHandler>
      {handlePosition === "left" && (
        <View style={{ flex: 1 }}>
          {React.cloneElement(children as React.ReactElement<any>, {
            isMoving: moving.value,
          })}
          <AnimatePresence>
            {isActive && enableDragIndicator && (
              <DragIndicator
                itemHeight={itemHeight}
                fromLeftOrRight="right"
                currentPosition={movingPos}
                totalItems={numberOfItems}
                config={dragIndicatorConfig}
              />
            )}
          </AnimatePresence>
        </View>
      )}
    </Animated.View>
  );
};

export default MoveableItem;
