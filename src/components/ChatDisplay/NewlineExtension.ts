import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    NewlineExtension: {
      /**
       * Comments will be added to the autocomplete.
       */
      addNewline: () => ReturnType;
    };
  }
}

const NewlineExtension = Extension.create({
  name: 'newline',
  addCommands() {
    return {
      addNewline:
        () =>
        ({ state, dispatch }) => {
          const { schema, tr } = state;
          const { paragraph } = schema.nodes;

          const transaction = tr
            .replaceSelectionWith(paragraph.create(), true)
            .scrollIntoView();
          if (dispatch) dispatch(transaction);
          return true;
        },
    };
  },
  addKeyboardShortcuts() {
    return {
      'Ctrl-Enter': () => this.editor.commands.addNewline(),
    };
  },
});

export default NewlineExtension;
