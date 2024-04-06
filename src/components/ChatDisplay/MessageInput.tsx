import {
  EditorProvider,
  FloatingMenu,
  BubbleMenu,
  Extension,
  useCurrentEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect, useMemo, useState } from 'react';
import socket from '@helpers/socket';
import Placeholder from '@tiptap/extension-placeholder';

// const ShortcutExtension = Extension.create({
//   addKeyboardShortcuts() {
//     return {
//       Enter: () => {
//         const messageText = this.editor.getHTML();
//         handleSendMessage(messageText);
//         return this.editor.commands.clearContent();
//       },
//     };
//   },
// });
// const extensions = [StarterKit, ShortcutExtension];

// function submitMessage() {}
// function handleSendMessage(msgText: string, socketId: string) {
//   socket.emit(
//     'chat message',
//     {
//       text: msgText,
//     },
//     socketId,
//   );
// }

function MessageInput({ channelSocketId }: { channelSocketId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // function handleSendMessage(msgText: string) {
  //   socket.emit(
  //     'chat message',
  //     {
  //       text: msgText,
  //     },
  //     channelSocketId,
  //   );
  // }
  const handleSendMessage = useCallback(
    (msgText: string) => {
      socket.emit(
        'chat message',
        {
          text: msgText,
        },
        channelSocketId,
      );
    },
    [channelSocketId],
  );
  const ShortcutExtension = useMemo(
    () =>
      Extension.create({
        addKeyboardShortcuts() {
          return {
            Enter: () => {
              // eslint-disable-next-line react/no-this-in-sfc
              const messageText = this.editor.getText();
              if (messageText !== '') {
                setIsSubmitting(true);
              }
              // handleSendMessage(messageText, channelSocketId);
              // handleSendMessage(messageText);
              return true;

              // eslint-disable-next-line react/no-this-in-sfc
              return this.editor.commands.clearContent();
            },
          };
        },
      }),
    [handleSendMessage],
  );

  const handleStopSubmitting = useCallback(() => {
    setIsSubmitting(false);
  }, [setIsSubmitting]);
  return (
    <div className="p-4">
      <EditorProvider
        extensions={[
          StarterKit,
          Placeholder.configure({
            placeholder: 'Say something...',
          }),
          ShortcutExtension,
        ]}
        editorProps={{
          attributes: {
            class:
              'prose dark:prose-invert bg-gray-600 mx-auto px-5 py-2 rounded-lg',
          },
        }}
      >
        <MessageSender
          channelSocketId={channelSocketId}
          isSubmitting={isSubmitting}
          onStopSubmitting={handleStopSubmitting}
        />
        <FloatingMenu>This is the floating menu</FloatingMenu>
        <BubbleMenu>This is the bubble menu</BubbleMenu>
      </EditorProvider>
    </div>
  );
}
export default MessageInput;

function MessageSender({
  isSubmitting,
  onStopSubmitting,
  channelSocketId,
}: {
  isSubmitting: boolean;
  onStopSubmitting: () => void;
  channelSocketId: string;
}) {
  const { editor } = useCurrentEditor();
  useEffect(() => {
    if (isSubmitting) {
      const messageContent = editor?.getHTML();
      socket.emit(
        'chat message',
        {
          text: messageContent,
        },
        channelSocketId,
      );
      editor?.commands.clearContent();
      onStopSubmitting();
    }
  }, [isSubmitting, onStopSubmitting, channelSocketId, editor]);
  return null;
}
