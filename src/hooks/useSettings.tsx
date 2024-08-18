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

interface BaseSettingProperties {
  uiName: string;
  version: number;
}
type SettingObject = BaseSettingProperties &
  (
    | { type: SettingTypes.Check; value: boolean }
    | { type: SettingTypes.Range; value: number }
  );

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

const nextSettings = { ...defaultSettings };

function useSettings() {
  const [settings, setSettings] = useState(nextSettings);
  const debouncedSettings = useDebounce(settings, 500);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsedLocalSettings = JSON.parse(
      localStorage.getItem('userPreferences') ?? '{}',
    );

    // typescript struggles to correctly narrow types without performing
    // expensive and excessive type checks, hence the need for type
    // assertions and ignoring eslint rules. Regardless of that, the
    // code performs all the checks necessary to ensure type safety
    if (typeof parsedLocalSettings === 'object') {
      Object.entries(parsedLocalSettings as object).forEach(([key, v]) => {
        const nextSettingObject = nextSettings[key as SettingsKey] as
          | SettingObject
          | undefined;
        if (nextSettingObject) {
          if (typeof v === 'object' && 'version' in v && 'value' in v) {
            v as object;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (v.version === nextSettingObject.version) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              if (typeof v.value === typeof nextSettingObject.value)
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                nextSettingObject.value = v.value;
            }
          }
        }
      });
    }
  }, []);

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
