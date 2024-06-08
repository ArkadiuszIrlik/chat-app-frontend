import { Formik, Form } from 'formik';
import Yup from '@src/extendedYup';
import {
  ErrorDisplay,
  SubmitButtonPrimary,
  SubmittingUpdater,
  TextInput,
} from '@components/form-controls';
import useFetch from '@hooks/useFetch';
import { serverInviteSchema } from '@constants/validationSchema';
import { useServerStore } from '@hooks/index';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { exampleServerInviteLink, serverInviteRegex } from '@constants/apiData';

function JoinServerContent({
  onNavigateBack,
  onCloseModal,
  onCloseServersMenu,
}: {
  onNavigateBack: () => void;
  onCloseModal: () => void;
  onCloseServersMenu: () => void;
}) {
  const [postData, setPostData] = useState<{ inviteCode: string }>({
    inviteCode: '',
  });
  const { refetch, hasError, errorMessage, data, isLoading } = useFetch({
    initialUrl: `servers/invites`,
    method: 'POST',
    onMount: false,
    postData,
  });

  const { addToStore } = useServerStore() ?? {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasError && data && addToStore) {
      const { server } = data.data as { server: Server | undefined };
      if (!server) {
        return;
      }
      addToStore(server);
      navigate(`/app/channels/${server._id}`);
      onCloseModal();
      onCloseServersMenu();
    }
  }, [hasError, data, addToStore, navigate, onCloseModal, onCloseServersMenu]);

  return (
    <div className="flex flex-col items-start">
      <Formik
        initialValues={{
          invite: '',
        }}
        validationSchema={Yup.object({
          invite: serverInviteSchema.invite.required(
            'Please enter an invite link or code.',
          ),
        })}
        onSubmit={(values, { setSubmitting }) => {
          const inviteMatch = values.invite.match(serverInviteRegex);

          if (inviteMatch === null) {
            setSubmitting(false);
            return;
          }
          const inviteCode = inviteMatch[1] || inviteMatch[2];
          setPostData({ inviteCode });
          refetch();
        }}
      >
        <Form className="flex flex-col">
          {hasError && (
            <div className="max-w-prose">
              <ErrorDisplay errorMessage={errorMessage} />
            </div>
          )}
          <div className="mb-4 w-80">
            <TextInput
              label="Enter your invite link or code"
              name="invite"
              id="invite"
              type="text"
              placeholder={exampleServerInviteLink}
            />
          </div>
          <SubmittingUpdater isFetchLoading={isLoading} />
          <div className="mb-3 flex items-center gap-10">
            <button
              type="button"
              onClick={onNavigateBack}
              className="block w-32 underline-offset-2 hover:underline"
            >
              Back
            </button>
            <div className="w-32">
              <SubmitButtonPrimary>Join&nbsp;server</SubmitButtonPrimary>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default JoinServerContent;
