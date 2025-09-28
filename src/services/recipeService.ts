// Recipe service layer for SQLite WASM operations
// Provides high-level API for recipe management
// Version: 1.0

import type { 
  Recipe, 
  RecipeIngredient, 
  RecipeInstruction, 
  RecipeTag, 
  RecipeSummary,
  RecipeSearchResult,
  DatabaseResult,
  QueryOptions,
  SearchOptions,
  InsertRecipeData,
  InsertIngredientData,
  InsertInstructionData,
  InsertTagData
} from '../types/database';
import { COMMON_QUERIES, buildSearchQuery, performanceMonitor } from '../utils/sqliteUtils';

// Web Worker for SQLite operations
class SQLiteWorkerManager {
  private worker: Worker | null = null;
  private messageId = 0;
  private pendingMessages = new Map<string, { resolve: (value: any) => void; reject: (error: any) => void }>();

  constructor() {
    this.initializeWorker();
  }

  private initializeWorker(): void {
    if (typeof Worker !== 'undefined') {
      // Create worker from the sqliteWorker.ts file
      this.worker = new Worker(new URL('../database/sqliteWorker.ts', import.meta.url), {
        type: 'module'
      });

      this.worker.onmessage = (e) => {
        const { type, id, data, error } = e.data;
        const pending = this.pendingMessages.get(id);
        
        if (pending) {
          this.pendingMessages.delete(id);
          
          if (type === 'success') {
            pending.resolve(data);
          } else {
            pending.reject(new Error(error));
          }
        }
      };

      this.worker.onerror = (error) => {
        console.error('SQLite Worker error:', error);
        // Reject all pending messages
        for (const [id, pending] of this.pendingMessages) {
          pending.reject(error);
        }
        this.pendingMessages.clear();
      };
    }
  }

  private async sendMessage(type: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Worker not initialized'));
        return;
      }

      const id = `msg_${++this.messageId}`;
      this.pendingMessages.set(id, { resolve, reject });

      this.worker.postMessage({ type, id, data });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingMessages.has(id)) {
          this.pendingMessages.delete(id);
          reject(new Error('Worker operation timeout'));
        }
      }, 30000);
    });
  }

  async initialize(dbData?: ArrayBuffer): Promise<DatabaseResult> {
    return await this.sendMessage('init', { dbData });
  }

  async execute(sql: string, params: any[] = []): Promise<DatabaseResult> {
    return await this.sendMessage('execute', { sql, params });
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<DatabaseResult<T[]>> {
    return await this.sendMessage('query', { sql, params });
  }

  async search(options: SearchOptions): Promise<DatabaseResult<RecipeSearchResult[]>> {
    return await this.sendMessage('search', { options });
  }

  async close(): Promise<DatabaseResult> {
    const result = await this.sendMessage('close');
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    return result;
  }
}

// Recipe service class
export class RecipeService {
  private workerManager: SQLiteWorkerManager;
  private isInitialized = false;

  constructor() {
    this.workerManager = new SQLiteWorkerManager();
  }

