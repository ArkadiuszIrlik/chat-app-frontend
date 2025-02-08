type Message = {
  postedAt: Date;
  author: {
    _id: string;
    username: string;
    profileImg: string;
  };
  text: string;
  serverId?: string;
  chatId: string;
} & ({ _id: string; clientId?: string } | { clientId: string; _id?: string });

type NetworkMessage = Omit<Message, 'postedAt'> & {
  postedAt: string;
} & ({ _id: string; clientId?: string } | { _id?: string; clientId: string });

interface User {
  _id: string;
  email: string;
  password: string;
  username: string;
  profileImg: string;
  onlineStatus: UserOnlineStatus;
  serversIn: string[];
  chatsIn: { userId: string; chatId: string }[];
  friends: string[];
  refreshTokens: { token: string; expDate: Date }[];
}

interface OtherUserNoStatus {
  _id: string;
  username: string;
  profileImg: string;
}

interface OtherUser extends OtherUserNoStatus {
  onlineStatus: UserOnlineStatus;
}

interface Server {
  _id: string;
  serverImg: string;
  name: string;
  ownerId: string;
  members: OtherUserNoStatus[];
  channelCategories: ChannelCategory[];
  socketId: string;
}

interface ChannelCategory {
  _id: string;
  name: string;
  channels: Channel[];
}

interface Channel {
  _id: string;
  socketId: string;
  name: string;
  type: 'voice' | 'text';
  messagesId: string;
}

interface BackendError {
  message: string;
}
