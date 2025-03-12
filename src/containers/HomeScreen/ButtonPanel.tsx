import { PrimaryLink, SecondaryLink } from '@components/Link';
import { Link } from 'react-router-dom';

function ButtonPanel() {
  return (
    <div
      className="mx-auto flex w-44 flex-col
      gap-4 sm:mr-0 sm:w-60 md:w-80"
    >
      <div className="w-full shadow">
        <Link
          to="/demo"
          className="block w-full rounded-md bg-gradient-to-tr from-clairvoyant-900 to-blue-700 px-5
          py-2 text-center text-white shadow-[inset_0_2px_0_rgba(72,188,255,40%)] hover:brightness-110
           active:brightness-125"
        >
          Take a tour
        </Link>
      </div>
      <PrimaryLink to="/login">Log in</PrimaryLink>
      <SecondaryLink to="/signup">Create account</SecondaryLink>
    </div>
  );
}

export default ButtonPanel;
