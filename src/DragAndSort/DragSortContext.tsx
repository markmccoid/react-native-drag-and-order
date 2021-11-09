import React, { useState, useContext } from "react";
import { Positions } from "./helperFunctions";
import Animated from "react-native-reanimated";

const PositionsObjContext = React.createContext<Animated.SharedValue<Positions>>(undefined!);
// const PositionsSettersContext = React.createContext();

type Props = {
  positions: Animated.SharedValue<Positions>;
};
/**======================================================
 * Provider function
 * This function is also where all the state is created
 */
const PositionsProvider: React.FC<Props> = ({ children, positions }) => {
  return (
    <PositionsObjContext.Provider value={positions}>{children}</PositionsObjContext.Provider>
  );
};

export const usePositions = () => {
  const context = useContext(PositionsObjContext);
  if (context === undefined) {
    throw new Error("PositionsObjContext must be used within a PositionsProvider");
  }
  return context;
};
// export const useVariableStateSetters = () => { ... }

export default PositionsProvider;
