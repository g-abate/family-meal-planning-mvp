// SQLite utility functions for WASM operations
// Provides helper functions for database operations
// Version: 1.0

// Using any for SQL.js Database type due to import issues
type SqlJsDatabase = any;
import type { DatabaseResult, SearchOptions } from '../types/database';

// Database initialization utilities
export const DATABASE_VERSION = '1.0';
export const DATABASE_FILENAME = 'recipes.sqlite';

// SQL query builders
export class SQLQueryBuilder {
  private query: string = '';
  private params: unknown[] = [];

  static select(columns: string | string[]): SQLQueryBuilder {
    const builder = new SQLQueryBuilder();
    const cols = Array.isArray(columns) ? columns.join(', ') : columns;
    builder.query = `SELECT ${cols}`;
    return builder;
  }

  static insert(table: string): SQLQueryBuilder {
    const builder = new SQLQueryBuilder();
    builder.query = `INSERT INTO ${table}`;
    return builder;
  }

  static update(table: string): SQLQueryBuilder {
    const builder = new SQLQueryBuilder();
    builder.query = `UPDATE ${table}`;
    return builder;
  }

  static delete(table: string): SQLQueryBuilder {
    const builder = new SQLQueryBuilder();
    builder.query = `DELETE FROM ${table}`;
    return builder;
  }

  from(table: string): SQLQueryBuilder {
    this.query += ` FROM ${table}`;
    return this;
  }

  set(values: Record<string, any>): SQLQueryBuilder {
    const setClause = Object.keys(values)
      .map(key => `${key} = ?`)
      .join(', ');
    this.query += ` SET ${setClause}`;
    this.params.push(...Object.values(values));
    return this;
  }

  values(values: Record<string, any>): SQLQueryBuilder {
    const columns = Object.keys(values).join(', ');
    const placeholders = Object.keys(values).map(() => '?').join(', ');
    this.query += ` (${columns}) VALUES (${placeholders})`;
    this.params.push(...Object.values(values));
    return this;
  }

  where(condition: string, ...params: unknown[]): SQLQueryBuilder {
    this.query += ` WHERE ${condition}`;
    this.params.push(...params);
    return this;
  }

  and(condition: string, ...params: unknown[]): SQLQueryBuilder {
    this.query += ` AND ${condition}`;
    this.params.push(...params);
    return this;
  }

  or(condition: string, ...params: unknown[]): SQLQueryBuilder {
    this.query += ` OR ${condition}`;
    this.params.push(...params);
    return this;
  }

  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): SQLQueryBuilder {
    this.query += ` ORDER BY ${column} ${direction}`;
    return this;
  }

  limit(count: number): SQLQueryBuilder {
    this.query += ` LIMIT ${count}`;
    return this;
  }

  offset(count: number): SQLQueryBuilder {
    this.query += ` OFFSET ${count}`;
    return this;
  }

  build(): { sql: string; params: unknown[] } {
    return {
      sql: this.query,
      params: this.params
    };
  }
}

// Common SQL queries
export const COMMON_QUERIES = {
  // Recipe queries
  GET_RECIPE_BY_ID: 'SELECT * FROM recipes WHERE id = ? AND is_active = TRUE',
  GET_RECIPE_SUMMARY: 'SELECT * FROM recipe_summary WHERE id = ?',
  GET_RECIPES_BY_DIETARY_TAG: 'SELECT * FROM recipes_by_dietary_tag WHERE dietary_tag = ?',
  GET_FEATURED_RECIPES: 'SELECT * FROM recipe_summary WHERE is_featured = TRUE ORDER BY created_at DESC LIMIT ?',
  
  // Search queries
  SEARCH_RECIPES_FTS: `
    SELECT 
      rfts.recipe_id,
      rfts.title,
      rfts.description,
      rfts.ingredients,
      rfts.instructions,
      rfts.tags,
      r.prep_time,
      r.cook_time,
      r.total_time,
      r.servings,
      r.difficulty,
      r.image_url,
      rank
    FROM recipes_fts rfts
    JOIN recipes r ON rfts.recipe_id = r.id
    WHERE recipes_fts MATCH ?
    AND r.is_active = TRUE
  `,
  
  // Ingredient queries
  GET_RECIPE_INGREDIENTS: 'SELECT * FROM recipe_ingredients WHERE recipe_id = ? ORDER BY sort_order',
  GET_INGREDIENT_SUGGESTIONS: 'SELECT DISTINCT ingredient_name FROM recipe_ingredients WHERE ingredient_name LIKE ? LIMIT ?',
  
  // Instruction queries
  GET_RECIPE_INSTRUCTIONS: 'SELECT * FROM recipe_instructions WHERE recipe_id = ? ORDER BY step_number',
  
  // Tag queries
  GET_RECIPE_TAGS: 'SELECT * FROM recipe_tags WHERE recipe_id = ?',
  GET_DIETARY_TAGS: "SELECT DISTINCT tag_name FROM recipe_tags WHERE tag_type = 'dietary' ORDER BY tag_name",
  GET_CATEGORY_TAGS: "SELECT DISTINCT tag_name FROM recipe_tags WHERE tag_type = 'category' ORDER BY tag_name",
  
  // Statistics queries
  GET_RECIPE_COUNT: 'SELECT COUNT(*) as count FROM recipes WHERE is_active = TRUE',
  GET_TOTAL_INGREDIENTS: 'SELECT COUNT(DISTINCT ingredient_name) as count FROM recipe_ingredients',
  GET_RECIPES_BY_DIFFICULTY: 'SELECT difficulty, COUNT(*) as count FROM recipes WHERE is_active = TRUE GROUP BY difficulty'
};

