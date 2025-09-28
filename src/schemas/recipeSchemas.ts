// Zod schemas for recipe and meal plan validation
// Used for form validation and data integrity
// Version: 1.0

import { z } from 'zod';

// Ingredient classification enum
export const IngredientKind = z.enum([
  'protein_main',
  'protein_source', 
  'vegetable',
  'grain',
  'dairy',
  'fat',
  'spice',
  'other'
]);

// Dietary tag enum
export const DietaryTag = z.enum([
  'vegetarian',
  'vegan',
  'pescatarian',
  'gluten-free',
  'dairy-free',
  'keto',
  'paleo'
]);

// Recipe difficulty enum
export const RecipeDifficulty = z.enum(['easy', 'medium', 'hard']);

// Meal type enum
export const MealType = z.enum(['breakfast', 'lunch', 'dinner', 'snack']);

// Recipe ingredient schema
export const RecipeIngredientSchema = z.object({
  id: z.number().optional(),
  recipe_id: z.number().optional(),
  ingredient_name: z.string().min(1, 'Ingredient name is required').max(100),
  quantity: z.number().positive().optional(),
  unit: z.string().max(20).optional(),
  notes: z.string().max(200).optional(),
  is_optional: z.boolean().default(false),
  sort_order: z.number().int().min(0).default(0),
  kind: IngredientKind.default('other')
});

// Recipe instruction schema
export const RecipeInstructionSchema = z.object({
  id: z.number().optional(),
  recipe_id: z.number().optional(),
  step_number: z.number().int().min(1),
  instruction: z.string().min(1, 'Instruction is required').max(500),
  prep_time: z.number().int().min(0).max(120).optional(), // minutes
  cook_time: z.number().int().min(0).max(480).optional(), // minutes
  temperature: z.number().int().min(0).max(500).optional(), // degrees F
  notes: z.string().max(200).optional()
});

// Recipe tag schema
export const RecipeTagSchema = z.object({
  id: z.number().optional(),
  recipe_id: z.number().optional(),
  tag_name: z.string().min(1).max(50),
  tag_type: z.enum(['dietary', 'category', 'cuisine', 'cooking_method'])
});

// Main recipe schema
export const RecipeSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, 'Recipe title is required').max(100),
  description: z.string().max(500).optional(),
  prep_time: z.number().int().min(0).max(120).optional(), // minutes
  cook_time: z.number().int().min(0).max(480).optional(), // minutes
  total_time: z.number().int().min(0).max(600).optional(), // minutes
  servings: z.number().int().min(1).max(20).default(1),
  difficulty: RecipeDifficulty.default('easy'),
  image_url: z.string().url().optional().or(z.literal('')),
  source_url: z.string().url().optional().or(z.literal('')),
  calories_per_serving: z.number().int().min(0).max(2000).optional(),
  protein_per_serving: z.number().min(0).max(200).optional(), // grams
  carbs_per_serving: z.number().min(0).max(200).optional(), // grams
  fat_per_serving: z.number().min(0).max(200).optional(), // grams
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
});

// Complete recipe with ingredients and instructions
export const CompleteRecipeSchema = RecipeSchema.extend({
  ingredients: z.array(RecipeIngredientSchema).min(1, 'At least one ingredient is required'),
  instructions: z.array(RecipeInstructionSchema).min(1, 'At least one instruction is required'),
  tags: z.array(RecipeTagSchema).optional()
});

