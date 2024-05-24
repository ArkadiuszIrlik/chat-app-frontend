/* eslint-disable import/prefer-default-export */
import deepEqual from 'deep-equal';

/** Takes two objects and returns an array of properties from the first
 * object that have different values in the second object. Uses deep
 * equality for comparison.
 */
function getPropertiesChanged<FormKeys extends string, Values1, Values2>(
  obj1: Record<FormKeys, Values1>,
  obj2: Record<FormKeys, Values2>,
) {
  const propertiesChanged: FormKeys[] = [];

  const keys1 = Object.keys(obj1) as FormKeys[];
  for (let i = 0; i < keys1.length; i++) {
    const key = keys1[i];
    if (!deepEqual(obj1[key], obj2[key])) {
      propertiesChanged.push(key);
    }
  }
  return propertiesChanged;
}

export { getPropertiesChanged };
