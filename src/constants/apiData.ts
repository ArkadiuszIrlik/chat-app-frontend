import { getClientURL } from '@helpers/fetch';

const serverInviteRegex = /(?:invite\/)([a-zA-Z0-9]{10})$|^([a-zA-Z0-9]{10})$/;
const exampleServerInviteLink = getClientURL('app/invite/M0DQ26NLE7');
// human-readable string listing the allowed formats
const SUPPORTED_PROFILE_IMG_FORMATS_HUMAN = '.jpg, .png, .webp, .svg, .avif';
const SUPPORTED_PROFILE_IMG_MIME_TYPES = [
  'image/jpeg',
  'image/avif',
  'image/svg+xml',
  'image/png',
  'image/webp',
];
const SUPPORTED_SERVER_IMG_FORMATS_HUMAN = SUPPORTED_PROFILE_IMG_FORMATS_HUMAN;
const SUPPORTED_SERVER_IMG_MIME_TYPES = SUPPORTED_PROFILE_IMG_MIME_TYPES;

export {
  serverInviteRegex,
  exampleServerInviteLink,
  SUPPORTED_PROFILE_IMG_FORMATS_HUMAN,
  SUPPORTED_PROFILE_IMG_MIME_TYPES,
  SUPPORTED_SERVER_IMG_FORMATS_HUMAN,
  SUPPORTED_SERVER_IMG_MIME_TYPES,
};
