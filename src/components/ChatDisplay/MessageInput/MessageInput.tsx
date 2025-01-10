import { EditorProvider, Extension, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Placeholder from '@tiptap/extension-placeholder';
import { useParams } from 'react-router-dom';
import { useAuth } from '@hooks/index';
import InputRestoreManager from '@components/ChatDisplay/MessageInput/InputRestoreManager';
import useSendMessage from '@hooks/useSendMessage';
import NewlineExtension from '@components/ChatDisplay/MessageInput/NewlineExtension';

const urlRegex =
  // eslint-disable-next-line no-useless-escape
  /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:;\/~+#-]*[\w@?^=%&\/~+#-])/g;

MessageInput.defaultProps = {
  onMessageSent: undefined,
};

function MessageInput({
  chatId,
  channelSocketId,
  onMessageSent = undefined,
}: {
  chatId: string;
  channelSocketId: string;
  onMessageSent?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditorCreated, setIsEditorCreated] = useState(false);

  const ShortcutExtension = useMemo(
    () =>
      Extension.create({
        addKeyboardShortcuts() {
          return {
            Enter: () => {
              // eslint-disable-next-line react/no-this-in-sfc
              const isEmpty = !this.editor.getText().trim().length;
              if (!isEmpty) {
                setIsSubmitting(true);
              }
              return true;
            },
          };
        },
      }),
    [],
  );

  const handleStopSubmitting = useCallback(() => {
    setIsSubmitting(false);
  }, [setIsSubmitting]);
  return (
    <div className="min-h-10 px-3 py-2 opacity-100">
      <div
        className={`z-0 mx-auto max-w-prose rounded-lg bg-gray-600 px-2 py-2 has-[:focus-visible]:outline ${
          // mitigates flash before editor is loaded
          isEditorCreated ? '' : 'min-h-10'
        }`}
      >
        <div className="relative">
          <div className="absolute left-0 right-0 top-0 z-10 h-2 bg-gradient-to-t from-gray-600/0 to-gray-600" />
        </div>
        <EditorProvider
          onCreate={() => {
            setIsEditorCreated(true);
          }}
          extensions={[
            StarterKit,
            Placeholder.configure({
              placeholder: 'Say something...',
            }),
            ShortcutExtension,
            NewlineExtension,
          ]}
          editorProps={{
            attributes: {
              class:
                'prose prose-invert px-2 xs:px-5 max-h-28 overflow-auto overscroll-contain focus-visible:outline-none',
            },
            transformPastedHTML(html) {
              return (
                new DOMParser().parseFromString(html, 'text/html')
                  .documentElement.textContent ?? ''
              );
            },
          }}
        >
          <MessageSender
            channelSocketId={channelSocketId}
            isSubmitting={isSubmitting}
            onStopSubmitting={handleStopSubmitting}
            onMessageSent={onMessageSent}
          />
          <InputRestoreManager chatId={chatId} />
        </EditorProvider>
      </div>
    </div>
  );
}
export default MessageInput;

MessageSender.defaultProps = {
  onMessageSent: undefined,
};

function MessageSender({
  isSubmitting,
  onStopSubmitting,
  onMessageSent = undefined,
  channelSocketId,
}: {
  isSubmitting: boolean;
  onStopSubmitting: () => void;
  onMessageSent?: () => void;
  channelSocketId: string;
}) {
  const { editor } = useCurrentEditor();
  const { channelId } = useParams();
  const { user } = useAuth() ?? {};
  const { sendMessageOptimistic } = useSendMessage() ?? {};

  const handleSendMessage = useCallback(
    (message: { text: string }, chatId: string, socketId: string) => {
      if (chatId === undefined || !user || !sendMessageOptimistic) {
        return;
      }
      const processedText = convertLinksToAnchors(message.text);
      const clientMessage = {
        postedAt: new Date(),
        author: {
          _id: user._id,
          username: user.username,
          profileImg: user.profileImg,
        },
        text: processedText,
        chatId,
        clientId: crypto.randomUUID(),
      };
      sendMessageOptimistic(chatId, socketId, clientMessage);
      if (onMessageSent) {
        onMessageSent();
      }
    },
    [user, sendMessageOptimistic, onMessageSent],
  );

  useEffect(() => {
    if (editor && isSubmitting && channelId) {
      const messageContent = editor.getHTML();
      handleSendMessage({ text: messageContent }, channelId, channelSocketId);
      // emitUpdate for InputRestoreManager to get notified
      editor.commands.clearContent(true);
      onStopSubmitting();
    }
  }, [
    isSubmitting,
    onStopSubmitting,
    channelSocketId,
    editor,
    channelId,
    handleSendMessage,
  ]);
  return null;
}

function convertLinksToAnchors(text: string) {
  return text.replace(
    urlRegex,
    (match) => `<a href="${match}" target="_blank">${match}</a>`,
  );
}
