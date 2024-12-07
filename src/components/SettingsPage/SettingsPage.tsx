import { ErrorDisplay } from '@components/form-controls';
import {
  SettingsContainer,
  SettingsContainerBlockUnsaved,
} from '@components/SettingsContainer';
import styleConsts from '@constants/styleConsts';
import { useBlockUnsaved } from '@hooks/index';
import { BlockUnsavedProvider } from '@hooks/useBlockUnsaved';
import { useFormikContext } from 'formik';
import { ReactNode, useCallback } from 'react';
import { SyncLoader } from 'react-spinners';

SettingsPage.defaultProps = {
  nextInitialValues: undefined,
  nextResetFormValues: undefined,
  shouldBlockOnCloseSettings: false,
};

function SettingsPage({
  children,
  pageLabel,
  hasLoadedData,
  loadError,
  isLoading,
  nextInitialValues = undefined,
  nextResetFormValues = undefined,
  shouldBlockOnCloseSettings = false,
  onCloseSettings,
}: {
  children: ReactNode;
  pageLabel: string;
  hasLoadedData: boolean;
  loadError: { message: string } | undefined;
  isLoading: boolean;
  /** Lets you pass a values object to use for detecting form changes instead
   * of the initialValues provided by useFormikContext. Helpful if you don't
   * want to clear the form using enableReinitialize in Formik provider.
   */
  nextInitialValues?: object;
  /** Values to be provided to formik when resetting state instead of
   * initialValues.
   */
  nextResetFormValues?: object;
  /** Specify if you want a Discard Changes dialog to show up when
   * onCloseSettings is called while the form has unsaved changes.
   */
  shouldBlockOnCloseSettings?: boolean;
  onCloseSettings: () => void;
}) {
  return hasLoadedData ? (
    <BlockUnsavedWrapper
      pageLabel={pageLabel}
      nextInitialValues={nextInitialValues}
      nextResetFormValues={nextResetFormValues}
      shouldBlockOnCloseSettings={shouldBlockOnCloseSettings}
      onCloseSettings={onCloseSettings}
    >
      {children}
    </BlockUnsavedWrapper>
  ) : (
    <SettingsNoData
      pageLabel={pageLabel}
      loadError={loadError}
      isLoading={isLoading}
      onCloseSettings={onCloseSettings}
    />
  );
}

BlockUnsavedWrapper.defaultProps = {
  nextInitialValues: undefined,
  nextResetFormValues: undefined,
  shouldBlockOnCloseSettings: false,
};

function BlockUnsavedWrapper({
  children,
  pageLabel,
  nextInitialValues = undefined,
  nextResetFormValues = undefined,
  shouldBlockOnCloseSettings = false,
  onCloseSettings,
}: {
  children: ReactNode;
  pageLabel: string;
  nextInitialValues?: object;
  nextResetFormValues?: object;
  shouldBlockOnCloseSettings?: boolean;
  onCloseSettings: () => void;
}) {
  const { initialValues, values, resetForm, submitForm } = useFormikContext();

  return (
    <BlockUnsavedProvider
      onCancelChanges={() => {
        if (nextResetFormValues) {
          resetForm({ values: nextResetFormValues });
        } else {
          resetForm();
        }
      }}
      onConfirmChanges={() => void submitForm()}
      initialValues={nextInitialValues ?? initialValues}
      currentValues={values}
    >
      <SettingsWrapper
        pageLabel={pageLabel}
        shouldBlockOnCloseSettings={shouldBlockOnCloseSettings}
        onCloseSettings={onCloseSettings}
      >
        {children}
      </SettingsWrapper>
    </BlockUnsavedProvider>
  );
}

SettingsWrapper.defaultProps = {
  shouldBlockOnCloseSettings: false,
};

function SettingsWrapper({
  children,
  pageLabel,
  shouldBlockOnCloseSettings = false,
  onCloseSettings,
}: {
  children: ReactNode;
  pageLabel: string;
  shouldBlockOnCloseSettings?: boolean;
  onCloseSettings: () => void;
}) {
  const blockUnsavedProps = useBlockUnsaved();
  const { blockUntilSaved } = blockUnsavedProps ?? {};

  const blockedOnCloseSettings = useCallback(() => {
    if (blockUntilSaved && shouldBlockOnCloseSettings) {
      blockUntilSaved(onCloseSettings);
      return;
    }
    onCloseSettings();
  }, [blockUntilSaved, shouldBlockOnCloseSettings, onCloseSettings]);

  const { isSubmitting } = useFormikContext();

  return (
    <SettingsContainer
      label={pageLabel}
      onCloseSettings={blockedOnCloseSettings}
    >
      {children}
      {blockUnsavedProps && (
        <SettingsContainerBlockUnsaved
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...blockUnsavedProps}
          isSaveButtonDisabled={isSubmitting}
        />
      )}
    </SettingsContainer>
  );
}

function SettingsNoData({
  pageLabel,
  loadError,
  isLoading,
  onCloseSettings,
}: {
  pageLabel: string;
  loadError: { message: string } | undefined;
  isLoading: boolean;
  onCloseSettings: () => void;
}) {
  return (
    <SettingsContainer label={pageLabel} onCloseSettings={onCloseSettings}>
      {loadError && !isLoading && (
        <div className="max-w-prose">
          <ErrorDisplay errorMessage={loadError.message} />
        </div>
      )}
      {isLoading && (
        <div className="flex grow items-center justify-center">
          <SyncLoader
            color={styleConsts.colors.gray[300]}
            speedMultiplier={0.8}
            size={10}
          />
        </div>
      )}
    </SettingsContainer>
  );
}

export default SettingsPage;
