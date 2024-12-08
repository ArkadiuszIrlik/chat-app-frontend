import { useCallback, useEffect, useMemo, useState } from 'react';
import useFetch from '@hooks/useFetch';
import { ServerSettingsValues } from '@components/ServerSettings/types';

function usePostFormData({
  server,
  serverId,
}: {
  server: Server | undefined;
  serverId: string | undefined;
}) {
  const updatedValues: ServerSettingsValues = useMemo(
    () => ({
      name: server?.name ?? '',
      serverImg: server?.serverImg ?? '',
    }),
    [server],
  );

  const [initialValues] = useState(updatedValues);
  const [postData, setPostData] = useState(new FormData());
  // Used to inform other components when data submitted successfully
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { refetch, isLoading, error, updateUrl } = useFetch({
    initialUrl: `servers/${serverId}`,
    method: 'PATCH',
    onMount: false,
    postData,
    isFileUpload: true,
  });

  useEffect(() => {
    updateUrl(`servers/${serverId}`);
  }, [serverId, updateUrl]);

  useEffect(() => {
    if (!isLoading && !error) {
      setHasSubmitted(true);
    }
  }, [error, isLoading]);

  // makes sure hasSubmitted is only true for one render
  useEffect(() => {
    if (hasSubmitted) {
      setHasSubmitted(false);
    }
  }, [hasSubmitted]);

  const handleSubmitData = useCallback(
    (data: FormData) => {
      setPostData(data);
      refetch();
    },
    [refetch],
  );

  return {
    initialValues,
    updatedValues,
    error,
    isLoading,
    hasSubmitted,
    handleSubmitData,
  };
}

export default usePostFormData;
