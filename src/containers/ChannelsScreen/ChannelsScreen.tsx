import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftSidebar from '@components/ServerView/LeftSidebar';
import { useServerStore } from '@hooks/index';

function ChannelsScreen() {
  const navigate = useNavigate();
  const { serverList } = useServerStore() ?? { serverList: [] };
  const isServerListEmpty = serverList.length === 0;

  useEffect(() => {
    if (!isServerListEmpty) {
      navigate(`${serverList[0]._id}`, { replace: true });
    }
  }, [isServerListEmpty, navigate, serverList]);

  return (
    <div className="flex max-h-screen min-h-screen grow">
      <LeftSidebar isEmptyServerList />
      <div className="flex grow">
        {isServerListEmpty && (
          <div className="px-2 pt-2 md:px-10 md:pt-12">
            <div className="max-w-prose text-gray-100">
              It looks like you haven&apos;t joined any servers yet. Let&apos;s
              get you set up. Click &quot;Add a server&quot; in the panel to the
              left to join or create a new server.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChannelsScreen;
