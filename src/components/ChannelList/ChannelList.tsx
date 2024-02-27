import { useCallback, useState } from 'react';
import ChannelCategorySection from '@components/ChannelList/ChannelCategorySection';

export interface Channel {
  id: string;
  type: 'text' | 'voice';
  name: string;
}

export interface ChannelCategory {
  id: string;
  name: string;
  channels: Channel[];
}

function ChannelList({
  channelCategories,
  serverName,
}: {
  channelCategories: ChannelCategory[];
  serverName: string;
}) {
  const [activeChannelId, setActiveChannelId] = useState('');

  const handleChangeActiveChannel = useCallback(
    (channelId: string) => {
      setActiveChannelId(channelId);
    },
    [setActiveChannelId],
  );
  return (
    <div className="w-52 bg-gray-700 px-2 py-2">
      <h2 className="mb-2 text-xl">{serverName}</h2>
      {channelCategories.map((category) => (
        <ChannelCategorySection
          name={category.name}
          activeChannelId={activeChannelId}
          channelList={category.channels}
          onChangeActiveChannel={handleChangeActiveChannel}
        />
      ))}
    </div>
  );
}
export default ChannelList;
