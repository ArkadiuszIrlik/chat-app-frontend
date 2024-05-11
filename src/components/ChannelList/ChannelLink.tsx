import { Link } from 'react-router-dom';
import TextChannelIcon from '@assets/text-channel-icon.png';
import VoiceChannelIcon from '@assets/voice-channel-icon.png';
import { ExtendedCSSProperties } from '@src/types';

const textChannelStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${TextChannelIcon})`,
};

const voiceChannelStyle: ExtendedCSSProperties = {
  '--mask-url': `url(${VoiceChannelIcon})`,
};

function ChannelLink({
  type,
  isActive,
  name,
  relUrl,
}: {
  type: 'voice' | 'text';
  isActive: boolean;
  name: string;
  relUrl: string;
}) {
  return (
    <Link
      to={relUrl}
      className={`group mb-1 flex w-full items-center gap-1 truncate rounded-md px-2 py-1 ${
        isActive ? 'bg-gray-600 hover:bg-gray-500' : 'hover:bg-gray-600'
      }`}
    >
      <div
        style={type === 'text' ? textChannelStyle : voiceChannelStyle}
        className={`${
          isActive ? ' group-hover:bg-gray-300' : 'bg-gray-400'
        } alpha-mask aspect-square h-6 w-6 shrink-0 grow-0 bg-gray-400`}
      />
      <h5
        className={`${isActive ? 'text-white' : 'text-gray-300'} truncate`}
        title={name}
      >
        {name}
      </h5>
    </Link>
  );
}

export default ChannelLink;
