import SettingTypes from '@hooks/useSettings.types';
import { useDebounce } from '@uidotdev/usehooks';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const defaultSettings = {
  ENABLE_NOTIFICATION_SOUND: {
    type: SettingTypes.Check as const,
    value: false,
    uiName: 'Enable notification sound',
    version: 0,
  },
  NOTIFICATION_SOUND_VOLUME: {
    type: SettingTypes.Range as const,
    value: 50,
    uiName: 'Notification sound volume',
    version: 0,
  },
};

export type SettingsKey = keyof typeof defaultSettings;
export type Settings = typeof defaultSettings;

function isPlainObject(obj: unknown): obj is Record<PropertyKey, unknown> {
  return typeof obj === 'object' && !Array.isArray(obj) && obj !== null;
}

function useSettings() {
  const [settings, setSettings] = useState(getUserSettings());
  const debouncedSettings = useDebounce(settings, 500);

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(debouncedSettings));
  }, [debouncedSettings]);

  const updateSettingValue = useCallback(
    (settingKey: SettingsKey, nextValue: number | boolean) => {
      setSettings((stng) => {
        const currentSetting = stng[settingKey];
        if (currentSetting) {
          const expectedType = currentSetting.type;
          switch (expectedType) {
            case SettingTypes.Check: {
              if (typeof nextValue !== 'boolean') {
                return stng;
              }
              return {
                ...stng,
                [settingKey]: { ...currentSetting, value: nextValue },
              };
            }
            case SettingTypes.Range: {
              if (typeof nextValue !== 'number') {
                return stng;
              }
              return {
                ...stng,
                [settingKey]: { ...currentSetting, value: nextValue },
              };
            }
            default:
              return stng;
          }
        }
        return stng;
      });
    },
    [],
  );

  return { settings, updateSettingValue };
}

const SettingsContext = createContext<ReturnType<typeof useSettings> | null>(
  null,
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const settings = useSettings();
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

function SettingsConsumer() {
  return useContext(SettingsContext);
}

export default SettingsConsumer;

function getUserSettings() {
  const nextSettings = Object.fromEntries(
    Object.entries(defaultSettings),
  ) as Settings;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const parsedLocalSettings = JSON.parse(
    localStorage.getItem('userPreferences') ?? '{}',
  );

  if (isPlainObject(parsedLocalSettings)) {
    Object.entries(nextSettings).forEach(([settingKey, currentSetting]) => {
      const localStoreSetting = parsedLocalSettings[settingKey];
      if (isPlainObject(localStoreSetting)) {
        if (localStoreSetting.version === currentSetting.version) {
          if (typeof localStoreSetting.value === typeof currentSetting.value) {
            // @ts-expect-error Type check done above
            // eslint-disable-next-line no-param-reassign
            currentSetting.value = localStoreSetting.value;
          }
        }
      }
    });
  }

  return nextSettings;
}
