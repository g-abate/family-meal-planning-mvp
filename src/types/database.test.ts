// Unit tests for database.ts types
// Tests type definitions and interfaces

import { describe, it, expect } from 'vitest';
import type { 
  Recipe, 
  RecipeIngredient, 
  RecipeInstruction, 
  RecipeTag, 
  RecipeSummary,
  RecipeSearchResult,
  DatabaseResult,
  SearchOptions
} from './database';

describe('Database Types', () => {
  describe('Recipe Interface', () => {
    it('should have all required properties', () => {
      const recipe: Recipe = {
        id: 1,
        title: 'Test Recipe',
        prep_time: 15,
        cook_time: 30,
        total_time: 45,
        servings: 4,
        difficulty: 'easy',
        image_url: 'https://example.com/image.jpg',
        source_url: 'https://example.com/recipe',
        calories_per_serving: 300,
        protein_per_serving: 20,
        carbs_per_serving: 30,
        fat_per_serving: 10,
        is_featured: false,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      expect(recipe.id).toBe(1);
      expect(recipe.title).toBe('Test Recipe');
      expect(recipe.difficulty).toBe('easy');
      expect(recipe.is_active).toBe(true);
    });

    it('should allow optional properties to be undefined', () => {
      const recipe: Recipe = {
        id: 1,
        title: 'Minimal Recipe',
        servings: 4,
        difficulty: 'easy',
        is_featured: false,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      expect(recipe.prep_time).toBeUndefined();
      expect(recipe.cook_time).toBeUndefined();
      expect(recipe.calories_per_serving).toBeUndefined();
    });
  });

  describe('RecipeIngredient Interface', () => {
    it('should have all required properties', () => {
      const ingredient: RecipeIngredient = {
        id: 1,
        recipe_id: 1,
        ingredient_name: 'chicken breast',
        quantity: 2,
        unit: 'cups',
        sort_order: 1,
        kind: 'protein_main',
        is_optional: false,
      };

      expect(ingredient.ingredient_name).toBe('chicken breast');
      expect(ingredient.quantity).toBe(2);
      expect(ingredient.unit).toBe('cups');
      expect(ingredient.kind).toBe('protein');
    });

    it('should allow optional properties', () => {
      const ingredient: RecipeIngredient = {
        id: 1,
        recipe_id: 1,
        ingredient_name: 'salt',
        sort_order: 1,
        kind: 'spice',
        is_optional: false,
      };

      expect(ingredient.quantity).toBeUndefined();
      expect(ingredient.unit).toBeUndefined();
    });
  });

  describe('RecipeInstruction Interface', () => {
    it('should have all required properties', () => {
      const instruction: RecipeInstruction = {
        id: 1,
        recipe_id: 1,
        instruction: 'Heat oil in a large pan',
        step_number: 1,
        prep_time: 5,
        cook_time: 10,
        temperature: 350
      };

      expect(instruction.instruction).toBe('Heat oil in a large pan');
      expect(instruction.step_number).toBe(1);
      expect(instruction.prep_time).toBe(5);
      expect(instruction.cook_time).toBe(10);
      expect(instruction.temperature).toBe(350);
    });

    it('should allow optional time properties', () => {
      const instruction: RecipeInstruction = {
        id: 1,
        recipe_id: 1,
        instruction: 'Mix ingredients',
        step_number: 1
      };

      expect(instruction.prep_time).toBeUndefined();
      expect(instruction.cook_time).toBeUndefined();
      expect(instruction.temperature).toBeUndefined();
    });
  });

  describe('RecipeTag Interface', () => {
    it('should have all required properties', () => {
      const tag: RecipeTag = {
        id: 1,
        recipe_id: 1,
        tag_name: 'vegetarian',
        tag_type: 'dietary'
      };

      expect(tag.tag_name).toBe('vegetarian');
      expect(tag.tag_type).toBe('dietary');
    });
  });

  describe('RecipeSummary Interface', () => {
    it('should have all required properties', () => {
      const summary: RecipeSummary = {
        id: 1,
        title: 'Test Recipe',
        prep_time: 15,
        cook_time: 30,
        total_time: 45,
        servings: 4,
        difficulty: 'easy',
        image_url: 'https://example.com/image.jpg',
        is_featured: false,
        is_active: true,
        ingredient_count: 5
      };

      expect(summary.title).toBe('Test Recipe');
      expect(summary.total_time).toBe(45);
      expect(summary.difficulty).toBe('easy');
    });
  });

  describe('RecipeSearchResult Interface', () => {
    it('should have all required properties', () => {
      const searchResult: RecipeSearchResult = {
        recipe_id: 1,
        title: 'Test Recipe',
        description: 'A test recipe',
        ingredients: 'chicken, rice',
        instructions: 'Cook chicken and rice',
        tags: 'dinner, easy',
        rank: 0.5
      };

      expect(searchResult.recipe_id).toBe(1);
      expect(searchResult.title).toBe('Test Recipe');
      expect(searchResult.rank).toBe(0.5);
    });

    it('should handle optional properties', () => {
      const searchResult: RecipeSearchResult = {
        recipe_id: 1,
        title: 'Minimal Recipe',
        rank: 0.8
      };

      expect(searchResult.description).toBeUndefined();
      expect(searchResult.ingredients).toBeUndefined();
    });
  });

  describe('DatabaseResult Interface', () => {
    it('should handle success result', () => {
      const successResult: DatabaseResult<string> = {
        success: true,
        data: 'test data'
      };

      expect(successResult.success).toBe(true);
      expect(successResult.data).toBe('test data');
      expect(successResult.error).toBeUndefined();
    });

    it('should handle error result', () => {
      const errorResult: DatabaseResult<string> = {
        success: false,
        error: {
          code: 'CONNECTION_FAILED',
          message: 'Database connection failed'
        }
      };

      expect(errorResult.success).toBe(false);
      expect(errorResult.data).toBeUndefined();
      expect(errorResult.error?.message).toBe('Database connection failed');
    });
  });

  describe('SearchOptions Interface', () => {
    it('should have all optional properties', () => {
      const searchOptions: SearchOptions = {
        query: 'chicken',
        difficulty: ['easy'],
        maxPrepTime: 30,
        maxCookTime: 60,
        maxTotalTime: 90,
        dietaryTags: ['vegetarian']
      };

      expect(searchOptions.query).toBe('chicken');
      expect(searchOptions.difficulty).toEqual(['easy']);
      expect(searchOptions.dietaryTags).toEqual(['vegetarian']);
    });

    it('should allow minimal search options', () => {
      const minimalOptions: SearchOptions = {
        query: ''
      };

      expect(minimalOptions.query).toBe('');
      expect(minimalOptions.difficulty).toBeUndefined();
    });
  });

  describe('Type Compatibility', () => {
    it('should allow Recipe to be assigned to RecipeSummary', () => {
      const recipe: Recipe = {
        id: 1,
        title: 'Test Recipe',
        servings: 4,
        difficulty: 'easy',
        is_featured: false,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      const summary: RecipeSummary = {
        ...recipe,
        ingredient_count: 5
      };
      expect(summary.title).toBe('Test Recipe');
    });

    it('should handle array types correctly', () => {
      const recipes: Recipe[] = [];
      const ingredients: RecipeIngredient[] = [];
      const instructions: RecipeInstruction[] = [];
      const tags: RecipeTag[] = [];

      expect(Array.isArray(recipes)).toBe(true);
      expect(Array.isArray(ingredients)).toBe(true);
      expect(Array.isArray(instructions)).toBe(true);
      expect(Array.isArray(tags)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined values in optional fields', () => {
      const recipe: Recipe = {
        id: 1,
        title: 'Test Recipe',
        servings: 4,
        difficulty: 'easy',
        is_featured: false,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        calories_per_serving: undefined,
        protein_per_serving: undefined,
        carbs_per_serving: undefined,
        fat_per_serving: undefined
      };

      expect(recipe.prep_time).toBeUndefined();
      expect(recipe.cook_time).toBeUndefined();
      expect(recipe.is_active).toBe(true);
    });

    it('should handle empty strings', () => {
      const recipe: Recipe = {
        id: 1,
        title: '',
        servings: 4,
        difficulty: 'easy',
        is_featured: false,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      expect(recipe.title).toBe('');
    });
  });
});
