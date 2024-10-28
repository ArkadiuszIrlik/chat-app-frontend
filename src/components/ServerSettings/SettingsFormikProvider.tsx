import { serverSchema } from '@constants/validationSchema';
import Yup from '@src/extendedYup';
import { getPropertiesChanged } from '@helpers/forms';
import { ServerSettingsValues } from '@components/ServerSettings/types';
import { ReactNode } from 'react';
import { Formik } from 'formik';

function SettingsFormikProvider({
  initialValues,
  onSubmitData,
  children,
}: {
  initialValues: ServerSettingsValues;
  onSubmitData: (data: FormData) => void;
  children: ReactNode;
}) {
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={Yup.object({
        serverImg: Yup.mixed().oneOfSchemas([
          Yup.string(),
          // .test(
          //   'is-empty-string',
          //   (d) => `${d.path} should be an image file or an empty string`,
          //   (value) => value === initialValues.serverImg,
          // )
          serverSchema.image,
        ]),
        name: serverSchema.name.required(
          'Please enter a name for your server.',
        ),
      })}
      onSubmit={(values) => {
        const propertiesChanged = getPropertiesChanged(initialValues, values);
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

        // actual server image blob gets added in a separate
        // property
        if (propertiesChanged.includes('serverImg')) {
          data.append('serverImg', values.serverImg);
        }

        onSubmitData(data);
      }}
    >
      {children}
    </Formik>
  );
}

export default SettingsFormikProvider;
