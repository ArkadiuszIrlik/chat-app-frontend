import { ChatRole } from '@components/ChatDisplay/useChatAuth.types';
import { MessageRole } from '@components/ChatMessage/useMessageAuth.types';

enum PanelOptionsIds {
  DeleteMessage = 'delete_message',
}

interface Option {
  optionId: PanelOptionsIds;
  allowedRoles: (ChatRole | MessageRole)[];
}

export { PanelOptionsIds, type Option };
