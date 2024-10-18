import { useState } from 'react';
import { useParams } from 'react-router-dom';
import DownArrowIcon from '@assets/down-arrow-fill.png';
import { ExtendedCSSProperties } from '@src/types';
import { ChannelButton } from '@components/ChannelButton';

const downArrowStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${DownArrowIcon})`,
};

function ChannelCategorySection({
  name,
  server,
  channelList,
}: {
  name: string;
  server: Server;
  channelList: Channel[];
}) {
  const { channelId: activeChannelId } = useParams();
  const [isExpanded, setIsExpanded] = useState(true);

  function handleExpandCategory() {
    setIsExpanded(!isExpanded);
  }
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <h4 className="truncate text-gray-300" title={name}>
          {name}
        </h4>
        <button type="button" aria-label={name} onClick={handleExpandCategory}>
          <div
            style={downArrowStyle}
            className={`alpha-mask aspect-square h-4 w-4 shrink-0 grow-0
             bg-gray-400 ${
               isExpanded ? 'rotate-0' : 'rotate-180'
             } transition-all duration-200 ease-in-out`}
          />
        </button>
      </div>
      {isExpanded &&
        channelList.map((channel) => {
          const isActive = channel._id === activeChannelId;
          return (
            <ChannelButton
              name={channel.name}
              isActive={isActive}
              type={channel.type}
              relUrl={channel._id}
              server={server}
              channel={channel}
              key={channel._id}
            />
          );
        })}
    </div>
  );
}

export default ChannelCategorySection;
