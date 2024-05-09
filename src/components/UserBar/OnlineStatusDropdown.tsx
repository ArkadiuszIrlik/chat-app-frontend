import statusOptionList from '@components/UserBar/constants';
import useOnClickOutside from '@hooks/useOnClickOutside';
import { UserOnlineStatus } from '@src/types';
import { MutableRefObject, useRef } from 'react';

function OnlineStatusDropdown({
  currentStatus,
  onChangeStatus,
  parentButtonRef,
  onClose,
}: {
  currentStatus: UserOnlineStatus;
  onChangeStatus: (nextStatus: UserOnlineStatus) => void;
  parentButtonRef: MutableRefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(onClose, dropdownRef, parentButtonRef);

  return (
    <div
      ref={dropdownRef}
      className="absolute bottom-0 left-full translate-x-4 rounded-md bg-gray-800"
    >
      <div className="flex flex-col gap-1 px-3 py-3">
        {statusOptionList.map((option) => {
          const isActive = currentStatus === option.value;
          return (
            <button
              type="button"
              className={`group flex w-full items-center gap-2 truncate rounded-md px-2 py-1 ${
                isActive ? 'bg-gray-600 hover:bg-gray-500' : 'hover:bg-gray-600'
              }`}
              onClick={() => {
                onClose();
                onChangeStatus(option.value);
              }}
              key={option.value}
            >
              <div
                className={`${option.bgClass} aspect-square h-3 w-3 shrink-0 grow-0 rounded-full`}
              />
              <span className={`${isActive ? 'text-white' : 'text-gray-300'}`}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default OnlineStatusDropdown;
