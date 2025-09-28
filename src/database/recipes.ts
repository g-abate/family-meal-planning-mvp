// Dexie store for meal plans and user preferences
// Provides offline-first storage for user data
// Version: 1.0

import Dexie, { type Table } from 'dexie';
import type { Recipe, RecipeSummary } from '../types/database';

// User preference types
export interface UserPreferences {
  id?: number;
  dietaryTags: string[];
  prepSessions: number;
  sessionDuration: number; // minutes
  defaultMealCount: number;
  defaultMealTypes: string[];
  favoriteIngredients: string[];
  dislikedIngredients: string[];
  createdAt: string;
  updatedAt: string;
}

// Meal plan types
export interface MealPlan {
  id?: number;
  name: string;
  weekStartDate: string; // ISO date string
  mealCount: number;
  mealTypes: string[];
  dietaryTags: string[];
  prepSessions: number;
  sessionDuration: number;
  createdAt: string;
  updatedAt: string;
}

// Planned meal types
export interface PlannedMeal {
  id?: number;
  mealPlanId: number;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  mealType: string; // 'lunch', 'dinner', etc.
  recipeId: number;
  recipeTitle: string;
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  servings: number;
  difficulty: string;
  isSwapped: boolean; // true if user manually swapped this meal
  createdAt: string;
  updatedAt: string;
}

// Prep session types
export interface PrepSession {
  id?: number;
  mealPlanId: number;
  sessionNumber: number;
  duration: number; // minutes
  tasks: PrepTask[];
  createdAt: string;
  updatedAt: string;
}

export interface PrepTask {
  id?: number;
  prepSessionId: number;
  taskDescription: string;
  estimatedTime: number; // minutes
  isCompleted: boolean;
  sortOrder: number;
  relatedRecipeId?: number;
  relatedMealId?: number;
  createdAt: string;
  updatedAt: string;
}

// Database class extending Dexie
export class MealPlanningDB extends Dexie {
  // Tables
  userPreferences!: Table<UserPreferences>;
  mealPlans!: Table<MealPlan>;
  plannedMeals!: Table<PlannedMeal>;
  prepSessions!: Table<PrepSession>;
  prepTasks!: Table<PrepTask>;
  cachedRecipes!: Table<Recipe>;
  recipeSummaries!: Table<RecipeSummary>;

  constructor() {
    super('MealPlanningDB');
    
    this.version(1).stores({
      // User preferences - single record
      userPreferences: '++id, dietaryTags, prepSessions, sessionDuration, createdAt, updatedAt',
      
      // Meal plans
      mealPlans: '++id, name, weekStartDate, mealCount, mealTypes, createdAt, updatedAt',
      
      // Planned meals within meal plans
      plannedMeals: '++id, mealPlanId, dayOfWeek, mealType, recipeId, createdAt, updatedAt',
      
      // Prep sessions for meal plans
      prepSessions: '++id, mealPlanId, sessionNumber, duration, createdAt, updatedAt',
      
      // Prep tasks within sessions
      prepTasks: '++id, prepSessionId, taskDescription, isCompleted, sortOrder, createdAt, updatedAt',
      
      // Cached recipe data for offline access
      cachedRecipes: '++id, title, difficulty, totalTime, servings, isActive, createdAt',
      
      // Cached recipe summaries for quick access
      recipeSummaries: '++id, title, difficulty, totalTime, servings, tags, dietaryTags, ingredientCount, isActive'
    });

    // Hooks for automatic timestamps
    this.userPreferences.hook('creating', (_primKey, obj, _trans) => {
      const now = new Date().toISOString();
      obj.createdAt = now;
      obj.updatedAt = now;
    });

    this.userPreferences.hook('updating', (modifications, _primKey, _obj, _trans) => {
      (modifications as any).updatedAt = new Date().toISOString();
    });

    this.mealPlans.hook('creating', (_primKey, obj, _trans) => {
      const now = new Date().toISOString();
      obj.createdAt = now;
      obj.updatedAt = now;
    });

    this.mealPlans.hook('updating', (modifications, _primKey, _obj, _trans) => {
      (modifications as any).updatedAt = new Date().toISOString();
    });

    this.plannedMeals.hook('creating', (_primKey, obj, _trans) => {
      const now = new Date().toISOString();
      obj.createdAt = now;
      obj.updatedAt = now;
    });

    this.plannedMeals.hook('updating', (modifications, _primKey, _obj, _trans) => {
      (modifications as any).updatedAt = new Date().toISOString();
    });

    this.prepSessions.hook('creating', (_primKey, obj, _trans) => {
      const now = new Date().toISOString();
      obj.createdAt = now;
      obj.updatedAt = now;
    });

    this.prepSessions.hook('updating', (modifications, _primKey, _obj, _trans) => {
      (modifications as any).updatedAt = new Date().toISOString();
    });

    this.prepTasks.hook('creating', (_primKey, obj, _trans) => {
      const now = new Date().toISOString();
      obj.createdAt = now;
      obj.updatedAt = now;
    });

    this.prepTasks.hook('updating', (modifications, _primKey, _obj, _trans) => {
      (modifications as any).updatedAt = new Date().toISOString();
    });
  }

  // User preferences methods
  async getUserPreferences(): Promise<UserPreferences | undefined> {
    return await this.userPreferences.orderBy('updatedAt').last();
  }

  async saveUserPreferences(preferences: Partial<UserPreferences>): Promise<number> {
    const existing = await this.getUserPreferences();
    
    if (existing) {
      await this.userPreferences.update(existing.id ?? 0, preferences);
      return existing.id ?? 0;
    } else {
      return await this.userPreferences.add({
        dietaryTags: preferences.dietaryTags ?? [],
        prepSessions: preferences.prepSessions ?? 2,
        sessionDuration: preferences.sessionDuration ?? 120,
        defaultMealCount: preferences.defaultMealCount ?? 5,
        defaultMealTypes: preferences.defaultMealTypes ?? ['dinner'],
        favoriteIngredients: preferences.favoriteIngredients ?? [],
        dislikedIngredients: preferences.dislikedIngredients ?? [],
        ...preferences
      } as UserPreferences);
    }
  }

