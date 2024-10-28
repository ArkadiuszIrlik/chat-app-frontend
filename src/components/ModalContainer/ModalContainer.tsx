import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

ModalContainer.defaultProps = {
  closeOnClickOutside: false,
  darkenBackdrop: false,
  isAlert: false,
};

function ModalContainer({
  children,
  isOpen,
  onClose,
  closeOnClickOutside = false,
  darkenBackdrop = false,
  ariaLabel,
  ariaDescription,
  isAlert = false,
}: {
  children?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  closeOnClickOutside?: boolean;
  darkenBackdrop?: boolean;
  ariaLabel?: string;
  ariaDescription?: string;
  isAlert?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // when closing the modal, keeps element in the DOM until the focus is returned
  const [isMounted, setIsMounted] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      setIsMounted(true);
    } else {
      dialogRef.current?.close();
      setIsMounted(false);
    }
  }, [isOpen]);

  useEffect(() => {
    dialogRef.current?.addEventListener('close', onClose);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      dialogRef.current?.removeEventListener('close', onClose);
    };
  }, [onClose]);

  return (
    (isOpen || isMounted) &&
    createPortal(
      <dialog
        ref={dialogRef}
        aria-label={ariaLabel}
        aria-description={ariaDescription}
        role={isAlert ? 'alertdialog' : 'dialog'}
        className={`w-11/12 max-w-96 ${
          darkenBackdrop ? 'backdrop:bg-gray-900/70' : 'backdrop:bg-gray-500/30'
        }`}
      >
        <div className="rounded-lg bg-gray-700 px-5 py-4">
          {closeOnClickOutside && (
            /* eslint-disable-next-line jsx-a11y/no-static-element-interactions */
            <div className="fixed inset-0 -z-10" onMouseDown={onClose} />
          )}
          {children}
        </div>
      </dialog>,
      document.body,
    )
  );
}
export default ModalContainer;
