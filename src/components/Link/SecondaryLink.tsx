import { Link, LinkProps } from 'react-router-dom';

function SecondaryLink({ children, ...props }: LinkProps) {
  return (
    <div className="w-full shadow">
      <Link
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        className="relative z-0 block w-full min-w-full rounded-md px-5 py-2 text-center
        text-white hover:brightness-110 active:brightness-125"
      >
        <span
          className="mask-content absolute inset-0 -z-10 rounded-md bg-gradient-to-tr from-clairvoyant-900
          to-cerise-600 p-1 shadow-[inset_0_2px_0_rgba(221,85,177,70%)]"
        />
        {children}
      </Link>
    </div>
  );
}
export default SecondaryLink;
