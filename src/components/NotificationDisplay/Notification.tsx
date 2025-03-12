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
    <div
      className="fixed left-2 right-2 top-10 z-30 xs:left-auto sm:bottom-10
     sm:left-auto sm:right-10 sm:top-auto"
    >
      <button
        type="button"
        className="flex max-h-32 w-full items-stretch overflow-hidden
        rounded-lg bg-gray-600 px-5 py-4 shadow-md xs:w-64 sm:h-40 sm:max-h-none sm:w-64"
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
            className="line-clamp-2 text-left text-gray-100 sm:line-clamp-3"
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
