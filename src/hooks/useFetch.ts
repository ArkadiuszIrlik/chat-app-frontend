import { useState, useEffect, useMemo } from 'react';
import { getURL } from '@helpers/fetch';

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
  isFileUpload?: never;
}
type ConditionalPostData =
  | {
      postData: FormData;
      isFileUpload: true;
    }
  | { postData: object; isFileUpload?: false };
type PostProps = ConditionalPostData & {
  method: 'POST' | 'PUT' | 'PATCH';
};

interface DeleteProps {
  method: 'DELETE';
  postData?: object;
  isFileUpload?: never;
}
type ConditionalProps = GetProps | PostProps | DeleteProps;
type Props = BaseProps & ConditionalProps;

const defaultInitialParams = {};
const defaultHeaders = {};

function formatHeaders(headers: Record<string, string>, isFileUpload: boolean) {
  const nextHeaders = { ...headers };
  if (nextHeaders['Content-Type'] === undefined && !isFileUpload) {
    nextHeaders['Content-Type'] = 'application/json;charset=utf-8';
  }
  return nextHeaders;
}

function formatRequestBody(
  postData: object | FormData | undefined,
  isFileUpload: boolean,
) {
  if (postData && isFileUpload) {
    return postData as FormData;
  }
  if (postData && !isFileUpload) {
    return JSON.stringify(postData);
  }
  return undefined;
}

function useFetch({
  initialUrl,
  initialParams = defaultInitialParams,
  onMount = true,
  postData,
  method = 'GET',
  headers = defaultHeaders,
  credentials = 'include',
  isFileUpload = false,
}: Props) {
  const [url, updateUrl] = useState(initialUrl);
  const [params, updateParams] = useState(initialParams);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<Record<string, any> | null>(null);
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
  const refetch = () => setRefetchIndex(refetchIndex + 1);

  useEffect(() => {
    async function fetchData() {
      if (onMount === false && refetchIndex === 0) return;
      setIsLoading(true);
      setHasError(false);
      setErrorMessage('');
      try {
        const response = await fetch(`${getURL(url)}?${queryString}`, {
          headers: formatHeaders(headers, isFileUpload),
          body: formatRequestBody(postData, isFileUpload),
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
        setRefetchIndex(0);
        setIsLoading(false);
      }
    }
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
    isFileUpload,
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
