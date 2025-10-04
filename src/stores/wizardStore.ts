// Zustand store for wizard state management
// Version: 1.0

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  WizardState,
  MealCountStep,
  IngredientsStep,
  DietaryStep,
  PrepStyleStep,
} from '../types/wizard';

interface WizardStore extends WizardState {
  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeWizard: () => void;
  resetWizard: () => void;

  // Step data setters
  setMealCount: (data: Partial<MealCountStep>) => void;
  setIngredients: (data: Partial<IngredientsStep>) => void;
  setDietary: (data: Partial<DietaryStep>) => void;
  setPrepStyle: (data: Partial<PrepStyleStep>) => void;

  // Validation
  isStepValid: (step: number) => boolean;
  canProceed: () => boolean;
}

const initialWizardState: WizardState = {
  currentStep: 1,
  totalSteps: 4,
  isCompleted: false,
  mealCount: {
    mealsPerWeek: 5,
    mealTypes: ['lunch', 'dinner'],
  },
  ingredients: {
    availableProteins: [],
    availableVegetables: [],
    availableStarches: [],
  },
  dietary: {
    restrictions: [],
  },
  prepStyle: {
    sessionsPerWeek: 2,
    sessionDuration: '2h',
  },
};

export const useWizardStore = create<WizardStore>()(
  persist(
    (set, get) => ({
      ...initialWizardState,

      setCurrentStep: (step: number) => {
        if (step >= 1 && step <= get().totalSteps) {
          set({ currentStep: step });
        }
      },

      nextStep: () => {
        const { currentStep, totalSteps, isStepValid } = get();
        if (currentStep < totalSteps && isStepValid(currentStep)) {
          set({ currentStep: currentStep + 1 });
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      completeWizard: () => {
        set({ isCompleted: true });
      },

      resetWizard: () => {
        set(initialWizardState);
      },

      setMealCount: data => {
        set(state => ({
          mealCount: { ...state.mealCount, ...data },
        }));
      },

      setIngredients: data => {
        set(state => ({
          ingredients: { ...state.ingredients, ...data },
        }));
      },

      setDietary: data => {
        set(state => ({
          dietary: { ...state.dietary, ...data },
        }));
      },

      setPrepStyle: data => {
        set(state => ({
          prepStyle: { ...state.prepStyle, ...data },
        }));
      },

      isStepValid: (step: number) => {
        const state = get();
        switch (step) {
          case 1: // Meal Count
            return (
              state.mealCount.mealsPerWeek > 0 &&
              state.mealCount.mealTypes.length > 0
            );
          case 2: // Ingredients
            // Ingredients are optional, so step is always valid
            return true;
          case 3: // Dietary
            // Dietary restrictions are optional, so step is always valid
            return true;
          case 4: // Prep Style
            return (
              state.prepStyle.sessionsPerWeek > 0 &&
              state.prepStyle.sessionsPerWeek <= 5 &&
              state.prepStyle.sessionDuration !== undefined
            );
          default:
            return false;
        }
      },

      canProceed: () => {
        const { currentStep, isStepValid } = get();
        return isStepValid(currentStep);
      },
    }),
    {
      name: 'meal-planning-wizard',
      // Persist form data and navigation state
      partialize: state => ({
        currentStep: state.currentStep,
        mealCount: state.mealCount,
        ingredients: state.ingredients,
        dietary: state.dietary,
        prepStyle: state.prepStyle,
        isCompleted: state.isCompleted,
      }),
    }
  )
);
