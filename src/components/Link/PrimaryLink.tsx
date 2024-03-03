import { Link, LinkProps } from 'react-router-dom';

function PrimaryLink(props: LinkProps) {
  return (
    <div className="w-full shadow">
      <Link
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        className="block w-full rounded-md bg-gradient-to-tr from-clairvoyant-900 to-cerise-600 px-5
        py-2 text-center text-white shadow-[inset_0_2px_0_rgba(221,85,177,80%)] hover:brightness-110
         active:brightness-125"
      />
    </div>
  );
}
export default PrimaryLink;