  async initialize(dbData?: ArrayBuffer): Promise<DatabaseResult> {
    performanceMonitor.start('initialize_database');
    
    try {
      const result = await this.workerManager.initialize(dbData);
      this.isInitialized = result.success;
      
      const perf = performanceMonitor.end();
      performanceMonitor.logSlowQuery(perf.duration);
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'INITIALIZATION_ERROR',
          message: error instanceof Error ? error.message : 'Failed to initialize recipe service',
          details: error
        }
      };
    }
  }

  async getRecipe(id: number): Promise<DatabaseResult<Recipe>> {
    if (!this.isInitialized) {
      return { success: false, error: { code: 'NOT_INITIALIZED', message: 'Service not initialized' } };
    }

    performanceMonitor.start('get_recipe');
    
    try {
      const result = await this.workerManager.query<Recipe>(COMMON_QUERIES.GET_RECIPE_BY_ID, [id]);
      
      const perf = performanceMonitor.end();
      performanceMonitor.logSlowQuery(perf.duration);
      
      if (result.success && result.data && result.data.length > 0) {
        return { success: true, data: result.data[0] };
      } else {
        return { success: false, error: { code: 'RECIPE_NOT_FOUND', message: 'Recipe not found' } };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_RECIPE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get recipe',
          details: error
        }
      };
    }
  }

  async getRecipeSummary(id: number): Promise<DatabaseResult<RecipeSummary>> {
    if (!this.isInitialized) {
      return { success: false, error: { code: 'NOT_INITIALIZED', message: 'Service not initialized' } };
    }

    performanceMonitor.start('get_recipe_summary');
    
    try {
      const result = await this.workerManager.query<RecipeSummary>(COMMON_QUERIES.GET_RECIPE_SUMMARY, [id]);
      
      const perf = performanceMonitor.end();
      performanceMonitor.logSlowQuery(perf.duration);
      
      if (result.success && result.data && result.data.length > 0) {
        return { success: true, data: result.data[0] };
      } else {
        return { success: false, error: { code: 'RECIPE_NOT_FOUND', message: 'Recipe not found' } };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_RECIPE_SUMMARY_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get recipe summary',
          details: error
        }
      };
    }
  }

  async getRecipeIngredients(id: number): Promise<DatabaseResult<RecipeIngredient[]>> {
    if (!this.isInitialized) {
      return { success: false, error: { code: 'NOT_INITIALIZED', message: 'Service not initialized' } };
    }

    performanceMonitor.start('get_recipe_ingredients');
    
    try {
      const result = await this.workerManager.query<RecipeIngredient>(COMMON_QUERIES.GET_RECIPE_INGREDIENTS, [id]);
      
      const perf = performanceMonitor.end();
      performanceMonitor.logSlowQuery(perf.duration);
      
      return { success: true, data: result.data || [] };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_RECIPE_INGREDIENTS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get recipe ingredients',
          details: error
        }
      };
    }
  }

  async getRecipeInstructions(id: number): Promise<DatabaseResult<RecipeInstruction[]>> {
    if (!this.isInitialized) {
      return { success: false, error: { code: 'NOT_INITIALIZED', message: 'Service not initialized' } };
    }

    performanceMonitor.start('get_recipe_instructions');
    
    try {
      const result = await this.workerManager.query<RecipeInstruction>(COMMON_QUERIES.GET_RECIPE_INSTRUCTIONS, [id]);
      
      const perf = performanceMonitor.end();
      performanceMonitor.logSlowQuery(perf.duration);
      
      return { success: true, data: result.data || [] };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_RECIPE_INSTRUCTIONS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get recipe instructions',
          details: error
        }
      };
    }
  }

  async getRecipeTags(id: number): Promise<DatabaseResult<RecipeTag[]>> {
    if (!this.isInitialized) {
      return { success: false, error: { code: 'NOT_INITIALIZED', message: 'Service not initialized' } };
    }

    performanceMonitor.start('get_recipe_tags');
    
    try {
      const result = await this.workerManager.query<RecipeTag>(COMMON_QUERIES.GET_RECIPE_TAGS, [id]);
      
      const perf = performanceMonitor.end();
      performanceMonitor.logSlowQuery(perf.duration);
      
      return { success: true, data: result.data || [] };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_RECIPE_TAGS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get recipe tags',
          details: error
        }
      };
    }
  }

  async searchRecipes(options: SearchOptions): Promise<DatabaseResult<RecipeSearchResult[]>> {
    if (!this.isInitialized) {
      return { success: false, error: { code: 'NOT_INITIALIZED', message: 'Service not initialized' } };
    }

    performanceMonitor.start('search_recipes');
    
    try {
      const result = await this.workerManager.search(options);
      
      const perf = performanceMonitor.end();
      performanceMonitor.logSlowQuery(perf.duration);
      
      return { success: true, data: result.data || [] };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SEARCH_RECIPES_ERROR',
          message: error instanceof Error ? error.message : 'Failed to search recipes',
          details: error
        }
      };
    }
  }

  async getFeaturedRecipes(limit: number = 10): Promise<DatabaseResult<RecipeSummary[]>> {
    if (!this.isInitialized) {
      return { success: false, error: { code: 'NOT_INITIALIZED', message: 'Service not initialized' } };
    }

    performanceMonitor.start('get_featured_recipes');
    
    try {
      const result = await this.workerManager.query<RecipeSummary>(COMMON_QUERIES.GET_FEATURED_RECIPES, [limit]);
      
      const perf = performanceMonitor.end();
      performanceMonitor.logSlowQuery(perf.duration);
      
      return { success: true, data: result.data || [] };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_FEATURED_RECIPES_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get featured recipes',
          details: error
        }
      };
    }
  }

  async getRecipesByDietaryTag(tag: string): Promise<DatabaseResult<RecipeSummary[]>> {
    if (!this.isInitialized) {
      return { success: false, error: { code: 'NOT_INITIALIZED', message: 'Service not initialized' } };
    }

    performanceMonitor.start('get_recipes_by_dietary_tag');
    
    try {
      const result = await this.workerManager.query<RecipeSummary>(COMMON_QUERIES.GET_RECIPES_BY_DIETARY_TAG, [tag]);
      
      const perf = performanceMonitor.end();
      performanceMonitor.logSlowQuery(perf.duration);
      
      return { success: true, data: result.data || [] };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_RECIPES_BY_DIETARY_TAG_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get recipes by dietary tag',
          details: error
        }
      };
    }
  }

  async getIngredientSuggestions(query: string, limit: number = 10): Promise<DatabaseResult<string[]>> {
    if (!this.isInitialized) {
      return { success: false, error: { code: 'NOT_INITIALIZED', message: 'Service not initialized' } };
    }

    performanceMonitor.start('get_ingredient_suggestions');
    
    try {
      const result = await this.workerManager.query<{ ingredient_name: string }>(
        COMMON_QUERIES.GET_INGREDIENT_SUGGESTIONS, 
        [`%${query}%`, limit]
      );
      
      const perf = performanceMonitor.end();
      performanceMonitor.logSlowQuery(perf.duration);
      
      const ingredients = result.data?.map(item => item.ingredient_name) || [];
      return { success: true, data: ingredients };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_INGREDIENT_SUGGESTIONS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get ingredient suggestions',
          details: error
        }
      };
    }
  }

  async getDietaryTags(): Promise<DatabaseResult<string[]>> {
    if (!this.isInitialized) {
      return { success: false, error: { code: 'NOT_INITIALIZED', message: 'Service not initialized' } };
    }

    performanceMonitor.start('get_dietary_tags');
    
    try {
      const result = await this.workerManager.query<{ tag_name: string }>(COMMON_QUERIES.GET_DIETARY_TAGS);
      
      const perf = performanceMonitor.end();
      performanceMonitor.logSlowQuery(perf.duration);
      
      const tags = result.data?.map(item => item.tag_name) || [];
      return { success: true, data: tags };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GET_DIETARY_TAGS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get dietary tags',
          details: error
        }
      };
    }
  }

  async close(): Promise<DatabaseResult> {
    try {
      const result = await this.workerManager.close();
      this.isInitialized = false;
      return result;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CLOSE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to close service',
          details: error
        }
      };
    }
  }
}

// Export singleton instance
export const recipeService = new RecipeService();
