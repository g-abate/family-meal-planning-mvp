import { useWizardStore } from '../../stores/wizardStore';
import { AVAILABLE_PROTEINS, AVAILABLE_VEGETABLES, AVAILABLE_STARCHES } from '../../types/wizard';

interface IngredientsStepProps {
  ref?: React.Ref<HTMLInputElement>;
}

export function IngredientsStep({ ref: _ref }: IngredientsStepProps) {
  const { ingredients, setIngredients } = useWizardStore();

  const handleProteinChange = (protein: string, checked: boolean) => {
    const currentProteins = ingredients.availableProteins;
    const newProteins = checked
      ? [...currentProteins, protein]
      : currentProteins.filter(p => p !== protein);
    
    setIngredients({ availableProteins: newProteins });
  };

  const handleVegetableChange = (vegetable: string, checked: boolean) => {
    const currentVegetables = ingredients.availableVegetables;
    const newVegetables = checked
      ? [...currentVegetables, vegetable]
      : currentVegetables.filter(v => v !== vegetable);
    
    setIngredients({ availableVegetables: newVegetables });
  };

  const handleStarchChange = (starch: string, checked: boolean) => {
    const currentStarches = ingredients.availableStarches;
    const newStarches = checked
      ? [...currentStarches, starch]
      : currentStarches.filter(s => s !== starch);
    
    setIngredients({ availableStarches: newStarches });
  };

  const renderIngredientSection = (
    title: string,
    description: string,
    options: readonly string[],
    selectedItems: string[],
    onChange: (item: string, checked: boolean) => void
  ) => {
    const selectedCount = selectedItems.length;
    const countText = selectedCount === 0 ? 'None selected' : `${selectedCount} selected`;

    return (
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-primary-500 mb-2">
          {title}
        </legend>
        <p className="text-sage-600 text-sm mb-3">{description}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 p-3 rounded-lg border border-sage-200 hover:bg-sage-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(option)}
                onChange={(e) => onChange(option, e.target.checked)}
                className="w-4 h-4 text-primary-500 border-sage-300 rounded focus:ring-primary-500 focus:ring-2"
                aria-describedby={`${title.toLowerCase()}-count`}
              />
              <span className="text-sage-700 font-medium">{option}</span>
            </label>
          ))}
        </div>
        
        <div className="text-sm text-sage-500" id={`${title.toLowerCase()}-count`}>
          {countText}
        </div>
      </fieldset>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-primary-500 mb-4">
          What proteins, vegetables, and starches do you have?
        </h4>
        <p className="text-sage-600">
          Select the ingredients you have available (optional)
        </p>
      </div>

      <div className="space-y-8">
        {renderIngredientSection(
          'Proteins',
          'Select available proteins',
          AVAILABLE_PROTEINS,
          ingredients.availableProteins,
          handleProteinChange
        )}

        {renderIngredientSection(
          'Vegetables',
          'Select available vegetables',
          AVAILABLE_VEGETABLES,
          ingredients.availableVegetables,
          handleVegetableChange
        )}

        {renderIngredientSection(
          'Starches',
          'Select available starches',
          AVAILABLE_STARCHES,
          ingredients.availableStarches,
          handleStarchChange
        )}
      </div>
    </div>
  );
}