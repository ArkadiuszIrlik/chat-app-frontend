import { getClientURL } from '@helpers/fetch';

const serverInviteRegex = /(?:invite\/)([a-zA-Z0-9]{10})$|^([a-zA-Z0-9]{10})$/;
const exampleServerInviteLink = getClientURL('app/invite/M0DQ26NLE7');

export { serverInviteRegex, exampleServerInviteLink };
