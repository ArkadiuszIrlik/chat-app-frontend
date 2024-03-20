import { PrimaryButton } from '@components/PrimaryButton';
import { useFormikContext } from 'formik';
import { ReactNode } from 'react';

function SubmitButtonPrimary({ children }: { children: ReactNode }) {
  const { isSubmitting } = useFormikContext();
  return (
    <PrimaryButton type="submit" disabled={isSubmitting}>
      {children}
    </PrimaryButton>
  );
}
export default SubmitButtonPrimary;
