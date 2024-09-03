import { Formik, Form, useFormikContext } from 'formik';
import Yup from '@src/extendedYup';
import {
  ErrorDisplay,
  SelectInput,
  SubmittingUpdater,
  TextOutput,
} from '@components/form-controls';
import useFetch from '@hooks/useFetch';
import { useCallback, useEffect } from 'react';
import { PrimaryButton } from '@components/PrimaryButton';

const expTimeOptions = [
  { label: '7 days', value: 7 * 24 * 60 * 60 * 1000 },
  { label: '1 day', value: 24 * 60 * 60 * 1000 },
  { label: '10 minutes', value: 10 * 60 * 1000 },
  { label: 'Never expire', value: 100 * 365 * 24 * 60 * 60 * 1000 },
];

const defaultExpTimeSetting = expTimeOptions[0];

function InviteToServerContent({
  serverId,
  onCloseModal,
}: {
  serverId: string;
  onCloseModal: () => void;
}) {
  const { refetch, hasError, errorMessage, data, isLoading, updateParams } =
    useFetch<{ data: { inviteUrl: string } }>({
      initialUrl: `servers/${serverId}/invites`,
      method: 'GET',
      onMount: false,
      initialParams: { expTime: defaultExpTimeSetting.value },
    });

  const inviteLink = data?.data?.inviteUrl ?? '';

  const handleCopyInviteLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
    } catch {
      /* empty */
    }
  }, [inviteLink]);

  return (
    <Formik
      initialValues={{
        inviteExpTime: defaultExpTimeSetting.value,
      }}
      validationSchema={Yup.object({
        inviteExpTime: Yup.number().required(
          'Please select an expiry time for the invite',
        ),
      })}
      onSubmit={(values) => {
        updateParams({ expTime: values.inviteExpTime });
        refetch();
      }}
    >
      <Form>
        {hasError && (
          <div className="max-w-prose">
            <ErrorDisplay errorMessage={errorMessage} />
          </div>
        )}
        <div className="mb-2 w-40">
          <SelectInput
            label="Invite Duration"
            name="inviteExpTime"
            id="inviteExpTime"
          >
            {expTimeOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </SelectInput>
        </div>
        <div className="mb-4">
          <TextOutput
            label="Invite Link"
            name="inviteLink"
            isLoading={isLoading}
            value={inviteLink}
          />
        </div>
        <SubmittingUpdater isFetchLoading={isLoading} />
        <SubmitOnValueChange />
        <div className="mb-3 flex items-center gap-10">
          <button
            type="button"
            onClick={onCloseModal}
            className="block w-32 underline-offset-2 hover:underline"
          >
            Back
          </button>
          <div className="w-40">
            <PrimaryButton
              type="button"
              onClickHandler={() => void handleCopyInviteLink()}
            >
              Copy&nbsp;Invite
            </PrimaryButton>
          </div>
        </div>
      </Form>
    </Formik>
  );
}

export default InviteToServerContent;

function SubmitOnValueChange() {
  const { values, submitForm } = useFormikContext();
  useEffect(() => {
    void submitForm();
  }, [values, submitForm]);

  return null;
}
