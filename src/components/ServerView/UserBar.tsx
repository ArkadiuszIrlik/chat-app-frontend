import { useAuth } from '@hooks/index';
import SettingsIcon from '@assets/settings-icon.png';
import { Link } from 'react-router-dom';
import ExtendedCSSProperties from '@src/types';

function UserBar() {
  const { user } = useAuth()!;
  return (
    <div className="mt-auto">
      <div className="flex items-center gap-2 px-1">
        <div className="relative z-0 shrink-0">
          <div className="absolute bottom-0 right-0 aspect-square h-3 w-3 rounded-full bg-green-500" />
          <div className="relative rounded-full shadow-[inset_0_2px_4px_0_rgba(217,217,217,0.25)]">
            <img
              src={user?.profileImg}
              alt=""
              className="relative -z-10 aspect-square h-10 w-10 rounded-full"
            />
          </div>
        </div>
        <span className="truncate">{user?.name}</span>
        <SettingsLink />
      </div>
    </div>
  );
}

function SettingsLink() {
  const styleObj: ExtendedCSSProperties = {
    '--mask-url': `url(${SettingsIcon})`,
  };

  return (
    <Link to="/app/settings" className="ml-auto shrink-0">
      <div
        className="alpha-mask aspect-square h-5 w-5 bg-gray-400 hover:bg-gray-300"
        style={styleObj}
      />
    </Link>
  );
}
export default UserBar;
