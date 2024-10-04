import { useAuth, useFetch, useSocket } from '@hooks/index';
import { UserOnlineStatus } from '@src/types';
import { useCallback, useState } from 'react';

function useOnlineStatus() {
  const { changeOnlineStatus: changeSocketStatus } = useSocket() ?? {};
  const { changeOnlineStatus: changeAuthUserStatus, user } = useAuth() ?? {};
  const [postData, setPostData] = useState(new FormData());

  const { refetch } = useFetch({
    initialUrl: `/users/${user?._id}`,
    method: 'PATCH',
    onMount: false,
    postData,
    isFileUpload: true,
  });

  const changeOnlineStatus = useCallback(
    async (nextStatus: UserOnlineStatus) => {
      if (!changeSocketStatus || !changeAuthUserStatus) {
        return;
      }
      try {
        await changeSocketStatus(nextStatus);
        changeAuthUserStatus(nextStatus);
        const patchData = [
          { op: 'replace', path: '/prefersOnlineStatus', value: nextStatus },
        ];
        const data = new FormData();
        const patchBlob = new Blob([JSON.stringify(patchData)], {
          type: 'application/json',
        });
        data.append('patch', patchBlob);
        setPostData(data);
        refetch();
      } catch {
        /* empty */
      }
    },
    [changeSocketStatus, changeAuthUserStatus, refetch],
  );
  return { changeOnlineStatus };
}
export default useOnlineStatus;
