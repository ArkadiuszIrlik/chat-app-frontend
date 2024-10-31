import { useNavigate } from 'react-router-dom';
import TextChannelIcon from '@assets/text-channel-icon.png';
import VoiceChannelIcon from '@assets/voice-channel-icon.png';
import SettingsIcon from '@assets/settings-icon.png';
import { ExtendedCSSProperties } from '@src/types';
import {
  MouseEvent,
  TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLongPress } from '@uidotdev/usehooks';
import useLongPressVibration from '@components/ChannelButton/useLongPressVibration';
import LongPressSwipeCancel from '@components/ChannelButton/LongPressSwipeCancel';
import styleConsts from '@constants/styleConsts';
import {
  PressRippleEffect,
  usePressRippleEffect,
} from '@components/PressRippleEffect';
import ChannelPanelModal from '@components/ChannelButton/ChannelPanelModal';

const textChannelStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${TextChannelIcon})`,
};

const voiceChannelStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${VoiceChannelIcon})`,
};

const settingsStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${SettingsIcon})`,
};

function ChannelButton({
  type,
  isActive,
  name,
  relUrl,
  server,
  channel,
}: {
  type: 'voice' | 'text';
  isActive: boolean;
  name: string;
  relUrl: string;
  server: Server;
  channel: Channel;
}) {
  const navigate = useNavigate();
  const buttonContainerRef = useRef<null | HTMLDivElement>(null);
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

  const {
    isChannelPanelOpen,
    openChannelPanel,
    closeChannelPanel,
    toggleChannelPanel,
  } = useChannelPanel();

  const [isPressing, setIsPressing] = useState(false);
  const [hasFinishedLongPress, setHasFinishedLongPress] = useState(false);

  const handleShortPressClick = useCallback(() => {
    navigate(relUrl);
  }, [navigate, relUrl]);

  const handleShortPressClickPointer = useCallback(() => {
    // prevents scrolling over buttons from counting as clicks
    if (isPressing) {
      handleShortPressClick();
    }
  }, [isPressing, handleShortPressClick]);

  function handleCancelLongPress() {
    handleTouchEnd();
    setIsPressing(false);
  }

  const handleFinishLongPress = useCallback(() => {
    handleTouchEnd();
    if (shouldVibrationPlay) {
      handlePlayVibration();
    }
    openChannelPanel();

    setIsPressing(false);
    setHasFinishedLongPress(false);
  }, [
    handleTouchEnd,
    handlePlayVibration,
    shouldVibrationPlay,
    openChannelPanel,
  ]);

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
          handleShortPressClickPointer();
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

  return (
    <div
      ref={buttonContainerRef}
      className={`group relative z-0 mb-1 flex w-full items-center gap-1 overflow-hidden rounded-md px-2 py-1 ${
        isActive
          ? 'bg-gray-600 using-mouse:hover:bg-gray-500'
          : 'using-mouse:hover:bg-gray-600'
      }`}
    >
      <PressRippleEffect attributes={rippleAttrs} />
      {isPressing && (
        <LongPressSwipeCancel onCancel={() => handleCancelLongPress()} />
      )}
      <button
        type="button"
        aria-label={`Move to ${name} channel`}
        // onClick doesnt get called here with touch events
        // because of long-press right-click emulation
        onClick={handleShortPressClick}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...longPressAttrs}
        className="flex grow items-center gap-1 truncate"
      >
        <div
          style={type === 'text' ? textChannelStyle : voiceChannelStyle}
          className={`${
            isActive ? 'using-mouse:group-hover:bg-gray-300' : 'bg-gray-400'
          } alpha-mask aspect-square h-6 w-6 shrink-0 grow-0 bg-gray-400`}
        />
        <h5
          className={`${
            isActive ? 'text-white' : 'text-gray-300'
          } select-none truncate`}
          title={name}
        >
          {name}
        </h5>
      </button>
      <ChannelPanelButton
        isPanelOpen={isChannelPanelOpen}
        isActive={isActive}
        onClick={toggleChannelPanel}
      />
      <ChannelPanelModal
        isOpen={isChannelPanelOpen}
        server={server}
        channel={channel}
        channelName={name}
        channelType={type}
        onCloseModal={closeChannelPanel}
      />
    </div>
  );
}

function ChannelPanelButton({
  isPanelOpen,
  isActive,
  onClick,
}: {
  isPanelOpen: boolean;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${isPanelOpen ? 'Close' : 'Open'} channel panel`}
      className="group/{settings} sr-only flex aspect-square h-4 
      w-4 items-center justify-center rounded-md outline-offset-4
      focus-visible:not-sr-only using-mouse:hover:bg-gray-600 
      using-mouse:group-hover:not-sr-only"
    >
      <div
        style={settingsStyle}
        className={`alpha-mask aspect-square h-4 w-4
         ${
           isActive
             ? 'bg-gray-300 using-mouse:group-hover/{settings}:bg-gray-200'
             : 'bg-gray-400 using-mouse:group-hover/{settings}:bg-gray-300'
         }`}
      />
    </button>
  );
}

function useChannelPanel() {
  const [isChannelPanelOpen, setIsChannelPanelOpen] = useState(false);

  const openChannelPanel = useCallback(() => {
    setIsChannelPanelOpen(true);
  }, []);

  const closeChannelPanel = useCallback(() => {
    setIsChannelPanelOpen(false);
  }, []);

  const toggleChannelPanel = useCallback(() => {
    setIsChannelPanelOpen((prevIsChannelPanelOpen) => !prevIsChannelPanelOpen);
  }, []);

  return {
    isChannelPanelOpen,
    openChannelPanel,
    closeChannelPanel,
    toggleChannelPanel,
  };
}

export default ChannelButton;
