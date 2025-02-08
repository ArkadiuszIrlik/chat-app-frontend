import { useAuth } from '@hooks/index';
import SettingsIcon from '@assets/settings-icon.png';
import { Link, useLocation } from 'react-router-dom';
import { ExtendedCSSProperties, UserOnlineStatus } from '@src/types';
import { UserProfileImage } from '@components/UserProfileImage';
import { useCallback, useRef, useState } from 'react';
import useOnlineStatus from '@components/UserBar/useOnlineStatus';
import UserDropdown from '@components/UserBar/UserDropdown';

function UserBar() {
  const { user } = useAuth() ?? {};
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userButtonRef = useRef<HTMLButtonElement | null>(null);
  const { changeOnlineStatus: changeStatus } = useOnlineStatus();

  const changeOnlineStatus = useCallback(
    (nextStatus: UserOnlineStatus) => {
      void changeStatus(nextStatus);
    },
    [changeStatus],
  );

  const handleToggleOpenUserDropdown = useCallback(() => {
    setIsUserDropdownOpen((prevDropdownOpen) => !prevDropdownOpen);
  }, []);
  const handleCloseUserDropdown = useCallback(() => {
    setIsUserDropdownOpen(false);
  }, []);

  return (
    <div className="relative flex items-center gap-1">
      <button
        className={`flex min-w-0 items-center gap-2 rounded-md p-1 using-mouse:hover:bg-gray-600 ${
          isUserDropdownOpen ? 'bg-gray-600' : ''
        }`}
        type="button"
        ref={userButtonRef}
        onClick={handleToggleOpenUserDropdown}
      >
        <div className="aspect-square h-10 w-10 shrink-0 grow-0">
          <UserProfileImage
            image={user?.profileImg ?? ''}
            isStatusShown
            onlineStatus={user?.onlineStatus ?? UserOnlineStatus.Offline}
          />
        </div>
        <span className="truncate">{user?.username}</span>
      </button>
      {isUserDropdownOpen && (
        <UserDropdown
          username={user?.username ?? ''}
          userImg={user?.profileImg ?? ''}
          userOnlineStatus={user?.onlineStatus ?? UserOnlineStatus.Offline}
          userButtonRef={userButtonRef}
          onChangeOnlineStatus={changeOnlineStatus}
          onClose={handleCloseUserDropdown}
        />
      )}
      <SettingsLink />
    </div>
  );
}

const styleObj: ExtendedCSSProperties = {
  '--mask-url': `url(${SettingsIcon})`,
};

function SettingsLink() {
  const location = useLocation();

  return (
    <Link
      to="/app/settings"
      className="group ml-auto shrink-0 rounded-lg p-1
       using-mouse:hover:bg-gray-600"
      state={{ returnTo: location.pathname }}
    >
      <div
        className="alpha-mask aspect-square h-5 w-5 bg-gray-400
         using-mouse:group-hover:bg-gray-300"
        style={styleObj}
      />
    </Link>
  );
}

export default UserBar;
