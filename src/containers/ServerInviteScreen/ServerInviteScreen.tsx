import { JoinServerContent } from '@components/AddServerModal';
import useFetch from '@hooks/useFetch';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ServerInviteScreen() {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const [server, setServer] = useState<Server | null>(null);

  const { refetch, error, data, updateUrl } = useFetch({
    initialUrl: `servers/invites/${inviteCode}/server`,
    method: 'GET',
    onMount: false,
  });

  useEffect(() => {
    updateUrl(`servers/invites/${inviteCode}/server`);
    refetch();
  }, [inviteCode, updateUrl, refetch]);

  useEffect(() => {
    if (!error && data) {
      const { server: nextServer } = data.data as {
        server: Server | undefined;
      };
      if (!nextServer) {
        setServer(null);
        return;
      }
      setServer(nextServer);
    }
  }, [error, data, inviteCode]);
  return (
    <div>
      <div className="mb-3">
        <h1 className="text-xl text-gray-200">Invited to server</h1>
      </div>
      <JoinServerContent
        inviteCode={inviteCode ?? ''}
        server={server}
        onNavigateBack={() => navigate('/app', { replace: true })}
        onCloseModal={() => undefined}
        onCloseServersMenu={() => undefined}
      />
    </div>
  );
}

export default ServerInviteScreen;
