import { UserOnlineStatus } from '@src/types';

type Props = { image: string } & (
  | {
      isStatusShown?: true;
      onlineStatus: UserOnlineStatus;
    }
  | {
      isStatusShown?: false;
      onlineStatus?: never;
    }
);

function UserProfileImage({
  image,
  isStatusShown = false,
  onlineStatus,
}: Props) {
  let statusColorClass = '';
  if (isStatusShown) {
    switch (onlineStatus) {
      case UserOnlineStatus.Online:
        statusColorClass = 'bg-status-online';
        break;
      case UserOnlineStatus.Away:
        statusColorClass = 'bg-status-away';
        break;
      case UserOnlineStatus.DoNotDisturb:
        statusColorClass = 'bg-status-do-not-disturb';
        break;
      case UserOnlineStatus.Offline:
      default:
        statusColorClass = 'bg-status-offline';
    }
  }
  return (
    <div className="relative z-0 aspect-square w-full">
      {isStatusShown && (
        // <div
        //   className={`absolute bottom-0 right-0 aspect-square h-3 w-3 rounded-full ${statusColorClass}`}
        // />
        <div
          className={`absolute bottom-0 right-0 aspect-square w-[30%] max-w-4 rounded-full ${statusColorClass}`}
        />
      )}
      <div className="profile-img-overlay">
        <img
          src={image}
          alt=""
          className="relative -z-10 aspect-square w-full rounded-full object-cover object-center"
        />
      </div>
    </div>
  );
}

export default UserProfileImage;
