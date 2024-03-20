import { useState, useEffect, useMemo } from 'react';

interface BaseProps {
  initialUrl: string;
  initialParams?: Record<string, string | number>;
  onMount?: boolean;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}
interface GetProps {
  method: 'GET' | 'HEAD';
  postData?: never;
}
interface PostProps {
  method: 'POST' | 'DELETE' | 'PUT';
  postData: object;
}
type ConditionalProps = GetProps | PostProps;
type Props = BaseProps & ConditionalProps;

const defaultInitialParams = {};
const defaultHeaders = {};

function useFetch({
  initialUrl,
  initialParams = defaultInitialParams,
  onMount = true,
  postData,
  method = 'GET',
  headers = defaultHeaders,
  credentials = 'include',
}: Props) {
  const [url, updateUrl] = useState(initialUrl);
  const [params, updateParams] = useState(initialParams);
  const [data, setData] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [refetchIndex, setRefetchIndex] = useState(0);
  const queryString = useMemo(
    () =>
      Object.keys(params)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
        )
        .join('&'),
    [params],
  );
  useEffect(() => {
    async function fetchData() {
      if (onMount === false && refetchIndex === 0) return;
      setIsLoading(true);
      setHasError(false);
      setErrorMessage('');
      const nextHeaders = { ...headers };
      if (nextHeaders['Content-Type'] === undefined) {
        nextHeaders['Content-Type'] = 'application/json;charset=utf-8';
      }
      try {
        const response = await fetch(`${getURL(url)}${queryString}`, {
          headers: nextHeaders,
          body: postData ? JSON.stringify(postData) : undefined,
          method,
          credentials,
        });
        const result = (await response.json()) as Record<
          string,
          string | boolean | number
        >;
        if (response.ok) {
          setData(result);
        } else {
          setHasError(true);
          if (typeof result.message === 'string') {
            setErrorMessage(result.message);
          } else if (typeof result.error === 'string') {
            setErrorMessage(result.error);
          }
        }
      } catch (err) {
        if (typeof err === 'string') {
          setErrorMessage(err);
        } else if (err instanceof Error) {
          setErrorMessage(err.message);
        }
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line no-void
    void fetchData();
  }, [
    url,
    params,
    refetchIndex,
    queryString,
    onMount,
    method,
    postData,
    headers,
    credentials,
  ]);
  return {
    data,
    isLoading,
    hasError,
    errorMessage,
    updateUrl,
    updateParams,
    refetch,
  };
}
export default useFetch;
