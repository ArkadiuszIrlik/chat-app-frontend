import { UserProfileImage } from '@components/UserProfileImage';
import { useEffect } from 'react';

function Notification({
  authorName,
  authorImg,
  channelName,
  text,
  onClick,
  onDisplayNotification,
}: {
  authorName: string;
  authorImg: string;
  channelName?: string;
  text: string;
  onClick: () => void;
  onDisplayNotification: () => void;
}) {
  useEffect(() => {
    onDisplayNotification();
  }, [onDisplayNotification]);
  return (
    <div className="fixed bottom-10 right-10 z-30">
      <button
        type="button"
        className="flex h-40 w-64 items-stretch overflow-hidden rounded-lg bg-gray-600 px-5 py-4 shadow-md"
        onClick={onClick}
      >
        <div className="overflow-hidden">
          <div className="mb-3 flex items-center gap-3">
            <div className="aspect-square h-10 w-10 shrink-0 grow-0">
              <UserProfileImage image={authorImg} />
            </div>
            <div className="overflow-hidden">
              <h4 className="truncate font-semibold leading-tight">
                {authorName}
              </h4>
              {channelName && <div className="truncate">(#{channelName})</div>}
            </div>
          </div>
          <div
            className="line-clamp-3 text-left text-gray-100"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
      </button>
    </div>
  );
}

Notification.defaultProps = {
  channelName: '',
};
export default Notification;
