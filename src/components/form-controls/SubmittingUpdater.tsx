import { useFormikContext } from 'formik';
import { useEffect } from 'react';

function SubmittingUpdater({ isFetchLoading }: { isFetchLoading: boolean }) {
  const { setSubmitting } = useFormikContext();
  useEffect(() => {
    if (!isFetchLoading) {
      setSubmitting(false);
    }
  }, [isFetchLoading, setSubmitting]);

  return null;
}

export default SubmittingUpdater;
