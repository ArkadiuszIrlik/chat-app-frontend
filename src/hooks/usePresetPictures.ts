import { genericFetcherCredentials, HttpError } from '@helpers/fetch';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

interface PresetPicture {
  id: string;
  altText: string;
  url: string;
}

const initialArray: PresetPicture[] = [];

function usePresetPictures({
  type,
}: {
  type: 'server image' | 'profile picture';
}) {
  const [key, setKey] = useState<string | null>(null);
  useEffect(() => {
    let nextKey = '';
    switch (true) {
      case type === 'server image':
        nextKey = 'images/server-img/presets';
        break;
      case type === 'profile picture':
        nextKey = 'images/profile-img/presets';
        break;
      default:
        nextKey = '';
    }
    setKey(nextKey);
  }, [type]);

  const { data, isLoading, error } = useSWR<
    {
      message: string;
      data: { presets: PresetPicture[] };
    },
    HttpError
  >(key, genericFetcherCredentials, {
    revalidateOnFocus: false,
  });

  return {
    pictures: data?.data.presets ?? initialArray,
    isLoading,
    error,
  };
}

export default usePresetPictures;
