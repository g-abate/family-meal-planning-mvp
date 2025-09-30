import { forwardRef } from 'react';
import { useWizardStore } from '../../stores/wizardStore';
import { MEAL_TYPES } from '../../types/wizard';

export const MealCountStep = forwardRef<HTMLInputElement>((props, ref) => {
  const { mealCount, setMealCount } = useWizardStore();

  const handleMealCountChange = (delta: number) => {
    const newCount = mealCount.mealsPerWeek + delta;
    if (newCount >= 1 && newCount <= 21) {
      setMealCount({ mealsPerWeek: newCount });
    }
  };

  const handleMealTypeToggle = (mealType: string) => {
    const currentTypes = mealCount.mealTypes;
    const newTypes = currentTypes.includes(
      mealType as 'breakfast' | 'lunch' | 'dinner'
    )
      ? currentTypes.filter(type => type !== mealType)
      : [...currentTypes, mealType as 'breakfast' | 'lunch' | 'dinner'];

    setMealCount({ mealTypes: newTypes });
  };

  return (
    <div className='space-y-8'>
      {/* Meal Count Section */}
      <div className='text-center'>
        <h4 className='text-lg font-semibold text-primary-500 mb-4'>
          How many meals this week?
        </h4>
        <div className='flex items-center justify-center space-x-4'>
          <button
            onClick={() => handleMealCountChange(-1)}
            className='w-12 h-12 bg-sage-100 hover:bg-sage-200 rounded-lg flex items-center justify-center transition-colors'
            disabled={mealCount.mealsPerWeek <= 1}
          >
            <svg
              className='w-5 h-5 text-sage-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M20 12H4'
              />
            </svg>
          </button>

          <div className='w-24 h-12 bg-white border-2 border-primary-200 rounded-lg flex items-center justify-center'>
            <span className='text-2xl font-bold text-primary-500'>
              {mealCount.mealsPerWeek}
            </span>
          </div>

          <button
            onClick={() => handleMealCountChange(1)}
            className='w-12 h-12 bg-sage-100 hover:bg-sage-200 rounded-lg flex items-center justify-center transition-colors'
            disabled={mealCount.mealsPerWeek >= 21}
          >
            <svg
              className='w-5 h-5 text-sage-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 6v6m0 0v6m0-6h6m-6 0H6'
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Meal Types Section */}
      <div>
        <h4 className='text-lg font-semibold text-primary-500 mb-4'>
          Which meal types?
        </h4>
        <div className='flex flex-wrap gap-3 justify-center'>
          {MEAL_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleMealTypeToggle(value)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                mealCount.mealTypes.includes(value)
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white text-sage-700 border-2 border-sage-200 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Hidden input for focus management */}
      <input
        ref={ref}
        type='hidden'
        value={mealCount.mealsPerWeek}
        tabIndex={-1}
      />
    </div>
  );
});

MealCountStep.displayName = 'MealCountStep';
