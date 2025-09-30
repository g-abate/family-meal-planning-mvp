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
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        calories_per_serving: 300,
        protein_per_serving: 20,
        carbs_per_serving: 30,
        fat_per_serving: 10,
        is_featured: false,
        is_active: true
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
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        is_active: true
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
        kind: 'protein',
        is_optional: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
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
        kind: 'seasoning',
        is_optional: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
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
        temperature: 350,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
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
        step_number: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
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
        tag_type: 'dietary',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
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
        is_featured: false
      };

      expect(summary.title).toBe('Test Recipe');
      expect(summary.total_time).toBe(45);
      expect(summary.difficulty).toBe('easy');
    });
  });

  describe('RecipeSearchResult Interface', () => {
    it('should have all required properties', () => {
      const searchResult: RecipeSearchResult = {
        recipes: [],
        total: 0,
        page: 1,
        limit: 10,
        hasMore: false
      };

      expect(searchResult.recipes).toEqual([]);
      expect(searchResult.total).toBe(0);
      expect(searchResult.page).toBe(1);
      expect(searchResult.limit).toBe(10);
      expect(searchResult.hasMore).toBe(false);
    });

    it('should handle pagination correctly', () => {
      const searchResult: RecipeSearchResult = {
        recipes: [],
        total: 25,
        page: 2,
        limit: 10,
        hasMore: true
      };

      expect(searchResult.hasMore).toBe(true);
      expect(searchResult.page).toBe(2);
    });
  });

  describe('DatabaseResult Interface', () => {
    it('should handle success result', () => {
      const successResult: DatabaseResult<string> = {
        success: true,
        data: 'test data',
        error: null
      };

      expect(successResult.success).toBe(true);
      expect(successResult.data).toBe('test data');
      expect(successResult.error).toBeNull();
    });

    it('should handle error result', () => {
      const errorResult: DatabaseResult<string> = {
        success: false,
        data: null,
        error: 'Database connection failed'
      };

      expect(errorResult.success).toBe(false);
      expect(errorResult.data).toBeNull();
      expect(errorResult.error).toBe('Database connection failed');
    });
  });

  describe('SearchOptions Interface', () => {
    it('should have all optional properties', () => {
      const searchOptions: SearchOptions = {
        query: 'chicken',
        difficulty: 'easy',
        maxPrepTime: 30,
        maxCookTime: 60,
        minServings: 2,
        maxServings: 8,
        dietaryTags: ['vegetarian'],
        excludeIngredients: ['mushrooms'],
        includeIngredients: ['chicken'],
        sortBy: 'prep_time',
        sortOrder: 'asc',
        page: 1,
        limit: 10
      };

      expect(searchOptions.query).toBe('chicken');
      expect(searchOptions.difficulty).toBe('easy');
      expect(searchOptions.dietaryTags).toEqual(['vegetarian']);
      expect(searchOptions.sortBy).toBe('prep_time');
    });

    it('should allow minimal search options', () => {
      const minimalOptions: SearchOptions = {};

      expect(minimalOptions.query).toBeUndefined();
      expect(minimalOptions.difficulty).toBeUndefined();
    });
  });

  describe('Type Compatibility', () => {
    it('should allow Recipe to be assigned to RecipeSummary', () => {
      const recipe: Recipe = {
        id: 1,
        title: 'Test Recipe',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        is_active: true
      };

      const summary: RecipeSummary = recipe;
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
    it('should handle null values in optional fields', () => {
      const recipe: Recipe = {
        id: 1,
        title: 'Test Recipe',
        prep_time: null,
        cook_time: null,
        total_time: null,
        servings: null,
        difficulty: null,
        image_url: null,
        source_url: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        calories_per_serving: null,
        protein_per_serving: null,
        carbs_per_serving: null,
        fat_per_serving: null,
        is_featured: false,
        is_active: true
      };

      expect(recipe.prep_time).toBeNull();
      expect(recipe.cook_time).toBeNull();
      expect(recipe.is_active).toBe(true);
    });

    it('should handle empty strings', () => {
      const recipe: Recipe = {
        id: 1,
        title: '',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        is_active: true
      };

      expect(recipe.title).toBe('');
    });
  });
});
