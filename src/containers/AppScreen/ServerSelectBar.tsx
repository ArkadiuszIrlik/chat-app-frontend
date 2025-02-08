import { useServerStore } from '@hooks/index';
import { Link } from 'react-router-dom';

function ServerSelectBar() {
  const { serverList } = useServerStore() ?? {};

  return (
    <div className="flex w-16 shrink-0 flex-col items-center p-2">
      {serverList?.map((server) => (
        <Link
          to={`channels/${server._id}`}
          className="block"
          title={server.name}
          key={server._id}
        >
          <img
            src={server.serverImg}
            alt=""
            className="aspect-square w-12 rounded-full"
          />
        </Link>
      ))}
    </div>
  );
}

export default ServerSelectBar;
