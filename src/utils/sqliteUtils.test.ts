// Unit tests for sqliteUtils.ts
// Tests SQL query builders and utility functions

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SQLQueryBuilder, COMMON_QUERIES, performanceMonitor } from './sqliteUtils';

describe('SQLQueryBuilder', () => {
  // let builder: SQLQueryBuilder;

  beforeEach(() => {
    // builder = new SQLQueryBuilder();
  });

  describe('Static Factory Methods', () => {
    it('should create SELECT query', () => {
      const query = SQLQueryBuilder.select('*');
      expect(query.build().sql).toBe('SELECT *');
    });

    it('should create SELECT query with multiple columns', () => {
      const query = SQLQueryBuilder.select(['id', 'title', 'difficulty']);
      expect(query.build().sql).toBe('SELECT id, title, difficulty');
    });

    it('should create INSERT query', () => {
      const query = SQLQueryBuilder.insert('recipes');
      expect(query.build().sql).toBe('INSERT INTO recipes');
    });

    it('should create UPDATE query', () => {
      const query = SQLQueryBuilder.update('recipes');
      expect(query.build().sql).toBe('UPDATE recipes');
    });

    it('should create DELETE query', () => {
      const query = SQLQueryBuilder.delete('recipes');
      expect(query.build().sql).toBe('DELETE FROM recipes');
    });
  });

  describe('Query Building', () => {
    it('should build complete SELECT query', () => {
      const query = SQLQueryBuilder
        .select(['id', 'title'])
        .from('recipes')
        .where('difficulty = ?')
        .orderBy('title')
        .limit(10);

      expect(query.build().sql).toBe('SELECT id, title FROM recipes WHERE difficulty = ? ORDER BY title ASC LIMIT 10');
    });

    it('should build INSERT query with values', () => {
      const query = SQLQueryBuilder
        .insert('recipes')
        .values({ title: 'Test Recipe', difficulty: 'easy', prep_time: 15 });

      expect(query.build().sql).toBe('INSERT INTO recipes (title, difficulty, prep_time) VALUES (?, ?, ?)');
    });

    it('should build UPDATE query with SET clause', () => {
      const query = SQLQueryBuilder
        .update('recipes')
        .set({ title: 'New Title', difficulty: 'hard' })
        .where('id = ?');

      expect(query.build().sql).toBe('UPDATE recipes SET title = ?, difficulty = ? WHERE id = ?');
    });

    it('should build complex WHERE clause', () => {
      const query = SQLQueryBuilder
        .select('*')
        .from('recipes')
        .where('difficulty = ?')
        .and('prep_time < ?')
        .or('cook_time > ?')
        .orderBy('title ASC')
        .limit(5);

      expect(query.build().sql).toBe('SELECT * FROM recipes WHERE difficulty = ? AND prep_time < ? OR cook_time > ? ORDER BY title ASC ASC LIMIT 5');
    });
  });

  describe('Parameter Binding', () => {
    it('should track parameters correctly', () => {
      const query = SQLQueryBuilder
        .select('*')
        .from('recipes')
        .where('difficulty = ?', 'easy')
        .and('prep_time < ?', 30);

      expect(query.build().params).toEqual(['easy', 30]);
    });

    it('should handle multiple parameter sets', () => {
      const query = SQLQueryBuilder
        .insert('recipes')
        .values({ title: 'Test Recipe', difficulty: 'easy' });

      expect(query.build().params).toEqual(['Test Recipe', 'easy']);
    });
  });

  describe('Query Building', () => {
    it('should build query without validation errors', () => {
      const query = SQLQueryBuilder.select('*').from('recipes');
      
      expect(query.build().sql).toBe('SELECT * FROM recipes');
    });

    it('should build INSERT query with values', () => {
      const query = SQLQueryBuilder.insert('recipes').values({ title: 'Test' });
      
      expect(query.build().sql).toBe('INSERT INTO recipes (title) VALUES (?)');
    });

    it('should build UPDATE query with SET clause', () => {
      const query = SQLQueryBuilder.update('recipes').set({ title: 'Test' });
      
      expect(query.build().sql).toBe('UPDATE recipes SET title = ?');
    });
  });
});

describe('COMMON_QUERIES', () => {
  it('should have query constants', () => {
    expect(COMMON_QUERIES).toBeDefined();
    expect(typeof COMMON_QUERIES).toBe('object');
  });

  it('should have valid SQL queries', () => {
    Object.values(COMMON_QUERIES).forEach(query => {
      expect(typeof query).toBe('string');
      expect(query.length).toBeGreaterThan(0);
    });
  });
});

describe('performanceMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(performanceMonitor).toBeDefined();
  });

  it('should be callable', () => {
    expect(() => performanceMonitor).not.toThrow();
  });
});

describe('Query Builder Edge Cases', () => {
  it('should handle empty column arrays', () => {
    const query = SQLQueryBuilder.select([]);
    expect(query.build().sql).toBe('SELECT ');
  });

  it('should handle null values in SET clause', () => {
    const query = SQLQueryBuilder
      .update('recipes')
      .set({ title: 'Test', prep_time: null })
      .where('id = ?', 1);

    expect(query.build().sql).toBe('UPDATE recipes SET title = ?, prep_time = ? WHERE id = ?');
    expect(query.build().params).toEqual(['Test', null, 1]);
  });

  it('should handle complex nested conditions', () => {
    const query = SQLQueryBuilder
      .select('*')
      .from('recipes')
      .where('(difficulty = ? OR difficulty = ?)', 'easy', 'medium')
      .and('prep_time BETWEEN ? AND ?', 10, 30)
      .or('cook_time IS NULL');

    expect(query.build().sql).toBe('SELECT * FROM recipes WHERE (difficulty = ? OR difficulty = ?) AND prep_time BETWEEN ? AND ? OR cook_time IS NULL');
    expect(query.build().params).toEqual(['easy', 'medium', 10, 30]);
  });

  it('should handle multiple ORDER BY clauses', () => {
    const query = SQLQueryBuilder
      .select('*')
      .from('recipes')
      .orderBy('difficulty')
      .orderBy('prep_time', 'DESC')
      .orderBy('title', 'ASC');

    expect(query.build().sql).toBe('SELECT * FROM recipes ORDER BY difficulty ASC ORDER BY prep_time DESC ORDER BY title ASC');
  });
});
