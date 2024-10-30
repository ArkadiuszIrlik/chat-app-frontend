import CategoryButton from '@containers/SettingsScreen/CategoryButton';

function CategoryList({
  categories,
  onSwitchActiveCategory,
  activeCategoryIndex,
}: {
  categories: string[];
  onSwitchActiveCategory: (index: number) => void;
  activeCategoryIndex: number;
}) {
  return (
    <div>
      {categories.map((category, index) => {
        const isActive = index === activeCategoryIndex;
        return (
          <CategoryButton
            isActive={isActive}
            name={category}
            onClick={() => onSwitchActiveCategory(index)}
            key={category}
          />
        );
      })}
    </div>
  );
}
export default CategoryList;
