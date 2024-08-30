import { UserProfileImage } from '@components/UserProfileImage';
import { useUserList } from '@hooks/index';
import { UserOnlineStatus } from '@src/types';
import { useParams } from 'react-router-dom';

interface PresenceUser {
  _id: string;
  username: string;
  profileImg: string;
  onlineStatus: UserOnlineStatus;
}

function UserCard({
  username,
  userImg,
  onlineStatus = UserOnlineStatus.Offline,
}: {
  username: string;
  userImg: string;
  onlineStatus: UserOnlineStatus;
}) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <div
        className={`aspect-square h-9 w-9 shrink-0 grow-0 ${
          onlineStatus !== UserOnlineStatus.Offline ? '' : 'brightness-75'
        }`}
      >
        <UserProfileImage
          image={userImg}
          isStatusShown
          onlineStatus={onlineStatus}
        />
      </div>
      <div
        className={`${
          onlineStatus === UserOnlineStatus.Offline ? 'text-gray-300' : ''
        } truncate`}
      >
        {username}
      </div>
    </div>
  );
}

function UserList() {
  const { getServerUsers, isLoading: isUserListLoading } = useUserList()!;
  const { serverId } = useParams();
  const userPresenceList = getServerUsers(serverId ?? '');

  const onlineUsers: PresenceUser[] = [];
  const offlineUsers: PresenceUser[] = [];
  userPresenceList.forEach((user) => {
    if (user.onlineStatus === UserOnlineStatus.Offline) {
      offlineUsers.push(user);
    } else {
      onlineUsers.push(user);
    }
  });
  onlineUsers.sort((a, b) => a.username.localeCompare(b.username));
  offlineUsers.sort((a, b) => a.username.localeCompare(b.username));

  return (
    <div className="w-52 bg-gray-700 px-3 py-2">
      {isUserListLoading ? null : (
        <div>
          {onlineUsers.length > 0 && (
            <div className="mb-1">
              <h3 className="mb-1">Online - {onlineUsers.length}</h3>
              {onlineUsers.map((user) => (
                <UserCard
                  username={user.username}
                  userImg={user.profileImg}
                  onlineStatus={user.onlineStatus}
                  key={user._id}
                />
              ))}
            </div>
          )}
          {offlineUsers.length > 0 && (
            <div className="mb-1">
              <h3 className="mb-1">Offline - {offlineUsers.length}</h3>
              {offlineUsers.map((user) => (
                <UserCard
                  username={user.username}
                  userImg={user.profileImg}
                  onlineStatus={user.onlineStatus}
                  key={user._id}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default UserList;
