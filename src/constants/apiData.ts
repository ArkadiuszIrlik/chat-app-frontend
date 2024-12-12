import { getClientURL } from '@helpers/fetch';

const serverInviteRegex = /(?:invite\/)([a-zA-Z0-9]{10})$|^([a-zA-Z0-9]{10})$/;
const exampleServerInviteLink = getClientURL('app/invite/M0DQ26NLE7');
const SUPPORTED_PROFILE_IMG_MIME_TYPES = [
  'image/jpeg',
  'image/avif',
  'image/svg+xml',
  'image/png',
  'image/webp',
];

export {
  serverInviteRegex,
  exampleServerInviteLink,
  SUPPORTED_PROFILE_IMG_MIME_TYPES,
};
