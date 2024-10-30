import Checkbox from '@containers/SettingsScreen/Checkbox';
import RangeInput from '@containers/SettingsScreen/RangeInput';
import { Settings } from '@hooks/index';
import SettingTypes from '@hooks/useSettings.types';

type ValueOf<T> = T[keyof T];

function SettingControl({
  settingObject,
  onChange,
}: {
  settingObject: ValueOf<Settings>;
  onChange: (value: number | boolean) => void;
}) {
  const { type, uiName, value } = settingObject;
  switch (true) {
    case type === SettingTypes.Check:
      return (
        <div className="flex flex-wrap items-start gap-x-4 gap-y-1">
          <span className="text-gray-100">{uiName}</span>
          <Checkbox
            checked={value}
            label={uiName}
            onChange={(e) => onChange(e.currentTarget.checked)}
          />
        </div>
      );
    case type === SettingTypes.Range:
      return (
        <div className="flex flex-col items-start">
          <span className="text-gray-100">{uiName}</span>
          <div className="w-full max-w-96">
            <RangeInput
              label={uiName}
              onChange={(e) => onChange(e.currentTarget.valueAsNumber)}
              value={value}
            />
          </div>
        </div>
      );
    default:
      return null;
  }
}
export default SettingControl;
