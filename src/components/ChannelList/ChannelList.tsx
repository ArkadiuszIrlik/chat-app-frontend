import ChannelCategorySection from '@components/ChannelList/ChannelCategorySection';

function ChannelList({
  channelCategories = [],
  serverName,
}: {
  channelCategories: Server['channelCategories'];
  serverName: string;
}) {
  return (
    <div className="flex w-full flex-col">
      <h2 className="mb-2 text-xl">{serverName}</h2>
      {channelCategories.map((category) => (
        <ChannelCategorySection
          name={category.name}
          channelList={category.channels}
          key={category._id}
        />
      ))}
    </div>
  );
}
export default ChannelList;
