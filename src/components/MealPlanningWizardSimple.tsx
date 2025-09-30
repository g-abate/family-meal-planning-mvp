import { useState } from 'react';

interface MealPlanningWizardSimpleProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MealPlanningWizardSimple({
  isOpen,
  onClose,
}: MealPlanningWizardSimpleProps) {
  const [currentStep] = useState(1);
  const [mealsPerWeek, setMealsPerWeek] = useState(5);
  const [mealTypes, setMealTypes] = useState<string[]>(['lunch', 'dinner']);

  if (!isOpen) return null;

  const handleMealTypeToggle = (mealType: string) => {
    const newTypes = mealTypes.includes(mealType)
      ? mealTypes.filter(type => type !== mealType)
      : [...mealTypes, mealType];
    setMealTypes(newTypes);
  };

  const handleMealCountChange = (delta: number) => {
    const newCount = mealsPerWeek + delta;
    if (newCount >= 1 && newCount <= 21) {
      setMealsPerWeek(newCount);
    }
  };

  const canProceed = mealsPerWeek > 0 && mealTypes.length > 0;

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in'>
      <div
        className='card-luxury max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in'
        role='dialog'
        aria-labelledby='wizard-title'
        aria-describedby='wizard-description'
      >
        {/* Header */}
        <div className='card-header border-b border-sage-100'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={onClose}
                className='p-2 rounded-lg hover:bg-sage-50 transition-colors'
                aria-label='Close wizard'
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
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </button>
              <div>
                <h1
                  id='wizard-title'
                  className='text-2xl font-semibold text-primary-500'
                >
                  Plan Your Meals
                </h1>
                <p id='wizard-description' className='text-sage-600'>
                  Let's create your perfect weekly meal plan
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className='p-2 rounded-lg hover:bg-sage-50 transition-colors'
              aria-label='Close wizard'
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
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          {/* Progress Section */}
          <div className='mt-6'>
            <div className='flex items-center justify-between mb-2'>
              <h2 className='text-xl font-semibold text-primary-500'>
                Quick Setup
              </h2>
              <div className='flex items-center space-x-2'>
                <svg
                  className='w-4 h-4 text-primary-500'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
                <span className='text-sm text-sage-600'>
                  Step {currentStep} of 4
                </span>
              </div>
            </div>

            <div className='mb-2'>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-primary-500'>
                  Meal Count
                </span>
                <span className='text-sm text-sage-600'>25% complete</span>
              </div>
              <div className='w-full bg-sage-100 rounded-full h-2 mt-1'>
                <div
                  className='bg-primary-500 h-2 rounded-full transition-all duration-300 ease-out'
                  style={{ width: '25%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='card-body overflow-y-auto'>
          <div className='max-w-2xl mx-auto'>
            <div className='text-center mb-8'>
              <h3 className='text-2xl font-semibold text-primary-500 mb-2'>
                Meal Count
              </h3>
              <p className='text-lg text-sage-600'>
                How many meals do you need this week?
              </p>
            </div>

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
                    disabled={mealsPerWeek <= 1}
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
                      {mealsPerWeek}
                    </span>
                  </div>

                  <button
                    onClick={() => handleMealCountChange(1)}
                    className='w-12 h-12 bg-sage-100 hover:bg-sage-200 rounded-lg flex items-center justify-center transition-colors'
                    disabled={mealsPerWeek >= 21}
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
                  {[
                    { value: 'breakfast', label: 'Breakfast' },
                    { value: 'lunch', label: 'Lunch' },
                    { value: 'dinner', label: 'Dinner' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleMealTypeToggle(value)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        mealTypes.includes(value)
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'bg-white text-sage-700 border-2 border-sage-200 hover:border-primary-300 hover:bg-primary-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='card-footer border-t border-sage-100 bg-sage-50'>
          <div className='flex justify-between items-center'>
            <button
              disabled={currentStep === 1}
              className='btn btn-secondary btn-md disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <svg
                className='w-4 h-4 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
              Back
            </button>

            <div className='flex space-x-2'>
              <button onClick={onClose} className='btn btn-secondary btn-md'>
                Close
              </button>
              <button
                disabled={!canProceed}
                className='btn btn-primary btn-md disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Continue
                <svg
                  className='w-4 h-4 ml-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
