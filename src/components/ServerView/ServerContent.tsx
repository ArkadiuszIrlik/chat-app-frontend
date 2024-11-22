import { ErrorDisplay } from '@components/form-controls';
import { ServerContextInterface } from '@components/ServerView/useServerContext';
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

function ServerContent({
  isServerListEmpty,
  isServerLoading,
  hasError,
  errorMessage,
  isServerLoaded,
  activeChannel,
  server,
}: {
  isServerListEmpty: boolean;
  isServerLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  isServerLoaded: boolean;
  activeChannel: Channel | null;
  server: Server | undefined;
}) {
  let componentToReturn: ReactNode = null;
  switch (true) {
    case isServerListEmpty:
      componentToReturn = (
        <div className="px-2 pt-2 md:px-10 md:pt-12">
          <div className="max-w-prose text-gray-100">
            It looks like you haven&apos;t joined any servers yet. Let&apos;s
            get you set up. Click &quot;Add a server&quot; in the panel to the
            left to join or create a new server.
          </div>
        </div>
      );
      break;
    case !isServerLoading && hasError:
      componentToReturn = (
        <div className="mx-auto">
          <ErrorDisplay errorMessage={errorMessage ?? 'Error loading server'} />
        </div>
      );
      break;
    case !isServerLoading && isServerLoaded && !!server:
      componentToReturn = (
        <Outlet
          context={{ activeChannel, server } satisfies ServerContextInterface}
        />
      );
      break;
    default:
      componentToReturn = null;
  }

  return componentToReturn;
}
export default ServerContent;
