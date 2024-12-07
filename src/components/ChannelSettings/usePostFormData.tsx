import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChannelSettingsValues } from '@components/ChannelSettings/ChannelSettings.types';
import useFetch from '@hooks/useFetch';

function usePostFormData({
  channel,
  channelId,
  serverId,
}: {
  channel: Channel | undefined;
  channelId: string | undefined;
  serverId: string | undefined;
}) {
  const updatedValues: ChannelSettingsValues = useMemo(
    () => ({
      name: channel?.name ?? '',
    }),
    [channel],
  );

  const [initialValues] = useState(updatedValues);
  const [postData, setPostData] = useState(new FormData());

  const { refetch, isLoading, error, updateUrl } = useFetch({
    initialUrl: `servers/${serverId}/channels/${channelId}`,
    method: 'PATCH',
    onMount: false,
    postData,
    isFileUpload: true,
  });

  useEffect(() => {
    updateUrl(`servers/${serverId}/channels/${channelId}`);
  }, [serverId, channelId, updateUrl]);

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
    handleSubmitData,
  };
}

export default usePostFormData;
