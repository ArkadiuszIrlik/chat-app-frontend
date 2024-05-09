import OnlineStatusDropdown from '@components/UserBar/OnlineStatusDropdown';
import statusOptionList from '@components/UserBar/constants';
import { UserProfileImage } from '@components/UserProfileImage';
import useOnClickOutside from '@hooks/useOnClickOutside';
import { ExtendedCSSProperties, UserOnlineStatus } from '@src/types';
import { MutableRefObject, useCallback, useRef, useState } from 'react';
import RightArrowIcon from '@assets/right-arrow-fill-icon.png';

const arrowStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${RightArrowIcon})`,
};

function UserDropdown({
  username,
  userImg,
  userOnlineStatus,
  userButtonRef,
  onChangeOnlineStatus,
  onClose,
}: {
  username: string;
  userImg: string;
  userOnlineStatus: UserOnlineStatus;
  userButtonRef: MutableRefObject<HTMLElement | null>;
  onChangeOnlineStatus: (nextStatus: UserOnlineStatus) => void;
  onClose: () => void;
}) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(onClose, dropdownRef, userButtonRef);

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusButtonRef = useRef<HTMLButtonElement | null>(null);
  const handleToggleOpenStatusDropdown = useCallback(() => {
    setIsStatusDropdownOpen(
      (prevStatusDropdownOpen) => !prevStatusDropdownOpen,
    );
  }, []);
  const handleCloseStatusDropdown = useCallback(() => {
    setIsStatusDropdownOpen(false);
  }, []);

  return (
    <div
      className="absolute left-0 top-0 z-10 w-56 -translate-y-full rounded-md bg-gray-800"
      ref={dropdownRef}
    >
      <div className="px-3 py-3">
        <div className="mb-3 flex items-center gap-4">
          <div className="aspect-square h-16 w-16 shrink-0 grow-0">
            <UserProfileImage
              image={userImg}
              isStatusShown
              onlineStatus={userOnlineStatus}
            />
          </div>
          <span>{username}</span>
        </div>
        <div className="relative w-full">
          <button
            type="button"
            ref={statusButtonRef}
            className="group flex w-full items-center justify-between rounded-md px-2 py-1 hover:bg-gray-600"
            onClick={handleToggleOpenStatusDropdown}
          >
            {statusOptionList.find(
              (status) => status.value === userOnlineStatus,
            )?.label ?? ''}
            {undefined}
            <div
              className="alpha-mask aspect-square h-4 w-4 shrink-0 grow-0 bg-gray-400 group-hover:bg-gray-300"
              style={arrowStyle}
            />
          </button>
          {isStatusDropdownOpen && (
            <OnlineStatusDropdown
              currentStatus={userOnlineStatus}
              onChangeStatus={onChangeOnlineStatus}
              parentButtonRef={statusButtonRef}
              onClose={handleCloseStatusDropdown}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDropdown;
