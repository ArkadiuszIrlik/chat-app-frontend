// Needs to be "type" instead of "interface" to be compatible with Record type
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type ServerSettingsValues = {
  name: string;
  serverImg: string;
};

export { type ServerSettingsValues };
