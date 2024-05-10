import { useState } from 'react';
import ChannelLink from '@components/ChannelList/ChannelLink';
import { useParams } from 'react-router-dom';

function ChannelCategorySection({
  name,
  channelList,
}: {
  name: string;
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
          const isActive = channel._id === activeChannelId;
          return (
            <ChannelLink
              name={channel.name}
              isActive={isActive}
              type={channel.type}
              relUrl={channel._id}
              key={channel._id}
            />
          );
        })}
    </div>
  );
}

export default ChannelCategorySection;
