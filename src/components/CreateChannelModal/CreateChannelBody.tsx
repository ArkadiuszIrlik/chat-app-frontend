import { Formik, Form, useFormikContext } from 'formik';
import Yup from '@src/extendedYup';
import {
  ErrorDisplay,
  SelectInput,
  SubmitButtonPrimary,
  SubmittingUpdater,
  TextInput,
} from '@components/form-controls';
import useFetch from '@hooks/useFetch';
import { useMemo, useState } from 'react';
import { channelGroupSchema, channelSchema } from '@constants/validationSchema';

function CreateChannelBody({
  server,
  channelCategories,
  onNavigateBack,
  onCloseModal,
}: {
  server: Server;
  channelCategories: ChannelCategory[];
  onNavigateBack: () => void;
  onCloseModal: () => void;
}) {
  const [postData, setPostData] = useState<{
    channelName: string;
    channelCategory: string;
    newChannelCategoryName: string;
  }>({
    channelName: '',
    channelCategory: '',
    newChannelCategoryName: '',
  });

  const channelCategoryOptionsList = useMemo(() => {
    const optionsList =
      channelCategories.map((category) => ({
        label: category.name,
        value: category._id,
      })) ?? [];
    return [
      ...optionsList,
      { label: 'Create new group', value: 'createNewCategory' },
    ];
  }, [channelCategories]);

  const { refetch, hasError, errorMessage, data, isLoading } = useFetch({
    initialUrl: `servers/${server._id}/channels`,
    method: 'POST',
    onMount: false,
    postData,
  });

  if (!hasError && data) {
    onCloseModal();
  }

  return server ? (
    <div className="flex flex-col items-start">
      <Formik
        initialValues={{
          channelName: '',
          channelCategory: channelCategoryOptionsList[0].value,
          newChannelCategoryName: '',
        }}
        validationSchema={Yup.object({
          channelName: channelSchema.name.required(
            'Please enter a channel name.',
          ),
          channelCategory: Yup.string().required('Please select a category.'),
          newChannelCategoryName: channelGroupSchema.name.when(
            'channelCategory',
            {
              is: 'createNewCategory',
              then: (schema) =>
                schema.required(
                  'Please enter a name for the new channel group.',
                ),
            },
          ),
        })}
        onSubmit={(values) => {
          setPostData(values);
          refetch();
        }}
      >
        <Form className="flex flex-col">
          {hasError && (
            <div className="max-w-prose">
              <ErrorDisplay errorMessage={errorMessage} />
            </div>
          )}
          <div className="mb-2 w-80">
            <TextInput
              label="Channel Name"
              name="channelName"
              id="channelName"
              type="text"
              placeholder="Language Learning"
              maxLength={30}
            />
          </div>
          <div className="mb-2 w-80">
            <SelectInput
              label="Channel Group"
              name="channelCategory"
              id="channelCategory"
            >
              {channelCategoryOptionsList.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectInput>
          </div>
          <NewChannelGroupField />
          <SubmittingUpdater isFetchLoading={isLoading} />
          <div className="mb-3 flex items-center gap-10">
            <button
              type="button"
              onClick={onNavigateBack}
              className="block w-32 underline-offset-2 hover:underline"
            >
              Back
            </button>
            <div className="w-40">
              <SubmitButtonPrimary>Create&nbsp;channel</SubmitButtonPrimary>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  ) : (
    <div>Server not found</div>
  );
}

export default CreateChannelBody;

function NewChannelGroupField() {
  const { values } = useFormikContext<{
    channelName: string;
    channelCategory: string;
    newChannelCategoryName: string;
  }>();

  return values.channelCategory === 'createNewCategory' ? (
    <div className="mb-4 w-80">
      <TextInput
        label="Channel Group Name"
        name="newChannelCategoryName"
        id="newChannelCategoryName"
        type="text"
        placeholder="Car Enthusiasts"
        maxLength={25}
      />
    </div>
  ) : null;
}
