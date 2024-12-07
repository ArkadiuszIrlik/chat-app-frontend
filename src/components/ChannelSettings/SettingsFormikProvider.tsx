import { ChannelSettingsValues } from '@components/ChannelSettings/ChannelSettings.types';
import { channelSchema } from '@constants/validationSchema';
import { getPropertiesChanged } from '@helpers/forms';
import Yup from '@src/extendedYup';
import { Formik, FormikProps } from 'formik';
import { ReactNode } from 'react';

SettingsFormikProvider.defaultProps = {
  updatedInitialValues: undefined,
  enableReinitialize: false,
};

function SettingsFormikProvider({
  initialValues,
  updatedInitialValues = undefined,
  onSubmitData,
  enableReinitialize = false,
  children,
}: {
  initialValues: ChannelSettingsValues;
  /** Updated initialValues object to use when detecting form changes inside
   * the onSubmit handler. Use this instead of passing new initialValues if
   * you don't want to lose your current changes.
   */
  updatedInitialValues?: ChannelSettingsValues;
  onSubmitData: (data: FormData) => void;
  enableReinitialize?: boolean;
  children:
    | ReactNode
    | ((pro: FormikProps<ChannelSettingsValues>) => ReactNode);
}) {
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={enableReinitialize}
      validationSchema={Yup.object({
        name: channelSchema.name.required(
          'Please enter a name for the channel',
        ),
      })}
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
