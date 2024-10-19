import ChannelGroupSection from '@components/ChannelList/ChannelGroupSection';
import SettingsIcon from '@assets/settings-icon.png';
import { ExtendedCSSProperties } from '@src/types';
import { useCallback, useRef, useState } from 'react';
import ServerSettingsDropdown from '@components/ChannelList/ServerSettingsDropdown';

const settingsStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${SettingsIcon})`,
};

function ChannelList({
  channelCategories = [],
  serverName,
  server,
}: {
  channelCategories: Server['channelCategories'];
  serverName: string;
  server: Server;
}) {
  const serverHeaderDropdown = useRef<HTMLDivElement | null>(null);
  const [isServerDropdownOpen, setIsServerDropdownOpen] = useState(false);
  const handleToggleServerDropdownOpen = useCallback(() => {
    setIsServerDropdownOpen((isdo) => !isdo);
  }, []);
  const handleCloseServerDropdown = useCallback(() => {
    setIsServerDropdownOpen(false);
  }, []);
  return (
    <div className="flex min-h-0 w-full flex-col">
      <div className="relative">
        <div
          className="group relative mb-2 flex overflow-clip rounded-md p-1 hover:bg-gray-600"
          ref={serverHeaderDropdown}
        >
          <div
            className="absolute right-1 hidden aspect-square h-7 w-7
           items-center justify-center bg-gray-600 group-hover:flex"
          >
            <div
              aria-hidden
              className="absolute right-full hidden h-10 w-3 items-center
           justify-center bg-gradient-to-r from-gray-600/0 
           to-gray-600 group-hover:flex"
            />
            <button
              type="button"
              onClick={handleToggleServerDropdownOpen}
              aria-label={`${
                isServerDropdownOpen ? 'Close' : 'Open'
              } server settings dropdown`}
              style={settingsStyle}
              className="alpha-mask aspect-square h-5 w-5 bg-gray-400 hover:bg-gray-300"
            />
          </div>
        </div>
        {isServerDropdownOpen && (
          <ServerSettingsDropdown
            server={server}
            parentButtonRef={serverHeaderDropdown}
            onClose={handleCloseServerDropdown}
          />
        )}
      </div>
      <div className="overflow-y-auto overflow-x-hidden overscroll-y-contain">
        {channelCategories.map((category) => (
          <ChannelGroupSection
            name={category.name}
            server={server}
            category={category}
            channelList={category.channels}
            key={category._id}
          />
        ))}
      </div>
    </div>
  );
}
export default ChannelList;
