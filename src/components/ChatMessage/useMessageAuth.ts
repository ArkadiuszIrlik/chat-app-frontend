import { ChatRole } from '@components/ChatDisplay/useChatAuth.types';
import { MessageRole } from '@components/ChatMessage/useMessageAuth.types';
import { useAuth } from '@hooks/index';
import { useEffect, useState } from 'react';

/** Returns array of current user's auth roles at the message level,
 * combined with roles from the chat level. */
function useMessageAuth({
  authorId,
  chatRoles,
}: {
  authorId: string;
  chatRoles: ChatRole[];
}) {
  const { user } = useAuth() ?? {};
  const [userRoles, setUserRoles] = useState<(ChatRole | MessageRole)[]>([]);

  useEffect(() => {
    const allowedRoles: typeof userRoles = [...chatRoles];
    if (!user?._id) {
      setUserRoles(allowedRoles);
      return;
    }
    if (user._id === authorId) {
      allowedRoles.push(MessageRole.Author);
    }

    setUserRoles(allowedRoles);
  }, [user?._id, authorId, chatRoles]);

  return { userRoles };
}

export default useMessageAuth;
