import {
  statusAwayBg,
  statusDoNotDisturbBg,
  statusOfflineBg,
  statusOnlineBg,
} from '@constants/classes';
import { UserOnlineStatus } from '@src/types';

const statusOptionList = [
  { label: 'Online', value: UserOnlineStatus.Online, bgClass: statusOnlineBg },
  { label: 'Away', value: UserOnlineStatus.Away, bgClass: statusAwayBg },
  {
    label: 'Do Not Disturb',
    value: UserOnlineStatus.DoNotDisturb,
    bgClass: statusDoNotDisturbBg,
  },
  {
    label: 'Invisible',
    value: UserOnlineStatus.Offline,
    bgClass: statusOfflineBg,
  },
];

export default statusOptionList;
