import { useEffect, useState } from 'react';

const MAX_IMAGES_TO_DISPLAY = 5;
const SUPPORTED_IMAGE_MIME_TYPES = [
  'image/apng',
  'image/avif',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/webp',
];
const MAX_IMAGE_SIZE_BYTES = 1000000;

function MessageImageContainer({ messageText }: { messageText: string }) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    async function detectImages() {
      const images = await getImages(messageText, MAX_IMAGES_TO_DISPLAY);
      setImageUrls(images);
    }

    void detectImages();
  }, [messageText]);

  return (
    <div className="flex max-w-96 flex-col items-start gap-2">
      {imageUrls.map((url) => (
        <img
          src={url}
          alt=""
          className="max-h-60 object-contain object-center"
          key={url}
        />
      ))}
    </div>
  );
}
export default MessageImageContainer;

async function getImages(text: string, imageCount = Infinity) {
  const MAX_CONCURRENT_REQUESTS = 5;

  let imageUrlsToFind = imageCount;
  const messageUrls = getTextUrls(text, true).map((url) =>
    // convert http urls to https to try avoiding mixed content blocking
    url.replace(/^http:\/\//, 'https://'),
  );
  let lastIndexChecked = -1;
  const imageUrlsToDisplay: string[] = [];
  const urlsToCheck: string[] = [];
  while (imageUrlsToFind > 0 && lastIndexChecked < messageUrls.length - 1) {
    lastIndexChecked += 1;
    urlsToCheck.push(messageUrls[lastIndexChecked]);

    if (
      urlsToCheck.length === MAX_CONCURRENT_REQUESTS ||
      lastIndexChecked === messageUrls.length - 1
    ) {
      const headPromises = urlsToCheck.map((url) => fetchHead(url));
      // eslint-disable-next-line no-await-in-loop
      const headSettled = await Promise.allSettled(headPromises);
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      headSettled.forEach((settled, i) => {
        if (settled.status === 'fulfilled') {
          const res = settled.value;
          if (checkIsValidImageResponse(res)) {
            imageUrlsToDisplay.push(urlsToCheck[i]);
            imageUrlsToFind -= 1;
          }
        }
      });
    }
  }

  return imageUrlsToDisplay;
}

function checkIsValidImageResponse(res: Response): boolean {
  const contentType = res.headers.get('Content-Type');
  if (!SUPPORTED_IMAGE_MIME_TYPES.includes(contentType ?? '')) {
    return false;
  }
  const contentLength = res.headers.get('Content-Length');
  if (parseInt(contentLength ?? '', 10) > MAX_IMAGE_SIZE_BYTES) {
    return false;
  }

  return true;
}

function getTextUrls(text: string, unique = false) {
  const regex = /(?:<a .*?href="(.+?)".*?>)/g;

  const matches = [...text.matchAll(regex)];
  const urls: string[] = [];
  matches.forEach((match) => {
    const [, ...matchGroups] = match;
    matchGroups.forEach((group) => urls.push(group));
  });

  let returnArray: string[];
  if (unique) {
    returnArray = [...new Set(urls)];
  } else {
    returnArray = urls;
  }

  return returnArray;
}

function fetchHead(url: string) {
  return fetch(url, {
    method: 'HEAD',
  });
}
