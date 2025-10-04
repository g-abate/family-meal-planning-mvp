import { forwardRef } from 'react';
import { useWizardStore } from '../../stores/wizardStore';
import { MEAL_TYPES } from '../../types/wizard';

export const MealCountStep = forwardRef<HTMLInputElement>((_props, ref) => {
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
      <fieldset className='text-center'>
        <legend className='text-lg font-semibold text-primary-500 mb-4'>
          How many meals this week?
        </legend>
        <div className='flex items-center justify-center space-x-4'>
          <button
            type='button'
            onClick={() => handleMealCountChange(-1)}
            className='w-12 h-12 bg-sage-100 hover:bg-sage-200 rounded-lg flex items-center justify-center transition-colors'
            disabled={mealCount.mealsPerWeek <= 1}
            aria-label='Decrease meal count'
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

          <div 
            className='w-24 h-12 bg-white border-2 border-primary-200 rounded-lg flex items-center justify-center'
            role='status'
            aria-live='polite'
            aria-label={`${mealCount.mealsPerWeek} meals selected`}
          >
            <span className='text-2xl font-bold text-primary-500'>
              {mealCount.mealsPerWeek}
            </span>
          </div>

          <button
            type='button'
            onClick={() => handleMealCountChange(1)}
            className='w-12 h-12 bg-sage-100 hover:bg-sage-200 rounded-lg flex items-center justify-center transition-colors'
            disabled={mealCount.mealsPerWeek >= 21}
            aria-label='Increase meal count'
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
        <p className='text-sm text-sage-500 mt-2'>
          {mealCount.mealsPerWeek === 1 
            ? 'One meal per week' 
            : `${mealCount.mealsPerWeek} meals per week`}
        </p>
      </fieldset>

      {/* Meal Types Section */}
      <fieldset>
        <legend className='text-lg font-semibold text-primary-500 mb-4'>
          Which meal types?
        </legend>
        <p className='text-sage-600 text-sm mb-4'>Select the types of meals you want to plan</p>
        <div className='flex flex-wrap gap-3 justify-center'>
          {MEAL_TYPES.map(({ value, label }) => (
            <button
              key={value}
              type='button'
              onClick={() => handleMealTypeToggle(value)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                mealCount.mealTypes.includes(value)
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white text-sage-700 border-2 border-sage-200 hover:border-primary-300 hover:bg-primary-50'
              }`}
              aria-pressed={mealCount.mealTypes.includes(value)}
              aria-label={`${mealCount.mealTypes.includes(value) ? 'Selected' : 'Not selected'} ${label}`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className='text-sm text-sage-500 mt-2 text-center'>
          {mealCount.mealTypes.length === 0 
            ? 'No meal types selected' 
            : `${mealCount.mealTypes.length} meal type${mealCount.mealTypes.length !== 1 ? 's' : ''} selected`}
        </p>
      </fieldset>

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
