import { useState } from 'react';
import { Channel } from '@components/ChannelList';
import ChannelButton from '@components/ChannelList/ChannelButton';

function ChannelCategorySection({
  name,
  channelList,
  activeChannelId,
  onChangeActiveChannel,
}: {
  name: string;
  channelList: Channel[];
  activeChannelId: string;
  onChangeActiveChannel: (channelId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  function handleExpandCategory() {
    setIsExpanded(!isExpanded);
  }
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <h4 className="text-gray-300">{name}</h4>
        <button type="button" aria-label={name} onClick={handleExpandCategory}>
          <div
            className={`down-arrow-mask h-4 w-4 bg-gray-400 ${
              isExpanded ? 'rotate-0' : 'rotate-180'
            } transition-all duration-200 ease-in-out`}
          />
        </button>
      </div>
      {isExpanded &&
        channelList.map((channel) => {
          const isActive = channel.id === activeChannelId;
          return (
            <ChannelButton
              name={channel.name}
              isActive={isActive}
              onClick={() => onChangeActiveChannel(channel.id)}
              type={channel.type}
              key={channel.id}
            />
          );
        })}
    </div>
  );
}

export default ChannelCategorySection;
