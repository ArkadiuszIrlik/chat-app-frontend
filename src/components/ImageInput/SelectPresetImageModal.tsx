import { useEffect, useId, useState } from 'react';
import { ModalContainer } from '@components/ModalContainer';
import { UserProfileImage } from '@components/UserProfileImage';
import { PrimaryButton } from '@components/PrimaryButton';
import { PresetImage } from '@components/ImageInput/ImageInput.types';

function SelectPresetImageModal({
  isOpen,
  imagesToSelect,
  initialSelectedImage,
  label,
  onSelect,
  onCloseModal,
}: {
  isOpen: boolean;
  imagesToSelect: PresetImage[];
  initialSelectedImage: PresetImage | null;
  label: string;
  onSelect: (image: PresetImage) => void;
  onCloseModal: () => void;
}) {
  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onCloseModal}
      closeOnClickOutside
      darkenBackdrop
    >
      <ModalContent
        imagesToSelect={imagesToSelect}
        initialSelectedImage={initialSelectedImage}
        label={label}
        onSelect={onSelect}
        onCloseModal={onCloseModal}
      />
    </ModalContainer>
  );
}

function ModalContent({
  imagesToSelect,
  initialSelectedImage,
  label,
  onSelect,
  onCloseModal,
}: {
  imagesToSelect: PresetImage[];
  initialSelectedImage: PresetImage | null;
  label: string;
  onSelect: (image: PresetImage) => void;
  onCloseModal: () => void;
}) {
  const [selectedImage, setSelectedImage] = useState<PresetImage | null>(
    initialSelectedImage,
  );

  // set initial selectedImage value when the dependencies change
  useEffect(() => {
    setSelectedImage(initialSelectedImage);
  }, [initialSelectedImage]);

  return (
    <fieldset>
      <legend className="mb-1">
        <h1 className="text-gray-200">{label}</h1>
      </legend>
      <div className="relative mx-auto max-w-80">
        <div
          className="absolute bottom-0 left-0 top-0 z-20 w-2 
        bg-gradient-to-l from-gray-700/0 to-gray-700"
        />
        <div
          className="mx-auto flex max-w-80 overflow-x-auto
         overflow-y-visible overscroll-contain"
        >
          <div
            // relative necessary to prevent overflow blowout from sr-only
            className="relative mx-auto flex items-center gap-3 px-4 py-4"
          >
            {imagesToSelect.map((image) => (
              <ImageSelectRadio
                name="select-picture"
                imageDescription={image.altText}
                imageUrl={image.url}
                value={image.id}
                checked={image.id === selectedImage?.id}
                onChange={() => {
                  setSelectedImage(image);
                }}
                key={image.id}
              />
            ))}
          </div>
        </div>
        <div
          className="absolute bottom-0 right-0 top-0 z-20 w-2 
        bg-gradient-to-r from-gray-700/0 to-gray-700"
        />
      </div>
      <div className="mt-2 flex items-center justify-center gap-10">
        <button
          type="button"
          onClick={onCloseModal}
          className="block w-24 text-gray-100 underline-offset-2 hover:underline"
        >
          Cancel
        </button>
        <div className="w-24">
          <PrimaryButton
            type="button"
            label={`Select ${selectedImage?.altText ?? ''}`}
            onClickHandler={() => {
              if (selectedImage !== null) {
                onSelect(selectedImage);
              }
              onCloseModal();
            }}
          >
            Select
          </PrimaryButton>
        </div>
      </div>
    </fieldset>
  );
}

function ImageSelectRadio({
  name,
  imageDescription,
  imageUrl,
  value,
  checked,
  onChange,
}: {
  name: string;
  imageDescription: string;
  imageUrl: string;
  value: PresetImage['id'];
  checked: boolean;
  onChange: (nextValue: PresetImage['id']) => void;
}) {
  const inputId = useId();

  return (
    <label
      htmlFor={inputId}
      className={`block cursor-pointer select-none rounded-full border-2 outline-offset-4 has-[:focus-visible]:outline ${
        checked ? 'border-cerise-600' : 'border-transparent'
      } ${checked ? 'z-10 scale-125' : ''}`}
      aria-label={imageDescription}
      draggable="false"
    >
      <input
        type="radio"
        name={name}
        id={inputId}
        value={value}
        checked={checked}
        onChange={(e) => {
          onChange(e.currentTarget.value);
        }}
        className="sr-only"
      />
      <div
        className={`aspect-square h-14 w-14 shrink-0 grow-0
         `}
      >
        <UserProfileImage image={imageUrl} />
      </div>
    </label>
  );
}

export default SelectPresetImageModal;
