// Wizard types and interfaces for meal planning setup
// Version: 1.0

export type MealType = 'breakfast' | 'lunch' | 'dinner';
export type DietaryRestriction =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'nut-free'
  | 'dairy-free'
  | 'keto'
  | 'paleo'
  | 'low-carb'
  | 'high-protein'
  | 'mediterranean';

export type PrepDuration = '1h' | '1.5h' | '2h' | '3h';

export interface WizardStep {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  isAccessible: boolean;
}

export interface MealCountStep {
  mealsPerWeek: number;
  mealTypes: MealType[];
}

export interface IngredientsStep {
  availableProteins: string[];
  availableVegetables: string[];
}

export interface DietaryStep {
  restrictions: DietaryRestriction[];
}

export interface PrepStyleStep {
  sessionsPerWeek: number;
  sessionDuration: PrepDuration;
}

export interface WizardState {
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  mealCount: MealCountStep;
  ingredients: IngredientsStep;
  dietary: DietaryStep;
  prepStyle: PrepStyleStep;
}

export interface WizardFormData {
  mealsPerWeek: number;
  mealTypes: MealType[];
  availableProteins: string[];
  availableVegetables: string[];
  restrictions: DietaryRestriction[];
  sessionsPerWeek: number;
  sessionDuration: PrepDuration;
}

// Available options for the wizard
export const AVAILABLE_PROTEINS = [
  'Chicken',
  'Beef',
  'Pork',
  'Fish',
  'Tofu',
  'Beans',
  'Eggs',
  'Turkey',
  'Lamb',
  'Shrimp',
] as const;

export const AVAILABLE_VEGETABLES = [
  'Broccoli',
  'Carrots',
  'Bell Peppers',
  'Onions',
  'Garlic',
  'Spinach',
  'Tomatoes',
  'Zucchini',
  'Mushrooms',
  'Green Beans',
  'Asparagus',
  'Brussels Sprouts',
  'Cauliflower',
  'Sweet Potatoes',
  'Potatoes',
] as const;

export const DIETARY_RESTRICTIONS: DietaryRestriction[] = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'nut-free',
  'dairy-free',
  'keto',
  'paleo',
  'low-carb',
  'high-protein',
  'mediterranean',
];

export const PREP_DURATIONS: { value: PrepDuration; label: string }[] = [
  { value: '1h', label: '1h' },
  { value: '1.5h', label: '1.5h 30m' },
  { value: '2h', label: '2h' },
  { value: '3h', label: '3h' },
];

export const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
];

// Wizard validation
export interface WizardValidation {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export interface StepValidation {
  isValid: boolean;
  errors: string[];
}
