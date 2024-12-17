import { genericFetcherCredentials } from '@helpers/fetch';
import useSWR from 'swr';

interface PresetPicture {
  id: string;
  altText: string;
  url: string;
}

const initialArray: PresetPicture[] = [];

function usePresetPictures() {
  const { data } = useSWR<{
    message: string;
    data: { presets: PresetPicture[] };
  }>('images/server-img/presets', genericFetcherCredentials, {
    revalidateOnFocus: false,
  });

  const pictures = data?.data.presets ?? initialArray;

  return pictures;
}

export default usePresetPictures;
