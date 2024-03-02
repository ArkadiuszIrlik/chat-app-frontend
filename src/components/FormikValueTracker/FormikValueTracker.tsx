import { useFormikContext } from 'formik';
import { useEffect } from 'react';

function FormikValueTracker({
  onValueChange,
}: {
  onValueChange: (values: object) => void;
}) {
  const { values } = useFormikContext<object>();
  useEffect(() => {
    onValueChange(values);
  }, [values, onValueChange]);
  return null;
}
export default FormikValueTracker;
