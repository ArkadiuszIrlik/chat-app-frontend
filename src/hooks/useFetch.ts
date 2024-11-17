import { useState, useEffect, useMemo } from 'react';
import { getURL, HttpError } from '@helpers/fetch';

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useFetch<DT = Record<string, any>>({
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
  const [data, setData] = useState<DT | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState<HttpError | null>(null);
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

  const refetch = useCallback(() => {
    setRefetchIndex((prevIndex) => prevIndex + 1);
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (onMount === false && refetchIndex === 0) return;
      setIsLoading(true);
      setHasError(false);
      setError(null);
      setErrorMessage('');
      try {
        const response = await fetch(`${getURL(url)}?${queryString}`, {
          headers: formatHeaders(headers, isFileUpload),
          body: formatRequestBody(postData, isFileUpload),
          method,
          credentials,
        });
        if (response.ok) {
          const result = (await response.json()) as DT;
          setData(result);
        } else {
          const errorData = (await response.json()) as BackendError;
          const nextError = new HttpError(
            errorData?.message ?? 'An error occurred while fetching the data.',
            errorData,
            response.status,
          );
          setHasError(true);
          setError(nextError);
          setErrorMessage(
            errorData?.message ?? 'An error occurred while fetching the data.',
          );
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
    error,
    hasError,
    errorMessage,
    updateUrl,
    updateParams,
    refetch,
  };
}
export default useFetch;
