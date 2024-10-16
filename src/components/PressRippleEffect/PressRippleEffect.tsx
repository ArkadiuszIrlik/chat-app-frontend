import usePressRippleEffect from '@components/PressRippleEffect/usePressRippleEffect';

function PressRippleEffect({
  attributes,
}: {
  attributes: ReturnType<typeof usePressRippleEffect>['attributes'];
}) {
  if (attributes.isRippleShown) {
    return (
      <span
        className="ripple absolute -z-10 rounded-full"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...attributes}
      />
    );
  }
  return null;
}
export default PressRippleEffect;
