import { FormValues } from '@components/CompleteAccountSetup/CompleteAccountSetup.types';
import SetupForm from '@components/CompleteAccountSetup/SetupForm';
import { userSchema } from '@constants/validationSchema';
import { useAuth } from '@hooks/index';
import useFetch from '@hooks/useFetch';
import usePresetPictures from '@hooks/usePresetPictures';
import Yup from '@src/extendedYup';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const initialValues: FormValues = {
  username: '',
  selectProfilePicture: null,
  uploadProfilePicture: null,
  profileImg: '',
  isUploadingProfilePicture: false,
};

function CompleteAccountSetup() {
  const { user, isSetupComplete, login } = useAuth() ?? {};
  const [postData, setPostData] = useState({});
  const { pictures: presetPictures } = usePresetPictures({
    type: 'profile picture',
  });
  const navigate = useNavigate();
  const location = useLocation();

  const { refetch, updateUrl, data, isLoading, error } = useFetch({
    initialUrl: `users/${user?._id}/account-status`,
    method: 'POST',
    onMount: false,
    postData,
  });

  useEffect(() => {
    updateUrl(`users/${user?._id}/account-status`);
  }, [user?._id, updateUrl]);

  useEffect(() => {
    if (data && login) {
      void login();
    }
  }, [data, login]);

  useEffect(() => {
    if (isSetupComplete) {
      const returnTo = (location.state as null | { returnTo?: string })
        ?.returnTo;
      navigate(returnTo ?? '/app/', { replace: true });
    }
  }, [isSetupComplete, location.state, navigate]);

  return (
    <div className="w-96">
      <p className="mb-3 text-2xl text-gray-100">Welcome to Beluga!</p>
      <p className="mb-4 text-gray-100">
        Let&apos;s finish setting up your account.
      </p>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          username: userSchema.username.required('Please enter a username'),
          profileImg: Yup.mixed().required(
            'Please select or upload a profile picture',
          ),
          selectProfilePicture: Yup.mixed().nullable(),
          uploadProfilePicture: Yup.mixed()
            .oneOfSchemas(
              [
                // this schema is here just to allow null values
                Yup.string().nullable(),
                userSchema.image,
              ],
              { passNestedError: 1 },
            )
            .nullable(),
          isUploadingProfilePicture: Yup.boolean()
            .isFalse('Please wait while your profile picture is uploaded')
            .required(),
        })}
        onSubmit={(values) => {
          setPostData({
            username: values.username,
            profileImg: values.profileImg,
          });
          refetch();
        }}
      >
        <SetupForm
          errorMessage={error?.message ?? ''}
          hasError={!!error}
          isUpdateFetchLoading={isLoading}
          presetImages={presetPictures}
        />
      </Formik>
    </div>
  );
}
export default CompleteAccountSetup;
