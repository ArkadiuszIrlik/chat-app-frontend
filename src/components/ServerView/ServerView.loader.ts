import { genericFetcherCredentials } from '@helpers/fetch';
import { preload } from 'swr';
import { Params } from 'react-router-dom';

export default async function loader({
  params,
}: {
  params: Params<'serverId'>;
}) {
  if (!params.serverId) {
    return null;
  }
  void preload(
    `/servers/${params.serverId}`,
    genericFetcherCredentials as (key: string) => Promise<Server>,
  );
  return null;
}