// Database validation utilities
export function validateDatabaseSchema(db: SqlJsDatabase): DatabaseResult {
  try {
    const requiredTables = [
      'recipes',
      'recipe_ingredients',
      'recipe_instructions',
      'recipe_tags',
      'recipes_fts'
    ];

    const requiredViews = [
      'recipe_summary',
      'recipes_by_dietary_tag'
    ];

    // Check if all required tables exist
    for (const table of requiredTables) {
      const result = db.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`);
      if (!result.length || !result[0].values.length) {
        throw new Error(`Required table '${table}' is missing`);
      }
    }

    // Check if all required views exist
    for (const view of requiredViews) {
      const result = db.exec(`SELECT name FROM sqlite_master WHERE type='view' AND name='${view}'`);
      if (!result.length || !result[0].values.length) {
        throw new Error(`Required view '${view}' is missing`);
      }
    }

    // Check if FTS5 is available
    const ftsResult = db.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name='recipes_fts'`);
    if (!ftsResult.length || !ftsResult[0].values.length) {
      throw new Error('FTS5 virtual table is missing');
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'SCHEMA_VALIDATION_ERROR',
        message: error instanceof Error ? error.message : 'Schema validation failed',
        details: error
      }
    };
  }
}

// Query optimization utilities
export function buildSearchQuery(options: SearchOptions): { sql: string; params: string[] } {
  let sql = COMMON_QUERIES.SEARCH_RECIPES_FTS;
  const params: string[] = [options.query];

  // Add dietary tag filters
  if (options.dietaryTags && options.dietaryTags.length > 0) {
    const dietaryPlaceholders = options.dietaryTags.map(() => '?').join(',');
    sql += ` AND r.id IN (
      SELECT recipe_id FROM recipe_tags 
      WHERE tag_type = 'dietary' AND tag_name IN (${dietaryPlaceholders})
    )`;
    params.push(...options.dietaryTags);
  }

  // Add difficulty filter
  if (options.difficulty && options.difficulty.length > 0) {
    const difficultyPlaceholders = options.difficulty.map(() => '?').join(',');
    sql += ` AND r.difficulty IN (${difficultyPlaceholders})`;
    params.push(...options.difficulty);
  }

  // Add time filters
  if (options.maxPrepTime) {
    sql += ' AND (r.prep_time IS NULL OR r.prep_time <= ?)';
    params.push(options.maxPrepTime.toString());
  }

  if (options.maxCookTime) {
    sql += ' AND (r.cook_time IS NULL OR r.cook_time <= ?)';
    params.push(options.maxCookTime.toString());
  }

  if (options.maxTotalTime) {
    sql += ' AND (r.total_time IS NULL OR r.total_time <= ?)';
    params.push(options.maxTotalTime.toString());
  }

  // Add ordering
  sql += ' ORDER BY rank';
  
  if (options.orderDirection === 'DESC') {
    sql += ' DESC';
  }

  // Add pagination
  if (options.limit) {
    sql += ' LIMIT ?';
    params.push(options.limit.toString());

    if (options.offset) {
      sql += ' OFFSET ?';
      params.push(options.offset.toString());
    }
  }

  return { sql, params };
}

// Database migration utilities
export function getCurrentSchemaVersion(): string {
  return DATABASE_VERSION;
}

export function isSchemaCompatible(currentVersion: string, requiredVersion: string): boolean {
  // Simple version comparison for MVP
  // In production, you'd want more sophisticated version handling
  return currentVersion === requiredVersion;
}

// Error handling utilities
export function handleDatabaseError(error: unknown): DatabaseResult {
  let code = 'DATABASE_ERROR';
  let message = 'An unknown database error occurred';

  if (error instanceof Error) {
    message = error.message;
    
    // Map common SQLite error codes
    if (message.includes('UNIQUE constraint failed')) {
      code = 'UNIQUE_CONSTRAINT_ERROR';
    } else if (message.includes('NOT NULL constraint failed')) {
      code = 'NOT_NULL_CONSTRAINT_ERROR';
    } else if (message.includes('FOREIGN KEY constraint failed')) {
      code = 'FOREIGN_KEY_CONSTRAINT_ERROR';
    } else if (message.includes('no such table')) {
      code = 'TABLE_NOT_FOUND_ERROR';
    } else if (message.includes('database is locked')) {
      code = 'DATABASE_LOCKED_ERROR';
    }
  }

  return {
    success: false,
    error: {
      code,
      message,
      details: error
    }
  };
}

// Performance monitoring utilities
export class DatabasePerformanceMonitor {
  private startTime: number = 0;
  private operationName: string = '';

  start(operationName: string): void {
    this.operationName = operationName;
    this.startTime = performance.now();
  }

  end(): { operation: string; duration: number } {
    const duration = performance.now() - this.startTime;
    return {
      operation: this.operationName,
      duration: Math.round(duration * 100) / 100 // Round to 2 decimal places
    };
  }

  logSlowQuery(duration: number, threshold = 100): void {
    if (duration > threshold) {
      // eslint-disable-next-line no-console
      console.warn(`SQLiteUtils: Slow database query detected: ${this.operationName} took ${duration}ms`);
    }
  }
}

// Export performance monitor instance
export const performanceMonitor = new DatabasePerformanceMonitor();
