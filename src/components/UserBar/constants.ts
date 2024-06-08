import { UserOnlineStatus } from '@src/types';

const statusOptionList = [
  {
    label: 'Online',
    value: UserOnlineStatus.Online,
    bgClass: 'bg-status-online',
  },
  { label: 'Away', value: UserOnlineStatus.Away, bgClass: 'bg-status-away' },
  {
    label: 'Do Not Disturb',
    value: UserOnlineStatus.DoNotDisturb,
    bgClass: 'bg-status-do-not-disturb',
  },
  {
    label: 'Invisible',
    value: UserOnlineStatus.Offline,
    bgClass: 'bg-status-offline',
  },
];

export default statusOptionList;
