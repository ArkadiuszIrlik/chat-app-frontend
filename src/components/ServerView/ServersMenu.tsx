import { useServerStore } from '@hooks/index';
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

ServersMenu.defaultProps = {
  onCloseMenu: undefined,
};

const defaultOnCloseServerMenu = () => undefined;

function ServersMenu({ onCloseMenu }: { onCloseMenu?: () => void }) {
  const { serverList } = useServerStore() ?? {};
  const { serverId } = useParams();
  const [isModalShown, setIsModalShown] = useState(false);

  const handleAddServer = useCallback(() => {
    setIsModalShown(true);
  }, []);
  const handleCloseModal = useCallback(() => {
    setIsModalShown(false);
  }, []);

  return (
    <div className="flex min-h-0 flex-col">
      {isModalShown && (
        <AddServerModal
          onCloseModal={handleCloseModal}
          onCloseServersMenu={onCloseMenu ?? defaultOnCloseServerMenu}
        />
      )}
      <div className="mb-2 flex items-center gap-1 py-1">
        {onCloseMenu && (
          <button
            type="button"
            onClick={onCloseMenu}
            aria-label="Close servers menu"
            className="group rounded-lg hover:bg-gray-600"
          >
            <div
              className="alpha-mask aspect-square h-7 w-7 shrink-0 grow-0
               bg-gray-400 group-hover:bg-gray-300"
              style={closeMenuStyles}
            />
          </button>
        )}
        <h1 className="text-xl">Servers</h1>
      </div>
      <div className="my-2 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {serverList?.map((server) => {
            const isActive =
              server._id !== undefined && server._id === serverId;
            return (
              <ServerLink
                serverId={server._id}
                serverImg={server.serverImg}
                serverName={server.name}
                isActive={isActive}
                onClick={onCloseMenu}
                key={server._id}
              />
            );
          })}
          <div
            className={`flex flex-col ${
              !serverList || serverList.length === 0
                ? ''
                : 'border-t-2 border-t-gray-500 pt-1'
            }`}
          >
            <AddServerButton onAddServer={handleAddServer} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServersMenu;

ServerLink.defaultProps = {
  onClick: undefined,
};

function ServerLink({
  serverId,
  serverName,
  serverImg,
  isActive,
  onClick = undefined,
}: {
  serverId: string;
  serverName: string;
  serverImg: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={`/app/channels/${serverId}`}
      className={`flex items-center gap-2 rounded-md px-2 py-1 ${
        isActive ? 'bg-gray-600 hover:bg-gray-500' : 'hover:bg-gray-600'
      }`}
      onClick={onClick}
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
      className="group flex items-center gap-2 rounded-md px-2 py-1
       hover:bg-gray-600"
    >
      <div className="w-10">
        <div
          style={addServerStyles}
          className="alpha-mask mx-auto aspect-square h-7 w-7 shrink-0 grow-0
           bg-gray-500 group-hover:bg-green-500"
        />
      </div>
      <span className="truncate" title="Add server">
        Add server
      </span>
    </button>
  );
}
