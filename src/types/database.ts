// Database types and interfaces for SQLite operations
// Version: 1.0

export interface Recipe {
  id: number;
  title: string;
  description?: string;
  prep_time?: number; // minutes
  cook_time?: number; // minutes
  total_time?: number; // minutes (calculated)
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  image_url?: string;
  source_url?: string;
  created_at: string;
  updated_at: string;
  
  // Nutritional information (optional for MVP)
  calories_per_serving?: number;
  protein_per_serving?: number; // grams
  carbs_per_serving?: number;   // grams
  fat_per_serving?: number;     // grams
  
  // Metadata
  is_featured: boolean;
  is_active: boolean;
}

export interface RecipeIngredient {
  id: number;
  recipe_id: number;
  ingredient_name: string;
  quantity?: number;
  unit?: string; // cups, tbsp, tsp, lbs, oz, etc.
  notes?: string; // optional preparation notes
  is_optional: boolean;
  sort_order: number;
  kind: 'protein_main' | 'protein_source' | 'vegetable' | 'grain' | 'dairy' | 'fat' | 'spice' | 'other';
}

export interface RecipeInstruction {
  id: number;
  recipe_id: number;
  step_number: number;
  instruction: string;
  prep_time?: number; // minutes for this step
  cook_time?: number; // minutes for this step
  temperature?: number; // degrees F/C
  notes?: string; // optional notes for this step
}

export interface RecipeTag {
  id: number;
  recipe_id: number;
  tag_name: string;
  tag_type: 'dietary' | 'category' | 'cuisine' | 'cooking_method';
}

export interface RecipeSummary {
  id: number;
  title: string;
  description?: string;
  prep_time?: number;
  cook_time?: number;
  total_time?: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  image_url?: string;
  is_featured: boolean;
  is_active: boolean;
  tags?: string; // comma-separated tags
  dietary_tags?: string; // comma-separated dietary tags
  ingredient_count: number;
}

export interface RecipeByDietaryTag {
  id: number;
  title: string;
  description?: string;
  prep_time?: number;
  cook_time?: number;
  total_time?: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  image_url?: string;
  dietary_tag: string;
}

// FTS5 search result interface
export interface RecipeSearchResult {
  recipe_id: number;
  title: string;
  description?: string;
  ingredients?: string;
  instructions?: string;
  tags?: string;
  rank: number; // FTS5 rank for relevance scoring
}

// Database operation interfaces
export interface DatabaseConfig {
  filename: string;
  version: string;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

export interface SearchOptions extends QueryOptions {
  query: string;
  dietaryTags?: string[];
  difficulty?: string[];
  maxPrepTime?: number;
  maxCookTime?: number;
  maxTotalTime?: number;
}

export interface InsertRecipeData {
  title: string;
  description?: string;
  prep_time?: number;
  cook_time?: number;
  total_time?: number;
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  image_url?: string;
  source_url?: string;
  calories_per_serving?: number;
  protein_per_serving?: number;
  carbs_per_serving?: number;
  fat_per_serving?: number;
  is_featured?: boolean;
  is_active?: boolean;
}

export interface InsertIngredientData {
  recipe_id: number;
  ingredient_name: string;
  quantity?: number;
  unit?: string;
  notes?: string;
  is_optional?: boolean;
  sort_order?: number;
  kind?: 'protein_main' | 'protein_source' | 'vegetable' | 'grain' | 'dairy' | 'fat' | 'spice' | 'other';
}

export interface InsertInstructionData {
  recipe_id: number;
  step_number: number;
  instruction: string;
  prep_time?: number;
  cook_time?: number;
  temperature?: number;
  notes?: string;
}

export interface InsertTagData {
  recipe_id: number;
  tag_name: string;
  tag_type: 'dietary' | 'category' | 'cuisine' | 'cooking_method';
}

// Database error types
export interface DatabaseError {
  code: string;
  message: string;
  details?: any;
}

export interface DatabaseResult<T = any> {
  success: boolean;
  data?: T;
  error?: DatabaseError;
}

// Transaction types
export interface Transaction {
  execute(sql: string, params?: any[]): Promise<DatabaseResult>;
  commit(): Promise<DatabaseResult>;
  rollback(): Promise<DatabaseResult>;
}

// Database connection interface
export interface DatabaseConnection {
  initialize(): Promise<DatabaseResult>;
  close(): Promise<DatabaseResult>;
  execute(sql: string, params?: any[]): Promise<DatabaseResult>;
  query<T = any>(sql: string, params?: any[]): Promise<DatabaseResult<T[]>>;
  beginTransaction(): Promise<Transaction>;
  getSchemaVersion(): Promise<DatabaseResult<string>>;
  setSchemaVersion(version: string): Promise<DatabaseResult>;
}
