import { useCallback, useEffect, useMemo, useState } from 'react';
import useFetch from '@hooks/useFetch';
import { ChannelGroupSettingsValues } from '@components/ChannelGroupSettings/ChannelGroupSettings.types';

function usePostFormData({
  channelGroup,
  channelGroupId,
  serverId,
}: {
  channelGroup: ChannelCategory | undefined;
  channelGroupId: string | undefined;
  serverId: string | undefined;
}) {
  const updatedValues: ChannelGroupSettingsValues = useMemo(
    () => ({
      name: channelGroup?.name ?? '',
    }),
    [channelGroup],
  );

  const [initialValues] = useState(updatedValues);
  const [postData, setPostData] = useState(new FormData());

  const { refetch, isLoading, error, updateUrl } = useFetch({
    initialUrl: `servers/${serverId}/channelCategories/${channelGroupId}`,
    method: 'PATCH',
    onMount: false,
    postData,
    isFileUpload: true,
  });

  useEffect(() => {
    updateUrl(`servers/${serverId}/channelCategories/${channelGroupId}`);
  }, [serverId, channelGroupId, updateUrl]);

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
