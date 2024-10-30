import { useLocation, useNavigate } from 'react-router-dom';
import CategoryList from '@containers/SettingsScreen/CategoryList';
import { useCallback, useState } from 'react';
import { SettingsKey, useSettings } from '@hooks/index';
import SettingControl from '@containers/SettingsScreen/SettingControl';
import { CloseButton } from '@components/CloseButton';
import { useMediaQuery } from '@uidotdev/usehooks';
import styleConsts from '@constants/styleConsts';
import { SwipeNavigation } from '@components/SwipeNavigation';

enum SettingsCategories {
  General = 'GENERAL',
  Audio = 'AUDIO',
}

const settingCategoriesMap: Record<SettingsCategories, SettingsKey[]> = {
  [SettingsCategories.General]: [
    'ENABLE_NOTIFICATION_SOUND',
    'NOTIFICATION_SOUND_VOLUME',
    'ENABLE_VIBRATION',
  ],
  [SettingsCategories.Audio]: [
    'ENABLE_NOTIFICATION_SOUND',
    'NOTIFICATION_SOUND_VOLUME',
  ],
};

const settingsCategories = [
  {
    id: SettingsCategories.General,
    uiName: 'General',
  },
  {
    id: SettingsCategories.Audio,
    uiName: 'Audio',
  },
];

function SettingsScreen() {
  const { settings, updateSettingValue } = useSettings() ?? {};

  const navigate = useNavigate();
  const location = useLocation() as { state?: { returnTo?: string } };

  const handleCloseSettings = useCallback(() => {
    if (location?.state?.returnTo) {
      navigate(location.state.returnTo);
    } else {
      navigate('/app');
    }
  }, [location, navigate]);

  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const handleSwitchActiveCategory = useCallback((nextIndex: number) => {
    setActiveCategoryIndex(nextIndex);
  }, []);

  const activeCategory = settingsCategories[activeCategoryIndex];
  const settingsOnCurrentPage = settingCategoriesMap[activeCategory.id];

  const isExtraSmallScreen = useMediaQuery(
    `only screen and (min-width: ${styleConsts.screens.xs}`,
  );
  return isExtraSmallScreen ? (
    <div className="flex grow">
      <div className="w-52 bg-gray-700 px-2 py-2">
        <h1 className="mb-2 text-xl text-gray-200">Settings</h1>
        <CategoryList
          categories={settingsCategories.map((category) => category.uiName)}
          onSwitchActiveCategory={handleSwitchActiveCategory}
          activeCategoryIndex={activeCategoryIndex}
        />
      </div>
      <div className="grow">
        <div className="px-4 py-3">
          <CloseButton
            ariaLabel="Exit settings screen"
            onClose={handleCloseSettings}
          />
        </div>
        <div className="flex flex-col gap-7 px-3 sm:px-10">
          {settingsOnCurrentPage.map((settingKey) => {
            const settingObj = settings?.[settingKey];
            if (!settingObj) {
              return null;
            }
            return (
              <SettingControl
                settingObject={settingObj}
                onChange={(nextValue) => {
                  if (updateSettingValue) {
                    updateSettingValue(settingKey, nextValue);
                  }
                }}
                key={settingKey}
              />
            );
          })}
        </div>
      </div>
    </div>
  ) : (
    <SwipeNavigation
      containerClass="grow"
      columns={[
        {
          content: (
            <div className="flex h-full">
              <div className="grow bg-gray-700 px-2 py-2">
                <h1 className="mb-2 text-xl text-gray-200">Settings</h1>
                <CategoryList
                  categories={settingsCategories.map(
                    (category) => category.uiName,
                  )}
                  onSwitchActiveCategory={handleSwitchActiveCategory}
                  activeCategoryIndex={activeCategoryIndex}
                />
              </div>
            </div>
          ),
          className: 'w-2/3',
        },
        {
          content: (
            <div className="flex min-h-dvh grow">
              <div className="grow">
                <div className="space-between mb-2 flex items-center px-4 py-3">
                  <h2 className="text-xl text-gray-300">
                    {activeCategory.uiName}
                  </h2>
                  <CloseButton
                    ariaLabel="Exit settings screen"
                    onClose={handleCloseSettings}
                  />
                </div>
                <div className="flex flex-col gap-7 px-4">
                  {settingsOnCurrentPage.map((settingKey) => {
                    const settingObj = settings?.[settingKey];
                    if (!settingObj) {
                      return null;
                    }
                    return (
                      <SettingControl
                        settingObject={settingObj}
                        onChange={(nextValue) => {
                          if (updateSettingValue) {
                            updateSettingValue(settingKey, nextValue);
                          }
                        }}
                        key={settingKey}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ),
          main: true,
        },
      ]}
    />
  );
}
export default SettingsScreen;
