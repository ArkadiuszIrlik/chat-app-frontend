interface User {
  username: string;
  userImg: string;
  isOnline: boolean;
}

function UserCard({
  username,
  userImg,
  isOnline,
}: {
  username: string;
  userImg: string;
  isOnline: boolean;
}) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <img src={userImg} alt="" className="h-8 w-8 rounded-full" />
      <div className={`${isOnline ? '' : 'text-gray-300'}`}>{username}</div>
    </div>
  );
}

function UserList({ userList }: { userList: User[] }) {
  const onlineUsers: User[] = [];
  const offlineUsers: User[] = [];
  userList.forEach((user) => {
    if (user.isOnline) {
      onlineUsers.push(user);
    } else {
      offlineUsers.push(user);
    }
  });
  return (
    <div className="bg-gray-700 px-3 py-2">
      <div className="flex flex-col">
        {onlineUsers.length > 0 && (
          <div className="mb-1">
            <h3 className="mb-1">Online - {onlineUsers.length}</h3>
            {onlineUsers.map((user) => (
              <UserCard
                username={user.username}
                userImg={user.userImg}
                isOnline
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
                userImg={user.userImg}
                isOnline={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default UserList;
