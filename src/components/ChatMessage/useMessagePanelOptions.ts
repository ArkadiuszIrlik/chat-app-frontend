import { ChatRole } from '@components/ChatDisplay/useChatAuth.types';
import {
  Option,
  PanelOptionsIds,
} from '@components/ChatMessage/MessagePanel.types';
import { MessageRole } from '@components/ChatMessage/useMessageAuth.types';
import { useEffect, useState } from 'react';

const allOptions: Option[] = [
  {
    optionId: PanelOptionsIds.DeleteMessage,
    allowedRoles: [ChatRole.Admin, MessageRole.Author],
  },
];

function useMessagePanelOptions({
  userRoles,
}: {
  userRoles: (ChatRole | MessageRole)[];
}) {
  const [allowedOptions, setAllowedOptions] = useState<Option[]>([]);

  useEffect(() => {
    const nextAllowedOptions = allOptions.filter(
      (option) =>
        !!option.allowedRoles.find((allowedRole) =>
          userRoles.includes(allowedRole),
        ),
    );
    setAllowedOptions(nextAllowedOptions);
  }, [userRoles]);

  return { allowedOptions };
}

export default useMessagePanelOptions;
