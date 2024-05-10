import { Link } from 'react-router-dom';

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
        className={`${
          type === 'text' ? 'text-channel-mask' : 'voice-channel-mask'
        } ${
          isActive ? ' group-hover:bg-gray-300' : 'bg-gray-400'
        } h-6 w-6 bg-gray-400 `}
      />
      <h5 className={`${isActive ? 'text-white' : 'text-gray-300'}`}>{name}</h5>
    </Link>
  );
}

export default ChannelLink;
