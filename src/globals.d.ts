interface OtherUserNoStatus {
  _id: string;
  username: string;
  profileImg: string;
}

interface OtherUser extends OtherUserNoStatus {
  onlineStatus: UserOnlineStatus;
}
interface BackendError {
  message: string;
}