// User preferences schema
export const UserPreferencesSchema = z.object({
  id: z.number().optional(),
  dietaryTags: z.array(DietaryTag).default([]),
  prepSessions: z.number().int().min(1).max(5).default(2),
  sessionDuration: z.number().int().min(30).max(180).default(120), // minutes
  defaultMealCount: z.number().int().min(1).max(14).default(5),
  defaultMealTypes: z.array(MealType).default(['dinner']),
  favoriteIngredients: z.array(z.string().min(1)).default([]),
  dislikedIngredients: z.array(z.string().min(1)).default([]),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

// Meal plan schema
export const MealPlanSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Meal plan name is required').max(100),
  weekStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  mealCount: z.number().int().min(1).max(14).default(5),
  mealTypes: z.array(MealType).default(['dinner']),
  dietaryTags: z.array(DietaryTag).default([]),
  prepSessions: z.number().int().min(1).max(5).default(2),
  sessionDuration: z.number().int().min(30).max(180).default(120), // minutes
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

// Planned meal schema
export const PlannedMealSchema = z.object({
  id: z.number().optional(),
  mealPlanId: z.number(),
  dayOfWeek: z.number().int().min(0).max(6), // 0 = Sunday, 1 = Monday, etc.
  mealType: MealType,
  recipeId: z.number(),
  recipeTitle: z.string().min(1),
  prepTime: z.number().int().min(0).optional(),
  cookTime: z.number().int().min(0).optional(),
  totalTime: z.number().int().min(0).optional(),
  servings: z.number().int().min(1).default(1),
  difficulty: RecipeDifficulty,
  isSwapped: z.boolean().default(false),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

// Prep session schema
export const PrepSessionSchema = z.object({
  id: z.number().optional(),
  mealPlanId: z.number(),
  sessionNumber: z.number().int().min(1).max(5),
  duration: z.number().int().min(30).max(180), // minutes
  tasks: z.array(z.any()).default([]), // Will be defined separately
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

// Prep task schema
export const PrepTaskSchema = z.object({
  id: z.number().optional(),
  prepSessionId: z.number(),
  taskDescription: z.string().min(1, 'Task description is required').max(200),
  estimatedTime: z.number().int().min(1).max(60), // minutes
  isCompleted: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
  relatedRecipeId: z.number().optional(),
  relatedMealId: z.number().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

// Search options schema
export const SearchOptionsSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100),
  dietaryTags: z.array(DietaryTag).optional(),
  difficulty: z.array(RecipeDifficulty).optional(),
  maxPrepTime: z.number().int().min(0).max(120).optional(),
  maxCookTime: z.number().int().min(0).max(480).optional(),
  maxTotalTime: z.number().int().min(0).max(600).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
  orderDirection: z.enum(['ASC', 'DESC']).default('ASC')
});

// Form validation schemas for wizard steps
export const WizardStep1Schema = z.object({
  mealCount: z.number().int().min(1).max(14).default(5),
  mealTypes: z.array(MealType).min(1, 'At least one meal type is required').default(['dinner'])
});

export const WizardStep2Schema = z.object({
  availableProteins: z.array(z.string().min(1)).min(1, 'At least one protein is required'),
  availableVegetables: z.array(z.string().min(1)).min(1, 'At least one vegetable is required'),
  favoriteIngredients: z.array(z.string().min(1)).default([]),
  dislikedIngredients: z.array(z.string().min(1)).default([])
});

export const WizardStep3Schema = z.object({
  dietaryTags: z.array(DietaryTag).default([]),
  restrictions: z.array(z.string()).default([])
});

export const WizardStep4Schema = z.object({
  prepSessions: z.number().int().min(1).max(5).default(2),
  sessionDuration: z.number().int().min(30).max(180).default(120)
});

// Complete wizard form schema
export const WizardFormSchema = z.object({
  step1: WizardStep1Schema,
  step2: WizardStep2Schema,
  step3: WizardStep3Schema,
  step4: WizardStep4Schema
});

// Export types
export type RecipeIngredient = z.infer<typeof RecipeIngredientSchema>;
export type RecipeInstruction = z.infer<typeof RecipeInstructionSchema>;
export type RecipeTag = z.infer<typeof RecipeTagSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;
export type CompleteRecipe = z.infer<typeof CompleteRecipeSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type MealPlan = z.infer<typeof MealPlanSchema>;
export type PlannedMeal = z.infer<typeof PlannedMealSchema>;
export type PrepSession = z.infer<typeof PrepSessionSchema>;
export type PrepTask = z.infer<typeof PrepTaskSchema>;
export type SearchOptions = z.infer<typeof SearchOptionsSchema>;
export type WizardStep1 = z.infer<typeof WizardStep1Schema>;
export type WizardStep2 = z.infer<typeof WizardStep2Schema>;
export type WizardStep3 = z.infer<typeof WizardStep3Schema>;
export type WizardStep4 = z.infer<typeof WizardStep4Schema>;
export type WizardForm = z.infer<typeof WizardFormSchema>;
