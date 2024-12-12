import { UserProfileImage } from '@components/UserProfileImage';
import { ExtendedCSSProperties } from '@src/types';
import ImageIcon from '@assets/image-icon.png';

const addImageStyles: ExtendedCSSProperties = {
  '--mask-url': `url(${ImageIcon})`,
};

ImageContainer.defaultProps = {
  hasError: false,
};

function ImageContainer({
  imgUrl,
  hasError = false,
}: {
  imgUrl: string;
  hasError?: boolean;
}) {
  return (
    <div
      className={`indent-shadow relative flex aspect-square h-24 w-24 shrink-0
          overflow-hidden rounded-full border-2 bg-gray-800 bg-clip-padding ${
            hasError ? 'border-red-400' : 'border-transparent'
          }`}
    >
      {imgUrl === '' && (
        <div className="absolute flex h-full w-full items-center justify-center">
          <div
            className="alpha-mask aspect-square h-11 w-11
               shrink-0 grow-0 bg-gray-300"
            style={addImageStyles}
          />
        </div>
      )}
      {imgUrl !== '' && <UserProfileImage image={imgUrl} />}
    </div>
  );
}

export default ImageContainer;
