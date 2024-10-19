import {
  useCallback,
  useState,
  MouseEvent,
  TouchEvent,
  useEffect,
  useRef,
  MutableRefObject,
} from 'react';
import { useParams } from 'react-router-dom';
import DownArrowIcon from '@assets/down-arrow-fill.png';
import SettingsIcon from '@assets/settings-icon.png';
import { ExtendedCSSProperties } from '@src/types';
import { ChannelButton } from '@components/ChannelButton';
import { useLongPress } from '@uidotdev/usehooks';
import useLongPressVibration from '@components/ChannelButton/useLongPressVibration';
import LongPressSwipeCancel from '@components/ChannelButton/LongPressSwipeCancel';
import styleConsts from '@constants/styleConsts';
import {
  PressRippleEffect,
  usePressRippleEffect,
} from '@components/PressRippleEffect';
import ChannelGroupPanelModal from '@components/ChannelList/ChannelGroupPanelModal';

const downArrowStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${DownArrowIcon})`,
};

const settingsStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${SettingsIcon})`,
};

function ChannelGroupSection({
  name,
  server,
  category,
  channelList,
}: {
  name: string;
  server: Server;
  category: ChannelCategory;
  channelList: Channel[];
}) {
  const { channelId: activeChannelId } = useParams();
  const [isExpanded, setIsExpanded] = useState(true);
  const toggleExpandCategory = useCallback(() => {
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
  }, []);

  const isActiveInCategory = !!channelList.find(
    (channel) => channel._id === activeChannelId,
  );
  const isCollapsedActiveChannel = isActiveInCategory && !isExpanded;

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
    isGroupPanelOpen,
    openGroupPanel,
    closeGroupPanel,
    toggleGroupPanel,
  } = useGroupPanel();

  const [isPressing, setIsPressing] = useState(false);
  const [hasFinishedLongPress, setHasFinishedLongPress] = useState(false);

  const handleShortPressClick = useCallback(() => {
    toggleExpandCategory();
  }, [toggleExpandCategory]);

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
    openGroupPanel();

    setIsPressing(false);
    setHasFinishedLongPress(false);
  }, [
    handleTouchEnd,
    handlePlayVibration,
    shouldVibrationPlay,
    openGroupPanel,
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

  const extraButtonsContainerRef = useRef<HTMLDivElement | null>(null);
  const extraButtonsContainerWidth = useExtraButtonsWidth(
    extraButtonsContainerRef,
  );

  return (
    <div className="mb-4">
      <div
        className="group relative z-0 flex items-center justify-between overflow-hidden
       rounded-md using-mouse:hover:bg-gray-600"
        ref={buttonContainerRef}
      >
        <PressRippleEffect attributes={rippleAttrs} />
        <button
          type="button"
          onClick={handleShortPressClick}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...longPressAttrs}
          className="group mb-1 flex min-h-7 w-full select-none items-center
          justify-between rounded-md"
        >
          {isPressing && (
            <LongPressSwipeCancel onCancel={() => handleCancelLongPress()} />
          )}
          <h4
            className={`truncate ${
              isCollapsedActiveChannel ? 'text-white' : 'text-gray-300'
            }`}
            title={name}
          >
            {name}
          </h4>
          {/* prevents text from going under position: absolute elements */}
          <div
            className="shrink-0"
            style={{
              width: extraButtonsContainerWidth,
            }}
          />
        </button>
        <div
          className="pointer-events-none absolute right-0 flex touch-none items-center"
          ref={extraButtonsContainerRef}
        >
          <div className="pointer-events-auto touch-auto">
            <ChannelGroupPanelButton
              isPanelOpen={isGroupPanelOpen}
              onClick={toggleGroupPanel}
            />
          </div>
          <div className="group/{expand} pointer-events-none touch-none rounded-md p-1 using-mouse:hover:bg-gray-600 ">
            <div
              style={downArrowStyle}
              className={`alpha-mask aspect-square h-4 w-4 shrink-0 grow-0
                 bg-gray-400 using-mouse:group-hover/{expand}:bg-gray-300 ${
                   isExpanded ? 'rotate-0' : 'rotate-180'
                 } transition-all duration-200 ease-in-out`}
            />
          </div>
        </div>
      </div>
      {isGroupPanelOpen && (
        <ChannelGroupPanelModal
          server={server}
          channelGroup={category}
          groupName={name}
          onCloseModal={closeGroupPanel}
        />
      )}
      {isExpanded &&
        channelList.map((channel) => {
          const isActive = channel._id === activeChannelId;
          return (
            <ChannelButton
              name={channel.name}
              isActive={isActive}
              type={channel.type}
              relUrl={channel._id}
              server={server}
              channel={channel}
              key={channel._id}
            />
          );
        })}
    </div>
  );
}

function ChannelGroupPanelButton({
  isPanelOpen,
  onClick,
}: {
  isPanelOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${isPanelOpen ? 'Close' : 'Open'} channel group panel`}
      className="group/{settings} sr-only flex aspect-square h-4 
      w-4 items-center justify-center rounded-md outline-offset-4
      focus-visible:not-sr-only using-mouse:hover:bg-gray-600 
      using-mouse:group-hover:not-sr-only"
    >
      <div
        style={settingsStyle}
        className="alpha-mask aspect-square h-4 w-4 bg-gray-400 using-mouse:group-hover/{settings}:bg-gray-300"
      />
    </button>
  );
}

function useExtraButtonsWidth(
  extraButtonsRef: MutableRefObject<HTMLElement | null>,
) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target) {
          setWidth(entry.contentRect.width);
        }
      });
    });

    if (extraButtonsRef.current) {
      observer.observe(extraButtonsRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [extraButtonsRef]);

  return width;
}

function useGroupPanel() {
  const [isGroupPanelOpen, setIsGroupPanelOpen] = useState(false);

  const openGroupPanel = useCallback(() => {
    setIsGroupPanelOpen(true);
  }, []);

  const closeGroupPanel = useCallback(() => {
    setIsGroupPanelOpen(false);
  }, []);

  const toggleGroupPanel = useCallback(() => {
    setIsGroupPanelOpen((prevIsGroupPanelOpen) => !prevIsGroupPanelOpen);
  }, []);

  return {
    isGroupPanelOpen,
    openGroupPanel,
    closeGroupPanel,
    toggleGroupPanel,
  };
}

export default ChannelGroupSection;
