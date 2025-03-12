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
import { useEffect, useState } from 'react';
import { exampleServerInviteLink, serverInviteRegex } from '@constants/apiData';

function EnterServerInviteContent({
  onValidInvite,
  onNavigateBack,
}: {
  onValidInvite: (inviteCode: string, server: Server) => unknown;
  onNavigateBack: () => void;
}) {
  const [inviteCode, setInviteCode] = useState('');
  const { refetch, hasError, errorMessage, data, isLoading, updateUrl } =
    useFetch({
      initialUrl: `servers/invites/${inviteCode}/server`,
      method: 'GET',
      onMount: false,
    });

  useEffect(() => {
    updateUrl(`servers/invites/${inviteCode}/server`);
  }, [inviteCode, updateUrl]);

  useEffect(() => {
    if (!hasError && data) {
      const { server } = data.data as { server: Server | undefined };
      if (!server) {
        return;
      }
      onValidInvite(inviteCode, server);
    }
  }, [hasError, data, inviteCode, onValidInvite]);

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
          const code = inviteMatch[1] || inviteMatch[2];
          setInviteCode(code);
          updateUrl(`servers/invites/${code}/server`);
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

export default EnterServerInviteContent;
