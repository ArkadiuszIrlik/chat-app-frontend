export function getURL(url: string) {
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

export function getClientURL(url: string) {
  const urlExpression =
    'https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)';
  const regex = new RegExp(urlExpression);
  if (url.match(regex)) {
    return url;
  }
  let mainURL = import.meta.env.VITE_FRONTEND_URL;
  if (mainURL === undefined) return '';
  if (!mainURL.endsWith('/')) mainURL += '/';

  let nextUrl = url;
  if (url.length > 0 && url.startsWith('/')) {
    nextUrl = url.substring(1, url.length);
  }
  return mainURL + nextUrl;
}

interface ExtendedError extends Error {
  status: number;
  data: object;
}

export async function genericFetcherCredentials(key: string) {
  const res = await fetch(getURL(key), { credentials: 'include' });
  if (!res.ok) {
    const error = new Error(
      'An error occurred while fetching the data.',
    ) as ExtendedError;
    error.data = (await res.json()) as object;
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export default async function genericFetcher(key: string) {
  const res = await fetch(getURL(key));
  if (!res.ok) {
    const error = new Error(
      'An error occurred while fetching the data.',
    ) as ExtendedError;
    error.data = (await res.json()) as object;
    error.status = res.status;
    throw error;
  }
  return res.json();
}
