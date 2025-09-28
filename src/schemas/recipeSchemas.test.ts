// Unit tests for Zod schemas
// Version: 1.0

import { describe, it, expect } from 'vitest';
import {
  RecipeSchema,
  RecipeIngredientSchema,
  RecipeInstructionSchema,
  CompleteRecipeSchema,
  UserPreferencesSchema,
  MealPlanSchema,
  WizardFormSchema,
  SearchOptionsSchema
} from './recipeSchemas';

describe('Recipe Schemas', () => {
  describe('RecipeSchema', () => {
    it('should validate a valid recipe', () => {
      const validRecipe = {
        title: 'Test Recipe',
        description: 'A test recipe',
        prep_time: 15,
        cook_time: 30,
        servings: 4,
        difficulty: 'easy' as const,
        is_featured: false,
        is_active: true
      };

      const result = RecipeSchema.safeParse(validRecipe);
      expect(result.success).toBe(true);
    });

    it('should reject recipe without title', () => {
      const invalidRecipe = {
        description: 'A test recipe',
        servings: 4
      };

      const result = RecipeSchema.safeParse(invalidRecipe);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Required');
      }
    });

    it('should set default values', () => {
      const minimalRecipe = {
        title: 'Minimal Recipe'
      };

      const result = RecipeSchema.parse(minimalRecipe);
      expect(result.servings).toBe(1);
      expect(result.difficulty).toBe('easy');
      expect(result.is_featured).toBe(false);
      expect(result.is_active).toBe(true);
    });
  });

  describe('RecipeIngredientSchema', () => {
    it('should validate ingredient with classification', () => {
      const validIngredient = {
        ingredient_name: 'Chicken breast',
        quantity: 2,
        unit: 'lbs',
        kind: 'protein_main' as const,
        sort_order: 1
      };

      const result = RecipeIngredientSchema.safeParse(validIngredient);
      expect(result.success).toBe(true);
    });

    it('should default to "other" kind when not specified', () => {
      const ingredient = {
        ingredient_name: 'Salt',
        quantity: 1,
        unit: 'tsp'
      };

      const result = RecipeIngredientSchema.parse(ingredient);
      expect(result.kind).toBe('other');
    });
  });

  describe('CompleteRecipeSchema', () => {
    it('should validate complete recipe with ingredients and instructions', () => {
      const completeRecipe = {
        title: 'Complete Test Recipe',
        ingredients: [
          {
            ingredient_name: 'Chicken',
            quantity: 1,
            unit: 'lb',
            kind: 'protein_main' as const
          }
        ],
        instructions: [
          {
            step_number: 1,
            instruction: 'Cook the chicken'
          }
        ]
      };

      const result = CompleteRecipeSchema.safeParse(completeRecipe);
      expect(result.success).toBe(true);
    });

    it('should reject recipe without ingredients', () => {
      const incompleteRecipe = {
        title: 'Incomplete Recipe',
        instructions: [
          {
            step_number: 1,
            instruction: 'Do something'
          }
        ]
      };

      const result = CompleteRecipeSchema.safeParse(incompleteRecipe);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Required');
      }
    });
  });

  describe('UserPreferencesSchema', () => {
    it('should validate user preferences with defaults', () => {
      const preferences = {
        dietaryTags: ['vegetarian' as const],
        prepSessions: 3,
        sessionDuration: 90
      };

      const result = UserPreferencesSchema.parse(preferences);
      expect(result.dietaryTags).toEqual(['vegetarian']);
      expect(result.prepSessions).toBe(3);
      expect(result.sessionDuration).toBe(90);
      expect(result.defaultMealCount).toBe(5); // default
      expect(result.defaultMealTypes).toEqual(['dinner']); // default
    });

    it('should enforce prep session limits', () => {
      const invalidPreferences = {
        prepSessions: 10 // exceeds max of 5
      };

      const result = UserPreferencesSchema.safeParse(invalidPreferences);
      expect(result.success).toBe(false);
    });
  });

  describe('MealPlanSchema', () => {
    it('should validate meal plan with proper date format', () => {
      const mealPlan = {
        name: 'Week 1 Plan',
        weekStartDate: '2024-01-15',
        mealCount: 7,
        mealTypes: ['lunch' as const, 'dinner' as const]
      };

      const result = MealPlanSchema.safeParse(mealPlan);
      expect(result.success).toBe(true);
    });

    it('should reject invalid date format', () => {
      const mealPlan = {
        name: 'Invalid Date Plan',
        weekStartDate: '15/01/2024' // wrong format
      };

      const result = MealPlanSchema.safeParse(mealPlan);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid date format (YYYY-MM-DD)');
      }
    });
  });

  describe('WizardFormSchema', () => {
    it('should validate complete wizard form', () => {
      const wizardForm = {
        step1: {
          mealCount: 5,
          mealTypes: ['dinner' as const]
        },
        step2: {
          availableProteins: ['chicken', 'beef'],
          availableVegetables: ['carrots', 'broccoli'],
          favoriteIngredients: ['garlic'],
          dislikedIngredients: ['cilantro']
        },
        step3: {
          dietaryTags: ['vegetarian' as const],
          restrictions: ['gluten-free']
        },
        step4: {
          prepSessions: 2,
          sessionDuration: 120
        }
      };

      const result = WizardFormSchema.safeParse(wizardForm);
      expect(result.success).toBe(true);
    });

    it('should require at least one meal type', () => {
      const invalidWizardForm = {
        step1: {
          mealCount: 5,
          mealTypes: [] // empty array
        },
        step2: {
          availableProteins: ['chicken'],
          availableVegetables: ['carrots']
        },
        step3: {
          dietaryTags: []
        },
        step4: {
          prepSessions: 2,
          sessionDuration: 120
        }
      };

      const result = WizardFormSchema.safeParse(invalidWizardForm);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('At least one meal type is required');
      }
    });
  });

  describe('SearchOptionsSchema', () => {
    it('should validate search options with defaults', () => {
      const searchOptions = {
        query: 'chicken recipes'
      };

      const result = SearchOptionsSchema.parse(searchOptions);
      expect(result.query).toBe('chicken recipes');
      expect(result.limit).toBe(20); // default
      expect(result.offset).toBe(0); // default
      expect(result.orderDirection).toBe('ASC'); // default
    });

    it('should enforce search query requirements', () => {
      const invalidSearchOptions = {
        query: '' // empty query
      };

      const result = SearchOptionsSchema.safeParse(invalidSearchOptions);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Search query is required');
      }
    });

    it('should validate dietary tags array', () => {
      const searchOptions = {
        query: 'vegetarian',
        dietaryTags: ['vegetarian' as const, 'vegan' as const]
      };

      const result = SearchOptionsSchema.safeParse(searchOptions);
      expect(result.success).toBe(true);
    });
  });
});
