import { useEffect, useRef, useCallback } from 'react';
import { useWizardStore } from '../stores/wizardStore';
import { MealCountStep } from './wizard-steps/MealCountStep';
import { IngredientsStep } from './wizard-steps/IngredientsStep';
import { DietaryStep } from './wizard-steps/DietaryStep';
import { PrepStyleStep } from './wizard-steps/PrepStyleStep';

interface MealPlanningWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function MealPlanningWizard({
  isOpen,
  onClose,
  onComplete,
}: MealPlanningWizardProps) {
  const { currentStep, totalSteps, nextStep, previousStep, canProceed, resetWizard, completeWizard } =
    useWizardStore();

  const firstInputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    resetWizard();
    onClose();
  }, [resetWizard, onClose]);

  // Focus first input when wizard opens
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        handleClose();
      } else if (event.key === 'Enter' && canProceed()) {
        if (currentStep < totalSteps) {
          nextStep();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, totalSteps, canProceed, nextStep, handleClose]);

  if (!isOpen) return null;

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Meal Count';
      case 2:
        return 'Ingredients';
      case 3:
        return 'Dietary Needs';
      case 4:
        return 'Prep Style';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return 'How many meals do you need this week?';
      case 2:
        return 'What proteins, vegetables, and starches do you have?';
      case 3:
        return 'Any dietary restrictions to consider?';
      case 4:
        return 'How do you prefer to prep meals?';
      default:
        return '';
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <MealCountStep ref={firstInputRef} />;
      case 2:
        return <IngredientsStep ref={firstInputRef} />;
      case 3:
        return <DietaryStep ref={firstInputRef} />;
      case 4:
        return <PrepStyleStep ref={firstInputRef} />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps && canProceed()) {
      nextStep();
    } else if (currentStep === totalSteps && canProceed()) {
      // Wizard completed
      completeWizard();
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      previousStep();
    }
  };

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in'>
      <div
        className='card-luxury max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in flex flex-col'
        role='dialog'
        aria-modal='true'
        aria-labelledby='wizard-title'
        aria-describedby='wizard-description'
        aria-hidden='false'
      >
        {/* Header */}
        <div className='card-header border-b border-sage-100'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className='p-2 rounded-lg hover:bg-sage-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                aria-label='Go back'
                tabIndex={1}
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
              onClick={handleClose}
              className='p-2 rounded-lg hover:bg-sage-50 transition-colors'
              aria-label='Close wizard'
              tabIndex={2}
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
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
            </div>

            <div className='mb-2'>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-primary-500'>
                  {getStepTitle()}
                </span>
                <span className='text-sm text-sage-600'>
                  {Math.round(progress)}% complete
                </span>
              </div>
              <div className='w-full bg-sage-100 rounded-full h-2 mt-1'>
                <div
                  className='bg-primary-500 h-2 rounded-full transition-all duration-300 ease-out'
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='card-body flex-1 overflow-y-auto' role='main' aria-live='polite'>
          <div className='max-w-2xl mx-auto'>
            <div className='text-center mb-8'>
              <h3 className='text-2xl font-semibold text-primary-500 mb-2' id='step-title'>
                {getStepTitle()}
              </h3>
              <p className='text-lg text-sage-600' id='step-description'>{getStepDescription()}</p>
            </div>

            <div role='form' aria-labelledby='step-title' aria-describedby='step-description'>
              {renderStepContent()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='card-footer border-t border-sage-100 bg-sage-50'>
          <div className='flex justify-between items-center'>
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className='btn btn-secondary btn-md disabled:opacity-50 disabled:cursor-not-allowed'
              tabIndex={3}
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

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className='btn btn-primary btn-md disabled:opacity-50 disabled:cursor-not-allowed'
              tabIndex={4}
            >
              {currentStep === totalSteps ? 'Create Meal Plan' : 'Continue'}
              {currentStep !== totalSteps && (
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
              )}
              {currentStep === totalSteps && (
                <svg
                  className='w-4 h-4 ml-2'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
