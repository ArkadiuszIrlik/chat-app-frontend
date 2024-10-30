function CategoryButton({
  isActive,
  name,
  onClick,
}: {
  isActive: boolean;
  name: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`group mb-1 flex w-full items-center gap-1 truncate rounded-md
         px-2 py-1 ${
           isActive
             ? 'bg-gray-600 using-mouse:hover:bg-gray-500'
             : 'using-mouse:hover:bg-gray-600'
         }`}
      onClick={onClick}
    >
      <h5 className={`${isActive ? 'text-white' : 'text-gray-300'}`}>{name}</h5>
    </button>
  );
}

export default CategoryButton;
