import { useMessageInput } from '@hooks/index';
// has to be imported from @tiptap/core instead of @tiptap/react because of
// incorrect types in tiptap
import { Editor } from '@tiptap/core';
import { useCurrentEditor } from '@tiptap/react';
import { useEffect } from 'react';

function InputRestoreManager({ chatId }: { chatId: string }) {
  const { editor } = useCurrentEditor();
  const { getInput, updateInput } = useMessageInput() ?? {};

  useEffect(() => {
    if (!editor || !getInput) {
      return;
    }
    const nextContent = getInput(chatId);
    if (nextContent) {
      editor.commands.setContent(nextContent, false, {
        preserveWhitespace: 'full',
      });
    } else {
      editor.commands.setContent('');
    }
  }, [chatId, editor, getInput]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    function cleanup() {
      if (editor) {
        editor.off('update', handleEditorUpdate);
      }
      clearTimeout(timeoutId);
    }

    if (!editor) {
      return cleanup;
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow
    function handleEditorUpdate({ editor }: { editor: Editor }) {
      if (updateInput) {
        clearTimeout(timeoutId);
        // debounced to limit unnecessary rerenders
        timeoutId = setTimeout(() => {
          updateInput(editor.getHTML(), chatId);
        }, 300);
      }
    }

    editor.on('update', handleEditorUpdate);
    return cleanup;
  }, [chatId, editor, updateInput]);

  return null;
}

export default InputRestoreManager;
