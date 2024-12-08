import { getPropertiesChanged } from '@helpers/forms';
import { Formik, FormikProps } from 'formik';
import { ReactNode } from 'react';

SettingsFormikProvider.defaultProps = {
  updatedInitialValues: undefined,
  enableReinitialize: false,
};

function SettingsFormikProvider<V extends Record<string, unknown>>({
  initialValues,
  updatedInitialValues = undefined,
  onSubmitData,
  enableReinitialize = false,
  validationSchema,
  children,
}: {
  initialValues: V;
  /** Updated initialValues object to use when detecting form changes inside
   * the onSubmit handler. Use this instead of passing new initialValues if
   * you don't want to lose your current changes.
   */
  updatedInitialValues?: V;
  onSubmitData: (data: FormData) => void;
  enableReinitialize?: boolean;
  validationSchema: unknown;
  children: ReactNode | ((pro: FormikProps<V>) => ReactNode);
}) {
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={enableReinitialize}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const propertiesChanged = getPropertiesChanged(
          updatedInitialValues ?? initialValues,
          values,
        );
        const patchData = propertiesChanged.map((property) => ({
          op: 'replace',
          path: `/${property}`,
          value: values[property],
        }));

        const data = new FormData();
        const patchBlob = new Blob([JSON.stringify(patchData)], {
          type: 'application/json',
        });
        data.append('patch', patchBlob);

        onSubmitData(data);
      }}
    >
      {(formikProps) =>
        typeof children === 'function' ? children(formikProps) : children
      }
    </Formik>
  );
}
export default SettingsFormikProvider;
