import ServersIcon from '@assets/servers-icon.png';
import { ExtendedCSSProperties } from '@src/types';

const serversStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${ServersIcon})`,
};


function DesktopNavBar({
  isServersMenuOpen,
  onOpenServers,
  onCloseServers,
}: {
  isServersMenuOpen: boolean;
  onOpenServers: () => void;
  onCloseServers: () => unknown;
}) {
  return (
    <div className="mb-1 border-t-2 border-t-gray-500 pt-1">
      <div>
        <button
          type="button"
          className={`group mb-1 flex w-full items-center gap-2 truncate
            rounded-md px-2 py-1 ${
              isServersMenuOpen
                ? 'bg-gray-600 using-mouse:hover:bg-gray-500'
                : 'using-mouse:hover:bg-gray-600'
            }`}
          onClick={() => {
            if (isServersMenuOpen) {
              onCloseServers();
            } else {
              onOpenServers();
            }
          }}
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
      </div>
    </div>
  );
}
export default DesktopNavBar;
