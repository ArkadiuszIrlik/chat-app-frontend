import { useFormikContext } from 'formik';
import { useEffect, useRef } from 'react';

function ResetAfterSubmit<V extends Record<string, unknown>>({
  hasSubmitted,
  updatedValues,
}: {
  hasSubmitted: boolean;
  updatedValues: V;
}) {
  const { resetForm } = useFormikContext<V>();
  const shouldResetOnUpdateRef = useRef(false);

  useEffect(() => {
    if (hasSubmitted) {
      shouldResetOnUpdateRef.current = true;
    }
  }, [hasSubmitted]);

  useEffect(() => {
    if (shouldResetOnUpdateRef.current) {
      resetForm({ values: updatedValues });
      shouldResetOnUpdateRef.current = false;
    }
  }, [updatedValues, resetForm]);

  return null;
}

export default ResetAfterSubmit;
