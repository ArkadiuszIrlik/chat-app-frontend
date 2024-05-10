import { Link } from 'react-router-dom';
import ServersIcon from '@assets/servers-icon.png';
import ChatsIcon from '@assets/chats-icon.png';
import { ExtendedCSSProperties } from '@src/types';

const serversStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${ServersIcon})`,
};
const chatsStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${ChatsIcon})`,
};

const isActive = false;

function DesktopNavBar({
  isServersMenuOpen,
  onOpenServers,
}: {
  isServersMenuOpen: boolean;
  onOpenServers: () => void;
}) {
  return (
    <div className="border-t-2 border-t-gray-500 pt-1">
      <div>
        <button
          type="button"
          className={`group mb-1 flex w-full items-center gap-2 truncate rounded-md px-2 py-1 ${
            isServersMenuOpen
              ? 'bg-gray-600 hover:bg-gray-500'
              : 'hover:bg-gray-600'
          }`}
          onClick={onOpenServers}
        >
          <div
            className={`alpha-mask ${
              isServersMenuOpen
                ? 'bg-gradient-to-tr from-clairvoyant-900 to-cerise-600'
                : 'bg-gray-400'
            } h-6 w-6  `}
            style={serversStyles}
          />
          <h5
            className={`${isServersMenuOpen ? 'text-white' : 'text-gray-300'}`}
          >
            Servers
          </h5>
        </button>
        <Link
          to="/app/chats"
          className={`group mb-1 flex w-full items-center gap-2 truncate rounded-md px-2 py-1 ${
            isActive ? 'bg-gray-600 hover:bg-gray-500' : 'hover:bg-gray-600'
          }`}
        >
          <div
            className={`alpha-mask ${
              isActive ? ' group-hover:bg-gray-300' : 'bg-gray-400'
            } h-6 w-6 bg-gray-400 `}
            style={chatsStyles}
          />
          <h5 className={`${isActive ? 'text-white' : 'text-gray-300'}`}>
            Chats
          </h5>
        </Link>
      </div>
    </div>
  );
}
export default DesktopNavBar;
