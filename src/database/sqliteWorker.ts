// SQLite Web Worker for non-blocking database operations
// Uses sql.js for WASM-based SQLite operations
// Version: 1.0

import initSqlJs from 'sql.js';
import type { DatabaseResult, SearchOptions } from '../types/database';

// SQL.js database instance
let db: any = null;
let SQL: any = null;

// Worker message types
interface WorkerMessage {
  type: 'init' | 'execute' | 'query' | 'search' | 'close';
  id: string;
  data?: any;
}

interface WorkerResponse {
  type: 'success' | 'error';
  id: string;
  data?: any;
  error?: string;
}

// Initialize SQL.js and create database
async function initializeDatabase(dbData?: ArrayBuffer): Promise<DatabaseResult> {
  try {
    if (!SQL) {
      SQL = await initSqlJs({
        // Use CDN for sql.js WASM file
        locateFile: (file: string) => `https://sql.js.org/dist/${file}`
      });
    }

    if (dbData) {
      // Load existing database
      const data = new Uint8Array(dbData);
      db = new SQL.Database(data);
    } else {
      // Create new database
      db = new SQL.Database();
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'INIT_ERROR',
        message: error instanceof Error ? error.message : 'Failed to initialize database',
        details: error
      }
    };
  }
}

// Execute SQL with parameters
function executeSQL(sql: string, _params: any[] = []): DatabaseResult {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }

    const stmt = db.prepare(sql);
    if (stmt.step()) {
      // Query executed successfully
      const columns = stmt.getColumnNames();
      const values = stmt.get();
      const result = columns.reduce((obj: any, col: string, index: number) => {
        obj[col] = values[index];
        return obj;
      }, {});

      stmt.free();
      return { success: true, data: result };
    } else {
      // No results, but execution was successful
      stmt.free();
      return { success: true };
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'EXECUTE_ERROR',
        message: error instanceof Error ? error.message : 'Failed to execute SQL',
        details: error
      }
    };
  }
}

// Query SQL with parameters and return multiple results
function querySQL<T = any>(sql: string, _params: any[] = []): DatabaseResult<T[]> {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }

    const stmt = db.prepare(sql);
    const results: T[] = [];
    const columns = stmt.getColumnNames();

    while (stmt.step()) {
      const values = stmt.get();
      const row = columns.reduce((obj: any, col: string, index: number) => {
        obj[col] = values[index];
        return obj;
      }, {});
      results.push(row as T);
    }

    stmt.free();
    return { success: true, data: results };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'QUERY_ERROR',
        message: error instanceof Error ? error.message : 'Failed to query SQL',
        details: error
      }
    };
  }
}

// Full-text search using FTS5
function searchRecipes(options: SearchOptions): DatabaseResult {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }

    let sql = `
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
    `;

    const params: any[] = [options.query];

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
      params.push(options.maxPrepTime);
    }

    if (options.maxCookTime) {
      sql += ' AND (r.cook_time IS NULL OR r.cook_time <= ?)';
      params.push(options.maxCookTime);
    }

    if (options.maxTotalTime) {
      sql += ' AND (r.total_time IS NULL OR r.total_time <= ?)';
      params.push(options.maxTotalTime);
    }

    // Add ordering and pagination
    sql += ' ORDER BY rank';
    
    if (options.orderDirection === 'DESC') {
      sql += ' DESC';
    }

    if (options.limit) {
      sql += ' LIMIT ?';
      params.push(options.limit);

      if (options.offset) {
        sql += ' OFFSET ?';
        params.push(options.offset);
      }
    }

    return querySQL(sql, params);
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'SEARCH_ERROR',
        message: error instanceof Error ? error.message : 'Failed to search recipes',
        details: error
      }
    };
  }
}

// Export database as ArrayBuffer
function exportDatabase(): ArrayBuffer | null {
  try {
    if (!db) {
      return null;
    }
    return db.export().buffer;
  } catch (error) {
    console.error('Failed to export database:', error);
    return null;
  }
}

// Close database
function closeDatabase(): DatabaseResult {
  try {
    if (db) {
      db.close();
      db = null;
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'CLOSE_ERROR',
        message: error instanceof Error ? error.message : 'Failed to close database',
        details: error
      }
    };
  }
}

// Handle worker messages
self.onmessage = async function(e: MessageEvent<WorkerMessage>) {
  const { type, id, data } = e.data;
  let response: WorkerResponse;

  try {
    switch (type) {
      case 'init':
        const initResult = await initializeDatabase(data?.dbData);
        response = {
          type: initResult.success ? 'success' : 'error',
          id,
          data: initResult.data,
          error: initResult.error?.message
        };
        break;

      case 'execute':
        const executeResult = executeSQL(data.sql, data.params);
        response = {
          type: executeResult.success ? 'success' : 'error',
          id,
          data: executeResult.data,
          error: executeResult.error?.message
        };
        break;

      case 'query':
        const queryResult = querySQL(data.sql, data.params);
        response = {
          type: queryResult.success ? 'success' : 'error',
          id,
          data: queryResult.data,
          error: queryResult.error?.message
        };
        break;

      case 'search':
        const searchResult = searchRecipes(data.options);
        response = {
          type: searchResult.success ? 'success' : 'error',
          id,
          data: searchResult.data,
          error: searchResult.error?.message
        };
        break;

      case 'close':
        const closeResult = closeDatabase();
        response = {
          type: closeResult.success ? 'success' : 'error',
          id,
          data: closeResult.data,
          error: closeResult.error?.message
        };
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    response = {
      type: 'error',
      id,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }

  self.postMessage(response);
};

// Export for testing
export {
  initializeDatabase,
  executeSQL,
  querySQL,
  searchRecipes,
  exportDatabase,
  closeDatabase
};
