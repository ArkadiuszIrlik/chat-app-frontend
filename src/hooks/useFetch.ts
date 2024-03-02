import { useState, useEffect } from 'react';

interface BaseProps {
  initialUrl: string;
  initialParams?: Record<string, string | number>;
  onMount?: boolean;
  headers?: Record<string, string>;
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

function getURL(url: string) {
  const urlExpression =
    'https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)';
  const regex = new RegExp(urlExpression);
  if (url.match(regex)) {
    return url;
  }
  let mainURL = import.meta.env.VITE_MAIN_API_ENDPOINT;
  if (mainURL === undefined) return '';
  if (!mainURL.endsWith('/')) mainURL += '/';

  let nextUrl = url;
  if (url.length > 0 && url.startsWith('/')) {
    nextUrl = url.substring(1, url.length);
  }
  return mainURL + nextUrl;
}

function useFetch({
  initialUrl,
  initialParams = {},
  onMount = true,
  postData,
  method = 'GET',
  headers = {},
}: Props) {
  const [url, updateUrl] = useState(initialUrl);
  const [params, updateParams] = useState(initialParams);
  const [data, setData] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [refetchIndex, setRefetchIndex] = useState(0);
  const queryString = Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
    )
    .join('&');
  const refetch = () =>
    setRefetchIndex((prevRefetchIndex) => prevRefetchIndex + 1);
  useEffect(() => {
    async function fetchData() {
      if (onMount === false && refetchIndex === 0) return;
      setIsLoading(true);
      const nextHeaders = { ...headers };
      if (nextHeaders['Content-Type'] === undefined) {
        nextHeaders['Content-Type'] = 'application/json;charset=utf-8';
      }
      try {
        const response = await fetch(`${getURL(url)}${queryString}`, {
          headers: nextHeaders,
          body: postData ? JSON.stringify(postData) : undefined,
          method,
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