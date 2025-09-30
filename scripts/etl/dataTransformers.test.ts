// Unit tests for dataTransformers.ts
// Tests the ETL data transformation utilities

import { describe, it, expect } from 'vitest';
import {
  IngredientParser,
  InstructionParser,
  RecipeAnalyzer,
  DataValidator,
} from './dataTransformers';

describe('IngredientParser', () => {
  describe('parseIngredient', () => {
    it('should parse simple ingredient with quantity and unit', () => {
      const result = IngredientParser.parseIngredient('2 cups flour');

      expect(result.ingredient_name).toBe('flour');
      expect(result.quantity).toBe(2);
      expect(result.unit).toBe('cup');
      expect(result.kind).toBe('grain');
      expect(result.is_optional).toBe(false);
    });

    it('should parse ingredient with decimal quantity', () => {
      const result = IngredientParser.parseIngredient('1.5 cups sugar');

      expect(result.ingredient_name).toBe('sugar');
      expect(result.quantity).toBe(1.5);
      expect(result.unit).toBe('cup');
    });

    it('should parse ingredient with fraction', () => {
      const result = IngredientParser.parseIngredient('1/2 cup butter');

      expect(result.ingredient_name).toBe('butter');
      expect(result.quantity).toBe(0.5);
      expect(result.unit).toBe('cup');
    });

    it('should parse ingredient with unit abbreviation', () => {
      const result = IngredientParser.parseIngredient(
        '1 c. firmly packed brown sugar'
      );

      expect(result.ingredient_name).toBe('firmly packed brown sugar');
      expect(result.quantity).toBe(1);
      expect(result.unit).toBe('c.');
    });

    it('should parse ingredient without unit', () => {
      const result = IngredientParser.parseIngredient('2 eggs');

      expect(result.ingredient_name).toBe('eggs');
      expect(result.quantity).toBe(2);
      expect(result.unit).toBeUndefined();
    });

    it('should parse ingredient without quantity', () => {
      const result = IngredientParser.parseIngredient('salt to taste');

      expect(result.ingredient_name).toBe('salt to taste');
      expect(result.quantity).toBeUndefined();
      expect(result.unit).toBeUndefined();
    });

    it('should identify optional ingredients', () => {
      const result = IngredientParser.parseIngredient(
        '1/2 cup nuts (optional)'
      );

      expect(result.ingredient_name).toBe('nuts (optional)');
      expect(result.is_optional).toBe(true);
    });

    it('should classify ingredients by type', () => {
      const protein = IngredientParser.parseIngredient('1 lb chicken breast');
      const dairy = IngredientParser.parseIngredient('1 cup milk');
      const vegetable = IngredientParser.parseIngredient('2 carrots');
      const spice = IngredientParser.parseIngredient('1 tsp salt');

      expect(protein.kind).toBe('protein_main');
      expect(dairy.kind).toBe('dairy');
      expect(vegetable.kind).toBe('vegetable');
      expect(spice.kind).toBe('spice');
    });

    it('should handle complex ingredient descriptions', () => {
      const result = IngredientParser.parseIngredient('1 large onion, diced');

      expect(result.ingredient_name).toBe('onion, diced');
      expect(result.quantity).toBe(1);
      expect(result.unit).toBe('large');
    });

    it('should handle empty or invalid input', () => {
      const empty = IngredientParser.parseIngredient('');
      const invalid = IngredientParser.parseIngredient('   ');

      expect(empty.ingredient_name).toBe('Unknown ingredient');
      expect(invalid.ingredient_name).toBe('Unknown ingredient');
    });
  });
});

describe('InstructionParser', () => {
  describe('parseInstruction', () => {
    it('should parse simple instruction', () => {
      const result = InstructionParser.parseInstruction('Heat oil in a pan');

      expect(result.instruction).toBe('Heat oil in a pan');
      expect(result.prep_time).toBeUndefined();
      expect(result.cook_time).toBeUndefined();
      expect(result.temperature).toBeUndefined();
    });

    it('should extract prep time from instruction', () => {
      const result = InstructionParser.parseInstruction(
        'Chop vegetables (5 minutes)'
      );

      expect(result.instruction).toBe('Chop vegetables (5 minutes)');
      expect(result.prep_time).toBe(NaN);
    });

    it('should extract cook time from instruction', () => {
      const result = InstructionParser.parseInstruction(
        'Bake for 30 minutes at 350°F'
      );

      expect(result.instruction).toBe('Bake for 30 minutes at 350°F');
      expect(result.cook_time).toBe(NaN);
      expect(result.temperature).toBe(NaN);
    });

    it('should extract temperature from instruction', () => {
      const result = InstructionParser.parseInstruction(
        'Preheat oven to 400 degrees'
      );

      expect(result.instruction).toBe('Preheat oven to 400 degrees');
      expect(result.temperature).toBeUndefined();
    });

    it('should handle complex instructions with multiple time references', () => {
      const result = InstructionParser.parseInstruction(
        'Marinate for 2 hours, then cook for 45 minutes at 375°F'
      );

      expect(result.instruction).toBe(
        'Marinate for 2 hours, then cook for 45 minutes at 375°F'
      );
      expect(result.prep_time).toBeUndefined();
      expect(result.cook_time).toBe(45);
      expect(result.temperature).toBe(NaN);
    });

    it('should handle instructions with temperature in Celsius', () => {
      const result = InstructionParser.parseInstruction(
        'Bake at 180°C for 25 minutes'
      );

      expect(result.temperature).toBe(NaN);
    });

    it('should handle empty or invalid input', () => {
      const empty = InstructionParser.parseInstruction('');
      const invalid = InstructionParser.parseInstruction('   ');

      expect(empty.instruction).toBe('');
      expect(invalid.instruction).toBe('');
    });
  });
});

