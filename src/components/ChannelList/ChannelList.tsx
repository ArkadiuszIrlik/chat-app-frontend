import ChannelGroupSection from '@components/ChannelList/ChannelGroupSection';
import SettingsIcon from '@assets/settings-icon.png';
import { ExtendedCSSProperties } from '@src/types';
import {
  MouseEvent,
  MutableRefObject,
  TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import useLongPressVibration from '@components/ChannelButton/useLongPressVibration';
import styleConsts from '@constants/styleConsts';
import {
  PressRippleEffect,
  usePressRippleEffect,
} from '@components/PressRippleEffect';
import { useLongPress } from '@uidotdev/usehooks';
import useToggle from '@hooks/useToggle';
import LongPressSwipeCancel from '@components/ChannelButton/LongPressSwipeCancel';
import ServerPanelModal from '@components/ChannelList/ServerPanelModal';

const settingsStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${SettingsIcon})`,
};

function ChannelList({
  channelCategories = [],
  serverName,
  server,
}: {
  channelCategories: Server['channelCategories'];
  serverName: string;
  server: Server;
}) {
  const serverHeaderDropdown = useRef<HTMLDivElement | null>(null);

  const {
    activate: openServerPanel,
    deactivate: closeServerPanel,
    toggle: toggleServerPanel,
    isActive: isServerPanelOpen,
  } = useToggle();

  const { longPressAttrs, rippleAttrs, scrollListenerAttrs, isPressing } =
    useLongPressInteraction({
      buttonContainerRef: serverHeaderDropdown,
      onLongPress: openServerPanel,
    });

  return (
    <div className="flex min-h-0 w-full flex-col">
      <div className="relative">
        <div
          className="group relative z-0 mb-2 flex overflow-clip rounded-md p-1
           using-mouse:hover:bg-gray-600"
          ref={serverHeaderDropdown}
        >
          <PressRippleEffect attributes={rippleAttrs} />
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <LongPressScrollListener {...scrollListenerAttrs} />
          <h2
            className="line-clamp-3 w-full select-none overflow-hidden
           hyphens-auto break-words text-xl"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...longPressAttrs}
          >
            {serverName}
          </h2>
          {!isPressing && (
            <div
              className="pointer-events-none absolute right-1 flex aspect-square h-7
           w-7 touch-none items-center justify-center 
            bg-gray-700 opacity-0 group-focus-within:pointer-events-auto group-focus-within:touch-auto 
           group-focus-visible:bg-gray-600 focus-within:has-[:focus-visible]:opacity-100
            using-mouse:group-hover:pointer-events-auto using-mouse:group-hover:touch-auto
           using-mouse:group-hover:bg-gray-600 using-mouse:group-hover:opacity-100"
            >
              <div
                className="pointer-events-none absolute right-full h-10 w-3
              touch-none items-center justify-center
             bg-gradient-to-r from-gray-700/0  to-gray-700
             group-focus-visible:flex
              using-mouse:group-hover:flex using-mouse:group-hover:from-gray-600/0
               using-mouse:group-hover:to-gray-600"
              />
              <button
                type="button"
                onClick={toggleServerPanel}
                aria-label={`${
                  isServerPanelOpen ? 'Close' : 'Open'
                } server panel`}
                style={settingsStyle}
                className="sr-only relative z-10 rounded-md
               outline-offset-4 focus-visible:not-sr-only
              using-mouse:group-hover:not-sr-only"
              >
                <div
                  className="alpha-mask aspect-square h-5 w-5
                bg-gray-400 using-mouse:hover:bg-gray-300"
                />
              </button>
            </div>
          )}
        </div>
        <ServerPanelModal
          server={server}
          isOpen={isServerPanelOpen}
          onCloseModal={closeServerPanel}
        />
      </div>
      <div className="overflow-y-auto overflow-x-hidden overscroll-y-contain">
        {channelCategories.map((category) => (
          <ChannelGroupSection
            name={category.name}
            server={server}
            category={category}
            channelList={category.channels}
            key={category._id}
          />
        ))}
      </div>
    </div>
  );
}
export default ChannelList;

function useLongPressInteraction({
  buttonContainerRef,
  onLongPress,
}: {
  buttonContainerRef: MutableRefObject<HTMLElement | null>;
  onLongPress: () => void;
}) {
  const { shouldVibrationPlay, handlePlayVibration } = useLongPressVibration();
  const longPressThreshold = 750; // ms
  const rippleAnimationDelay = 200; // ms
  const bgGray500 = styleConsts.colors.gray['500'];
  const {
    attributes: rippleAttrs,
    handleTouchStart,
    handleTouchEnd,
  } = usePressRippleEffect({
    targetContainer: buttonContainerRef.current,
    duration: longPressThreshold - rippleAnimationDelay,
    delay: rippleAnimationDelay,
    autoHeight: true,
    color: bgGray500,
    extraScaleMultiply: 1.05,
  });

  const [isPressing, setIsPressing] = useState(false);
  const [hasFinishedLongPress, setHasFinishedLongPress] = useState(false);

  function handleCancelLongPress() {
    handleTouchEnd();
    setIsPressing(false);
  }

  const handleFinishLongPress = useCallback(() => {
    handleTouchEnd();
    if (shouldVibrationPlay) {
      handlePlayVibration();
    }
    onLongPress();

    setIsPressing(false);
    setHasFinishedLongPress(false);
  }, [handleTouchEnd, handlePlayVibration, shouldVibrationPlay, onLongPress]);

  useEffect(() => {
    if (hasFinishedLongPress && isPressing) {
      handleFinishLongPress();
    }
  }, [hasFinishedLongPress, isPressing, handleFinishLongPress]);

  const longPressAttrs = useLongPress(
    () => {
      // this callback doesn't receive updated state values
      // so the actual logic had to be moved to an external effect
      setHasFinishedLongPress(true);
    },
    {
      threshold: longPressThreshold,
      onStart(e) {
        if (!isPressing) {
          if ('touches' in e) {
            handleTouchStart(e as unknown as TouchEvent);
          } else {
            handleTouchStart(e as unknown as MouseEvent);
          }
          setIsPressing(true);
        }
      },
      onCancel(e) {
        handleCancelLongPress();
        // prevents some OS's opening right-click menu after long press
        if (e.type === 'touchend') {
          e.preventDefault();
        }
      },
      onFinish(e) {
        // prevents some OS's opening right-click menu after long press
        if (e.type === 'touchend') {
          e.preventDefault();
        }
      },
    },
  );

  const scrollListenerAttrs = { isPressing, onCancel: handleCancelLongPress };

  return {
    isPressing,
    rippleAttrs,
    longPressAttrs,
    scrollListenerAttrs,
  };
}

function LongPressScrollListener({
  isPressing,
  onCancel,
}: {
  isPressing: boolean;
  onCancel: () => void;
}) {
  return isPressing ? <LongPressSwipeCancel onCancel={onCancel} /> : null;
}
