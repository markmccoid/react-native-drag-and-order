// interface BaseArray {
//   id: string | number;
// }

// Positions type defines is the key/id of each of your child items
// with the value being the position that key/id is within your list
export type Positions = {
  [key_id: string]: number;
};
/**
 * USAGE - sortArray(positions, itemList, { positionField, idField })
 * This function is desinged to make it easy for to resort array of object
 * that are the children in your drag/drop list.
 *
 *
 * @export
 * @template T
 * @param {Positions} positions - provided by the DragDropEntry component in the updatePositions function
 * @param {T[]} baseArray - array that you want "resorted"
 * @param { positionField?: string; idField: string } - optional position field name,
 *            idField is the name of the id field.  Not options, but defaults to "id" if not passed.
 */
export function sortArray<T>(
  positions: Positions,
  baseArray: T[],
  { positionField, idField = "id" }: { positionField?: string; idField: string }
) {
  if (Object.keys(positions).length < 1) {
    return [];
  }

  // positions is object { [id_of_filter]: index position },
  // so this: { 'id': 0, 'id': 1, ... }
  // 1. create an array with just the ids from the positions object, SORTED by the position (i.e. Value of positions object)
  // 2. map through this array and create a new array of objects from the passed in baseArray, thus sorting the baseArray
  // 3. check to see if positionField was passed, if so, add this field to the new array

  const sortedIds: string[] = [];
  Object.entries(positions).forEach(([id, position]) => {
    sortedIds[position] = id;
  });

  const finalList = sortedIds.map((id, index) => {
    const arrayItem = baseArray.find((baseItem) => {
      // idField may contain string or number, so convert to string to be sure
      // comparison returns what we expect.
      return `${baseItem[idField]}` === `${id}`;
    });
    if (positionField) {
      return { ...arrayItem, [positionField]: index } as T;
    }
    return arrayItem;
  });
  return finalList;
}

/**
 * Helper function that updates an objects position field with the index
 * value of that items position in the array.
 * Useful if you need to keep a position field updated and you have a
 * remove item function.  This function will make sure there are no "holes"
 * in the position field.
 *
 * @export
 * @template T
 * @param {T[]} baseArray
 * @param {string} positionField
 */
export function updatePositionArrayField<T>(
  baseArray: T[],
  positionField: string
): T[] {
  return baseArray.map((item, idx) => ({ ...item, [positionField]: idx }));
}