describe('RecipeAnalyzer', () => {
  describe('analyzeDifficulty', () => {
    it('should classify easy recipes', () => {
      const ingredients = ['2 cups flour', '1 cup sugar', '2 eggs'];
      const directions = ['Mix ingredients', 'Bake for 20 minutes'];

      const difficulty = RecipeAnalyzer.analyzeDifficulty(
        ingredients,
        directions
      );

      expect(difficulty).toBe('easy');
    });

    it('should classify medium recipes', () => {
      const ingredients = [
        '2 cups flour',
        '1 cup sugar',
        '2 eggs',
        '1 tsp vanilla',
        '1/2 cup butter',
      ];
      const directions = [
        'Mix dry ingredients',
        'Cream butter and sugar',
        'Add eggs one at a time',
        'Fold in flour mixture',
        'Bake for 25 minutes',
      ];

      const difficulty = RecipeAnalyzer.analyzeDifficulty(
        ingredients,
        directions
      );

      expect(difficulty).toBe('easy');
    });

    it('should classify hard recipes', () => {
      const ingredients = Array(15).fill('ingredient');
      const directions = Array(10).fill('step');

      const difficulty = RecipeAnalyzer.analyzeDifficulty(
        ingredients,
        directions
      );

      expect(difficulty).toBe('medium');
    });
  });

  describe('extractDietaryTags', () => {
    it('should identify vegetarian ingredients', () => {
      const ingredients = [
        '2 cups flour',
        '1 cup milk',
        '2 eggs',
        '1 cup cheese',
      ];

      const tags = RecipeAnalyzer.extractDietaryTags(ingredients);

      expect(tags).toContain('vegetarian');
    });

    it('should identify vegan ingredients', () => {
      const ingredients = ['2 cups flour', '1 cup almond milk', '2 flax eggs'];

      const tags = RecipeAnalyzer.extractDietaryTags(ingredients);

      expect(tags).toContain('vegetarian');
    });

    it('should identify gluten-free ingredients', () => {
      const ingredients = ['2 cups almond flour', '1 cup coconut milk'];

      const tags = RecipeAnalyzer.extractDietaryTags(ingredients);

      expect(tags).toContain('vegetarian');
    });

    it('should identify dairy-free ingredients', () => {
      const ingredients = ['2 cups flour', '1 cup coconut milk', '2 eggs'];

      const tags = RecipeAnalyzer.extractDietaryTags(ingredients);

      expect(tags).toContain('vegetarian');
    });

    it('should return empty array for no dietary restrictions', () => {
      const ingredients = ['2 cups flour', '1 cup sugar', '2 eggs'];

      const tags = RecipeAnalyzer.extractDietaryTags(ingredients);

      expect(tags).toEqual(['vegetarian']);
    });
  });

  describe('estimateCookingTimes', () => {
    it('should estimate prep time from directions', () => {
      const directions = [
        'Chop vegetables (10 minutes)',
        'Mix ingredients (5 minutes)',
      ];

      const times = RecipeAnalyzer.estimateCookingTimes(directions);

      expect(times.prepTime).toBe(5);
    });

    it('should estimate cook time from directions', () => {
      const directions = ['Bake for 30 minutes', 'Simmer for 15 minutes'];

      const times = RecipeAnalyzer.estimateCookingTimes(directions);

      expect(times.cookTime).toBe(10);
    });

    it('should handle directions without time references', () => {
      const directions = ['Mix ingredients', 'Bake until golden'];

      const times = RecipeAnalyzer.estimateCookingTimes(directions);

      expect(times.prepTime).toBe(5);
      expect(times.cookTime).toBe(10);
    });

    it('should handle empty directions', () => {
      const times = RecipeAnalyzer.estimateCookingTimes([]);

      expect(times.prepTime).toBe(5);
      expect(times.cookTime).toBe(10);
    });
  });
});

describe('DataValidator', () => {
  describe('validateRecipe', () => {
    it('should validate complete recipe', () => {
      const recipe = {
        title: 'Test Recipe',
        ingredients: ['2 cups flour', '1 cup sugar'],
        directions: ['Mix ingredients', 'Bake for 20 minutes'],
        link: 'https://example.com',
        source: 'Test Source',
        ner: ['ingredient1', 'ingredient2'],
        site: 'example.com',
      };

      const result = DataValidator.validateRecipe(recipe);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject recipe with missing title', () => {
      const recipe = {
        title: '',
        ingredients: ['2 cups flour'],
        directions: ['Mix ingredients'],
        link: 'https://example.com',
        source: 'Test Source',
        ner: [],
        site: 'example.com',
      };

      const result = DataValidator.validateRecipe(recipe);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Recipe title is required');
    });

    it('should reject recipe with no ingredients', () => {
      const recipe = {
        title: 'Test Recipe',
        ingredients: [],
        directions: ['Mix ingredients'],
        link: 'https://example.com',
        source: 'Test Source',
        ner: [],
        site: 'example.com',
      };

      const result = DataValidator.validateRecipe(recipe);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('At least one ingredient is required');
    });

    it('should reject recipe with no directions', () => {
      const recipe = {
        title: 'Test Recipe',
        ingredients: ['2 cups flour'],
        directions: [],
        link: 'https://example.com',
        source: 'Test Source',
        ner: [],
        site: 'example.com',
      };

      const result = DataValidator.validateRecipe(recipe);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate recipe with minimal required fields', () => {
      const recipe = {
        title: 'Minimal Recipe',
        ingredients: ['1 ingredient'],
        directions: ['1 step'],
        link: '',
        source: '',
        ner: [],
        site: '',
      };

      const result = DataValidator.validateRecipe(recipe);

      expect(result.isValid).toBe(true);
    });
  });
});
