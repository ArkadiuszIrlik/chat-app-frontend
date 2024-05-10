import { useAuth } from '@hooks/index';
import { Link, useParams } from 'react-router-dom';
import LeftArrow from '@assets/left-arrow-icon.png';
import PlusIcon from '@assets/plus-icon.png';
import { ExtendedCSSProperties } from '@src/types';
import { useCallback, useState } from 'react';
import { AddServerModal } from '@components/AddServerModal';
import { ServerImage } from '@components/ServerImage';

const closeMenuStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${LeftArrow})`,
};
const addServerStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${PlusIcon})`,
};

function ServersMenu({ onCloseMenu }: { onCloseMenu: () => void }) {
  const { user } = useAuth()!;
  const serverList = user?.serversIn ?? [];
  const { serverId } = useParams();
  const [isModalShown, setIsModalShown] = useState(false);

  const handleAddServer = useCallback(() => {
    setIsModalShown(true);
  }, []);
  const handleCloseModal = useCallback(() => {
    setIsModalShown(false);
  }, []);

  return (
    <div>
      {isModalShown && <AddServerModal onCloseModal={handleCloseModal} />}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onCloseMenu}
          aria-label="Close servers menu"
          className="group rounded-lg hover:bg-gray-600"
        >
          <div
            className="alpha-mask aspect-square h-7 w-7 shrink-0 grow-0 bg-gray-400 group-hover:bg-gray-300"
            style={closeMenuStyles}
          />
        </button>
        <h1 className="text-xl">Servers</h1>
      </div>
      <div className="flex flex-col gap-1 py-2">
        {serverList.map((server) => {
          const isActive = server._id !== undefined && server._id === serverId;
          return (
            <ServerLink
              serverId={server._id}
              serverImg={server.serverImg}
              serverName={server.name}
              isActive={isActive}
              key={server._id}
            />
          );
        })}
        <div className="flex flex-col border-t-2 border-t-gray-500 pt-1">
          <AddServerButton onAddServer={handleAddServer} />
        </div>
      </div>
    </div>
  );
}

export default ServersMenu;

function ServerLink({
  serverId,
  serverName,
  serverImg,
  isActive,
}: {
  serverId: string;
  serverName: string;
  serverImg: string;
  isActive: boolean;
}) {
  return (
    <Link
      to={`/app/channels/${serverId}`}
      className={`flex items-center gap-2 rounded-md px-2 py-1 ${
        isActive ? 'bg-gray-600 hover:bg-gray-500' : 'hover:bg-gray-600'
      }`}
    >
      <div className="aspect-square h-10 w-10 shrink-0 grow-0">
        <ServerImage image={serverImg} />
      </div>
      <span className="truncate" title={serverName}>
        {serverName}
      </span>
    </Link>
  );
}

function AddServerButton({ onAddServer }: { onAddServer: () => void }) {
  return (
    <button
      type="button"
      onClick={onAddServer}
      className="group flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-600"
    >
      <div className="w-10">
        <div
          style={addServerStyles}
          className="alpha-mask mx-auto aspect-square h-7 w-7 shrink-0 grow-0 bg-gray-500 group-hover:bg-green-500"
        />
      </div>
      <span className="truncate" title="Add server">
        Add server
      </span>
    </button>
  );
}
