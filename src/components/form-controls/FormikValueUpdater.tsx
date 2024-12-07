import { getPropertiesChanged } from '@helpers/forms';
import { useFormikContext } from 'formik';
import { useEffect, useRef } from 'react';

/** Keeps Formik context form values updated with the provided updatedValues
 * object. Unlike enableReinitialize in Formik provider, this component
 * doesn't overwrite field values that have been edited by the user
 * themselves.
 */
function FormikValueUpdater<T extends Record<string, unknown>>({
  updatedValues,
}: {
  updatedValues: T;
}) {
  const { values, initialValues, setFieldValue } = useFormikContext<T>();

  // ref necessary to determine if user edited a field themselves or if
  // it was updated by this component
  const prevUpdatedRef = useRef(initialValues);

  useEffect(() => {
    const changedValues = getPropertiesChanged(values, updatedValues);

    const changedInitialValuesSubset = Object.fromEntries(
      changedValues.map((key) => [key, prevUpdatedRef.current[key]]),
    );

    const editedChangedValues = getPropertiesChanged(
      changedInitialValuesSubset,
      values,
    );

    const uneditedChangedValues = changedValues.filter(
      (v) => !editedChangedValues.includes(v),
    );
    uneditedChangedValues.forEach((key) => {
      void setFieldValue(key, updatedValues[key], false);
    });

    prevUpdatedRef.current = updatedValues;
    // should only rerun on updatedValues changes
  }, [updatedValues]);

  return null;
}

export default FormikValueUpdater;
