import { ChatRole } from '@components/ChatDisplay/useChatAuth.types';
import { useAuth } from '@hooks/index';
import { useEffect, useState } from 'react';

/** Returns array of current user's auth roles at the chat level. */
function useChatAuth({ server }: { server: Server }) {
  const { user } = useAuth() ?? {};
  const [userRoles, setUserRoles] = useState<ChatRole[]>([]);

  useEffect(() => {
    const allowedRoles: ChatRole[] = [];
    if (!user?._id) {
      setUserRoles(allowedRoles);
      return;
    }
    if (user._id === server.ownerId) {
      allowedRoles.push(ChatRole.Admin);
    }

    setUserRoles(allowedRoles);
  }, [user?._id, server.ownerId]);

  return { userRoles };
}

export default useChatAuth;
