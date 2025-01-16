import { PrimaryLink, SecondaryLink } from '@components/Link';
import { Link } from 'react-router-dom';

function ButtonPanel() {
  return (
    <div
      className="mx-auto flex w-44 flex-col
      gap-4 sm:mr-0 sm:w-60 md:w-80"
    >
      <PrimaryLink to="/login">Log in</PrimaryLink>
      <SecondaryLink to="/signup">Create account</SecondaryLink>
    </div>
  );
}

export default ButtonPanel;
