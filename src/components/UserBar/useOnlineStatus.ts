import { useAuth, useFetch, useSocket } from '@hooks/index';
import { UserOnlineStatus } from '@src/types';
import { useCallback, useState } from 'react';

function useOnlineStatus() {
  const { changeOnlineStatus: changeSocketStatus } = useSocket() ?? {};
  const { changeOnlineStatus: changeAuthUserStatus, user } = useAuth() ?? {};
  const [postData, setPostData] = useState({});

  const { refetch } = useFetch({
    initialUrl: `/users/${user?._id}`,
    method: 'PATCH',
    onMount: false,
    postData,
  });

  const changeOnlineStatus = useCallback(
    async (nextStatus: UserOnlineStatus) => {
      if (!changeSocketStatus || !changeAuthUserStatus) {
        return;
      }
      try {
        await changeSocketStatus(nextStatus);
        changeAuthUserStatus(nextStatus);
        setPostData({
          patch: [
            { op: 'replace', path: '/prefersOnlineStatus', value: nextStatus },
          ],
        });
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
