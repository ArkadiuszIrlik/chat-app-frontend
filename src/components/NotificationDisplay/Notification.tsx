function Notification({
  authorName,
  authorImg,
  channelName,
  text,
  onClick,
}: {
  authorName: string;
  authorImg: string;
  channelName?: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <div className="fixed bottom-10 right-10 z-30">
      <button
        type="button"
        className="h-40 w-64 rounded-lg bg-gray-600 px-5 py-4 shadow-md"
        onClick={onClick}
      >
        <div className="mb-1 flex items-center gap-3">
          <img
            src={authorImg}
            alt=""
            className="aspect-square w-10 rounded-full"
          />
          <div>
            <h4 className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold leading-tight">
              {authorName}
            </h4>
            {channelName && (
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                (#{channelName})
              </div>
            )}
          </div>
        </div>
        <div
          className="line-clamp-3 text-left"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </button>
    </div>
  );
}

Notification.defaultProps = {
  channelName: '',
};
export default Notification;
