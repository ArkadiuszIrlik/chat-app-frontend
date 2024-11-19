import useOnClickOutside from '@hooks/useOnClickOutside';
import useToggle from '@hooks/useToggle';
import { useCallback, useEffect, useRef, useState } from 'react';

function useMessagePanel() {
  const {
    activate: openMessagePanel,
    deactivate: closeMessagePanel,
    toggle: toggleOpenMessagePanel,
    isActive: isOpenMessagePanel,
  } = useToggle();

  const [isPanelOptionOpen, setIsPanelOptionOpen] = useState(false);
  const handleChangePanelOption = useCallback((activeOption: string | null) => {
    if (activeOption === null) {
      setIsPanelOptionOpen(false);
    } else {
      setIsPanelOptionOpen(true);
    }
  }, []);

  // works around React portal elements not being considered descendants of
  // messagePanelContainerRef
  const conditionalCloseMessagePanel = useCallback(() => {
    if (!isPanelOptionOpen) {
      closeMessagePanel();
    }
  }, [isPanelOptionOpen, closeMessagePanel]);

  const messagePanelContainerRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(conditionalCloseMessagePanel, messagePanelContainerRef);
  useEffect(() => {
    function cleanup() {
      window.removeEventListener('scroll', closePanelOnScroll, {
        capture: true,
      });
    }
    if (!isOpenMessagePanel) {
      return cleanup;
    }

    function closePanelOnScroll(e: Event) {
      // allow scroll inside MessagePanel
      if (
        e.target instanceof Node &&
        messagePanelContainerRef.current &&
        messagePanelContainerRef.current.contains(e.target)
      ) {
        return;
      }

      conditionalCloseMessagePanel();
      window.removeEventListener('scroll', closePanelOnScroll, {
        capture: true,
      });
    }

    window.addEventListener('scroll', closePanelOnScroll, {
      capture: true,
    });
    return cleanup;
  }, [isOpenMessagePanel, conditionalCloseMessagePanel]);

  const [hasLostFocus, setHasLostFocus] = useState(false);
  useEffect(() => {
    const containerEl = messagePanelContainerRef.current;
    function cleanup() {
      if (!containerEl) {
        return;
      }
      containerEl.removeEventListener('focusout', closeOnTabAway);
    }

    function closeOnTabAway(e: FocusEvent) {
      if (!containerEl) {
        return;
      }
      if (
        e.relatedTarget instanceof Node &&
        !containerEl.contains(e.relatedTarget)
      ) {
        // extra state required because "focusout" fires before
        // conditionalCloseMessagePanel gets updated
        setHasLostFocus(true);
      }
    }

    if (!containerEl || !isOpenMessagePanel) {
      return cleanup;
    }

    containerEl.addEventListener('focusout', closeOnTabAway);
    return cleanup;
  }, [isOpenMessagePanel, conditionalCloseMessagePanel, isPanelOptionOpen]);

  useEffect(() => {
    if (hasLostFocus) {
      conditionalCloseMessagePanel();
      setHasLostFocus(false);
    }
  }, [hasLostFocus, conditionalCloseMessagePanel]);

  return {
    isOpenMessagePanel,
    messagePanelContainerRef,
    closeMessagePanel,
    openMessagePanel,
    toggleOpenMessagePanel,
    handleChangePanelOption,
  };
}

export default useMessagePanel;
