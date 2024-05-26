import { getClientURL } from '@helpers/index';
import Yup from '@src/extendedYup';

const channelSchema = {
  name: Yup.string()
    .trim()
    .max(30, "Channel name can't be longer than 30 characters."),
  // .required('Please enter a channel name'),
};

const channelGroupSchema = {
  name: Yup.string()
    .trim()
    .max(25, "Channel group name can't be longer than 25 characters."),
};

const serverSchema = {
  name: Yup.string().trim(),
  // .required('Please enter a name for your server.'),
  image: Yup.mixed<Blob>()
    // .required('Please provide an image for your server.')
    .test(
      'type',
      'Only the following formats are accepted: .jpeg, .jpg, .svg, and .png',
      (value) =>
        value &&
        (value.type === 'image/jpeg' ||
          value.type === 'image/jpg' ||
          value.type === 'image/svg' ||
          value.type === 'image/png'),
    )
    .test(
      'fileSize',
      'Maximum file size is 2MB.',
      (value) => value && value.size <= 2 * 1024 * 1024,
    ),
};

const exampleServerInviteLink = getClientURL('?invite=M0DQ26NLET4');

const serverInviteSchema = {
  invite: Yup.string()
    .trim()
    .matches(
      /(?:\?invite=)([a-zA-Z0-9]{12})$|^([a-zA-Z0-9]{12})$/g,
      `Please enter a valid invite in the format: ${exampleServerInviteLink}`,
    ),
  // .required('Please enter an invite link or code.'),
};

const userSchema = {
  email: Yup.string().trim().email('Invalid email address.'),
  // .required('Please enter your email.'),
  password: Yup.string()
    .min(8, 'Password has to be at least 8 characters long.')
    .max(100, "Password can't be longer than 100 characters."),
  // .required('Please enter your password.'),
};

export {
  channelSchema,
  channelGroupSchema,
  serverSchema,
  serverInviteSchema,
  userSchema,
};
