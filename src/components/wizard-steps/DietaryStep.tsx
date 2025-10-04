import { useWizardStore } from '../../stores/wizardStore';
import { DIETARY_RESTRICTIONS } from '../../types/wizard';
import type { DietaryRestriction } from '../../types/wizard';

interface DietaryStepProps {
  ref?: React.Ref<HTMLInputElement>;
}

export function DietaryStep({ ref: _ref }: DietaryStepProps) {
  const { dietary, setDietary } = useWizardStore();

  const handleRestrictionChange = (restriction: string) => {
    // For single selection, replace the entire array with the selected restriction
    setDietary({ restrictions: [restriction as DietaryRestriction] });
  };

  const handleClearSelection = () => {
    setDietary({ restrictions: [] });
  };

  const selectedRestriction = dietary.restrictions[0] || null;

  const getDisplayLabel = (restriction: string) => {
    return restriction
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-primary-500 mb-4">
          Any dietary restrictions to consider?
        </h4>
        <p className="text-sage-600">
          Select any dietary restrictions (optional)
        </p>
      </div>

      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-primary-500 mb-2">
          Dietary Restrictions
        </legend>
        <p className="text-sage-600 text-sm mb-3">Select dietary restrictions</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {DIETARY_RESTRICTIONS.map((restriction) => (
            <label
              key={restriction}
              className="flex items-center space-x-3 p-3 rounded-lg border border-sage-200 hover:bg-sage-50 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="dietary-restrictions"
                value={restriction}
                checked={selectedRestriction === restriction}
                onChange={() => handleRestrictionChange(restriction)}
                className="w-4 h-4 text-sage-600 border-sage-300 focus:ring-sage-500 focus:ring-2"
                aria-describedby="dietary-count"
              />
              <span className="text-sage-700 font-medium">
                {getDisplayLabel(restriction)}
              </span>
            </label>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-sage-500" id="dietary-count">
            {selectedRestriction ? `${getDisplayLabel(selectedRestriction)} selected` : 'None selected'}
          </div>
          {selectedRestriction && (
            <button
              onClick={handleClearSelection}
              className="text-sm text-sage-500 hover:text-sage-700 underline"
            >
              Clear selection
            </button>
          )}
        </div>
      </fieldset>
    </div>
  );
}