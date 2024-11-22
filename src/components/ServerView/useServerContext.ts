import { useOutletContext } from 'react-router-dom';

export interface ServerContextInterface {
  activeChannel: Channel | null;
  server: Server;
}

export default function useServerContext() {
  return useOutletContext<ServerContextInterface>();
}