  // Meal plan methods
  async getMealPlans(): Promise<MealPlan[]> {
    return await this.mealPlans.orderBy('createdAt').reverse().toArray();
  }

  async getMealPlan(id: number): Promise<MealPlan | undefined> {
    return await this.mealPlans.get(id);
  }

  async saveMealPlan(mealPlan: Partial<MealPlan>): Promise<number> {
    if (mealPlan.id) {
      await this.mealPlans.update(mealPlan.id, mealPlan);
      return mealPlan.id;
    } else {
      return await this.mealPlans.add(mealPlan as MealPlan);
    }
  }

  async deleteMealPlan(id: number): Promise<void> {
    await this.transaction('rw', [this.mealPlans, this.plannedMeals, this.prepSessions, this.prepTasks], async () => {
      // Delete associated planned meals
      await this.plannedMeals.where('mealPlanId').equals(id).delete();
      
      // Delete associated prep sessions and tasks
      const prepSessions = await this.prepSessions.where('mealPlanId').equals(id).toArray();
      for (const session of prepSessions) {
        if (session.id) {
          await this.prepTasks.where('prepSessionId').equals(session.id).delete();
        }
      }
      await this.prepSessions.where('mealPlanId').equals(id).delete();
      
      // Delete the meal plan
      await this.mealPlans.delete(id);
    });
  }

  // Planned meal methods
  async getPlannedMeals(mealPlanId: number): Promise<PlannedMeal[]> {
    return await this.plannedMeals.where('mealPlanId').equals(mealPlanId).toArray();
  }

  async getPlannedMealsByDay(mealPlanId: number, dayOfWeek: number): Promise<PlannedMeal[]> {
    return await this.plannedMeals
      .where(['mealPlanId', 'dayOfWeek'])
      .equals([mealPlanId, dayOfWeek])
      .toArray();
  }

  async savePlannedMeal(plannedMeal: Partial<PlannedMeal>): Promise<number> {
    if (plannedMeal.id) {
      await this.plannedMeals.update(plannedMeal.id, plannedMeal);
      return plannedMeal.id;
    } else {
      return await this.plannedMeals.add(plannedMeal as PlannedMeal);
    }
  }

  async deletePlannedMeal(id: number): Promise<void> {
    await this.plannedMeals.delete(id);
  }

  async swapPlannedMeal(id: number, newRecipeId: number, newRecipeTitle: string): Promise<void> {
    await this.plannedMeals.update(id, {
      recipeId: newRecipeId,
      recipeTitle: newRecipeTitle,
      isSwapped: true
    });
  }

  // Prep session methods
  async getPrepSessions(mealPlanId: number): Promise<PrepSession[]> {
    return await this.prepSessions
      .where('mealPlanId')
      .equals(mealPlanId)
      .sortBy('sessionNumber');
  }

  async savePrepSession(prepSession: Partial<PrepSession>): Promise<number> {
    if (prepSession.id) {
      await this.prepSessions.update(prepSession.id, prepSession);
      return prepSession.id;
    } else {
      return await this.prepSessions.add(prepSession as PrepSession);
    }
  }

  // Prep task methods
  async getPrepTasks(prepSessionId: number): Promise<PrepTask[]> {
    return await this.prepTasks
      .where('prepSessionId')
      .equals(prepSessionId)
      .sortBy('sortOrder');
  }

  async savePrepTask(prepTask: Partial<PrepTask>): Promise<number> {
    if (prepTask.id) {
      await this.prepTasks.update(prepTask.id, prepTask);
      return prepTask.id;
    } else {
      return await this.prepTasks.add(prepTask as PrepTask);
    }
  }

  async togglePrepTask(id: number): Promise<void> {
    const task = await this.prepTasks.get(id);
    if (task) {
      await this.prepTasks.update(id, { isCompleted: !task.isCompleted });
    }
  }

  // Recipe cache methods
  async cacheRecipe(recipe: Recipe): Promise<void> {
    await this.cachedRecipes.put(recipe as any);
  }

  async getCachedRecipe(id: number): Promise<Recipe | undefined> {
    return await this.cachedRecipes.get(id);
  }

  async cacheRecipeSummary(summary: RecipeSummary): Promise<void> {
    await this.recipeSummaries.put(summary);
  }

  async getCachedRecipeSummaries(): Promise<RecipeSummary[]> {
    return await this.recipeSummaries.where('isActive').equals(1).toArray();
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    await this.transaction('rw', [
      this.userPreferences,
      this.mealPlans,
      this.plannedMeals,
      this.prepSessions,
      this.prepTasks,
      this.cachedRecipes,
      this.recipeSummaries
    ], async () => {
      await this.userPreferences.clear();
      await this.mealPlans.clear();
      await this.plannedMeals.clear();
      await this.prepSessions.clear();
      await this.prepTasks.clear();
      await this.cachedRecipes.clear();
      await this.recipeSummaries.clear();
    });
  }

  async getDatabaseSize(): Promise<number> {
    const sizes = await Promise.all([
      this.userPreferences.count(),
      this.mealPlans.count(),
      this.plannedMeals.count(),
      this.prepSessions.count(),
      this.prepTasks.count(),
      this.cachedRecipes.count(),
      this.recipeSummaries.count()
    ]);
    
    return sizes.reduce((total, size) => total + size, 0);
  }
}

// Export singleton instance
export const db = new MealPlanningDB();
