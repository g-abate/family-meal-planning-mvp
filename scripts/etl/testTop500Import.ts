#!/usr/bin/env tsx

/**
 * Test Import Script for recipes_top500.csv
 * 
 * This script tests the ETL pipeline with the smaller 500-recipe dataset
 * to validate the data transformation and import process.
 * 
 * Usage: tsx scripts/etl/testTop500Import.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import { Database } from 'sql.js';
import initSqlJs from 'sql.js';

// Import our data transformation utilities
import { 
  IngredientParser, 
  InstructionParser, 
  RecipeAnalyzer, 
  DataValidator 
} from './dataTransformers';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Type definitions for the CSV data structure
interface CSVRecipe {
  title: string;        // Recipe name
  ingredients: string;  // JSON array of ingredient strings
  directions: string;   // JSON array of cooking instructions
  link: string;         // Recipe URL
  source: string;       // Data source (e.g., "Gathered")
  NER: string;          // Named Entity Recognition data (JSON array)
  site: string;         // Website source
}

// Type for cleaned and validated recipe data
interface ParsedRecipe {
  title: string;
  ingredients: string[]; // Parsed ingredient strings
  directions: string[];  // Parsed instruction strings
  link: string;
  source: string;
  ner: string[];        // Parsed NER data
  site: string;
}

class Top500RecipeImporter {
  private db: Database | null = null;
  private processedCount = 0;
  private errorCount = 0;
  private skippedCount = 0;
  private SQLModule: awaitedReturnType<typeof initSqlJs> | null = null;

  async initialize(): Promise<void> {
    console.log('Initializing SQLite database...');
    this.SQLModule = await initSqlJs();
    
    // Create database in memory
    this.db = new this.SQLModule.Database();
    
    // Read and execute the simplified schema
    const schemaPath = path.join(__dirname, 'schema-simple.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    this.db.exec(schema);
    
    console.log('Database initialized successfully');
  }

  parseCSVRow(row: CSVRecipe): ParsedRecipe | null {
    try {
      // Parse JSON arrays with error handling
      let ingredients: string[] = [];
      let directions: string[] = [];
      let ner: string[] = [];

      try {
        ingredients = JSON.parse(row.ingredients || '[]');
      } catch (e) {
        console.warn(`Failed to parse ingredients for "${row.title}": ${e}`);
        return null;
      }

      try {
        directions = JSON.parse(row.directions || '[]');
      } catch (e) {
        console.warn(`Failed to parse directions for "${row.title}": ${e}`);
        return null;
      }

      try {
        ner = JSON.parse(row.NER || '[]');
      } catch (e) {
        // NER is optional, so we can continue
        ner = [];
      }

      // Clean and validate the data
      const cleanedData = DataValidator.cleanRecipeData({
        title: row.title,
        ingredients,
        directions,
        link: row.link,
        source: row.source,
        site: row.site
      });

      // Validate the recipe
      const validation = DataValidator.validateRecipe(cleanedData);
      if (!validation.isValid) {
        console.warn(`Invalid recipe "${row.title}": ${validation.errors.join(', ')}`);
        return null;
      }

      return {
        title: cleanedData.title,
        ingredients: cleanedData.ingredients,
        directions: cleanedData.directions,
        link: cleanedData.link,
        source: cleanedData.source,
        ner,
        site: cleanedData.site
      };
    } catch (error) {
      console.warn(`Error parsing row: ${error}`);
      return null;
    }
  }

  async insertRecipe(recipe: ParsedRecipe): Promise<number | null> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Analyze recipe to extract metadata
      const safeIngredients = recipe.ingredients || [];
      const safeDirections = recipe.directions || [];
      
      const difficulty = RecipeAnalyzer.analyzeDifficulty(safeIngredients, safeDirections);
      const dietaryTags = RecipeAnalyzer.extractDietaryTags(safeIngredients);
      const times = RecipeAnalyzer.estimateCookingTimes(safeDirections);

      // Insert main recipe record
      const insertRecipe = this.db.prepare(`
        INSERT INTO recipes (
          title, prep_time, cook_time, total_time, 
          difficulty, source_url, created_at, updated_at, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)
      `);

      const totalTime = (times.prepTime || 0) + (times.cookTime || 0);

      const insertValues = [
        recipe.title,
        times.prepTime || null,
        times.cookTime || null,
        totalTime || null,
        difficulty,
        recipe.link || null,
        true
      ];

      let result;
      try {
        result = insertRecipe.run(insertValues);
      } catch (error) {
        console.error('SQLite insert error:', error);
        console.error('Insert values:', insertValues);
        return null;
      }

      // Handle different result formats
      let recipeId;
      if (typeof result === 'boolean' && result === true) {
        // If result is true, we need to get the last insert ID differently
        const lastIdResult = this.db!.exec('SELECT last_insert_rowid() as id');
        recipeId = lastIdResult[0]?.values[0]?.[0] as number;
      } else if (result && typeof result === 'object' && 'lastInsertRowid' in result) {
        recipeId = result.lastInsertRowid as number;
      } else {
        console.error('Unexpected insert result format:', result);
        return null;
      }

      if (!recipeId) {
        console.error('Failed to get recipe ID from insert result');
        return null;
      }

      // Insert ingredients using intelligent parsing
      if (recipe.ingredients && recipe.ingredients.length > 0) {
        const insertIngredient = this.db.prepare(`
          INSERT INTO recipe_ingredients (
            recipe_id, ingredient_name, quantity, unit, sort_order, kind, is_optional
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        recipe.ingredients.forEach((ingredientStr, index) => {
          // Skip if ingredient string is undefined or empty
          if (!ingredientStr || typeof ingredientStr !== 'string') {
            return;
          }

          const parsedIngredient = IngredientParser.parseIngredient(ingredientStr);
          
          try {
            insertIngredient.run([
              recipeId,
              parsedIngredient.ingredient_name || 'Unknown ingredient',
              parsedIngredient.quantity || null,
              parsedIngredient.unit || null,
              index,
              parsedIngredient.kind || 'other',
              parsedIngredient.is_optional || false
            ]);
          } catch (error) {
            console.error(`Error inserting ingredient ${index}:`, error);
          }
        });
      }

      // Insert instructions using intelligent parsing
      if (recipe.directions && recipe.directions.length > 0) {
        const insertInstruction = this.db.prepare(`
          INSERT INTO recipe_instructions (
            recipe_id, step_number, instruction, prep_time, cook_time, temperature
          ) VALUES (?, ?, ?, ?, ?, ?)
        `);

        recipe.directions.forEach((instructionStr, index) => {
          // Skip if instruction string is undefined or empty
          if (!instructionStr || typeof instructionStr !== 'string') {
            return;
          }

          const parsedInstruction = InstructionParser.parseInstruction(instructionStr, index + 1);
          
          insertInstruction.run([
            recipeId,
            parsedInstruction.step_number,
            parsedInstruction.instruction || 'No instruction provided',
            parsedInstruction.prep_time || null,
            parsedInstruction.cook_time || null,
            parsedInstruction.temperature || null
          ]);
        });
      }

      // Insert tags
      const insertTag = this.db.prepare(`
        INSERT OR IGNORE INTO recipe_tags (
          recipe_id, tag_name, tag_type
        ) VALUES (?, ?, ?)
      `);

      // Add dietary tags
      dietaryTags.forEach(tag => {
        insertTag.run([recipeId, tag, 'dietary']);
      });

      // Add source as cuisine tag
      if (recipe.source) {
        insertTag.run([recipeId, recipe.source.toLowerCase(), 'cuisine']);
      }

      // Add site as category tag
      if (recipe.site) {
        insertTag.run([recipeId, recipe.site.toLowerCase(), 'category']);
      }

      // Add difficulty as category tag
      insertTag.run([recipeId, difficulty, 'category']);

      // Add cooking method tags based on instructions
      const instructionText = recipe.directions.join(' ').toLowerCase();
      const cookingMethods = [
        'baked', 'grilled', 'fried', 'boiled', 'steamed', 'roasted', 
        'sautéed', 'braised', 'slow-cooked', 'raw'
      ];
      
      cookingMethods.forEach(method => {
        if (instructionText.includes(method)) {
          insertTag.run([recipeId, method, 'cooking_method']);
        }
      });

      return recipeId;
    } catch (error) {
      console.warn(`Error inserting recipe "${recipe.title}": ${error}`);
      return null;
    }
  }

  async processCSVFile(filePath: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    console.log(`Starting to process CSV file: ${filePath}`);

    const parser = parse({
      columns: false, // Don't use first row as headers
      skip_empty_lines: true,
      trim: true,
      skip_records_with_error: true
    });

    let rowCount = 0;
    let isFirstRow = true;
    let isSecondRow = true;
    let dataRowCount = 0;

    return new Promise((resolve, reject) => {
      const readStream = createReadStream(filePath);
      let isProcessingComplete = false;

      const finalize = async () => {
        if (isProcessingComplete) return;
        isProcessingComplete = true;

        console.log(`\n=== Import Summary ===`);
        console.log(`Total rows processed: ${rowCount}`);
        console.log(`Recipes imported: ${this.processedCount}`);
        console.log(`Recipes skipped: ${this.skippedCount}`);
        console.log(`Errors: ${this.errorCount}`);

        try {
          console.log('Saving database...');
          await this.saveDatabase();
          console.log('Database save completed');
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      readStream
        .pipe(parser)
        .on('data', async (row: string[]) => {
          if (isProcessingComplete) {
            return;
          }

          rowCount++;
          
          // Skip the first row (Column1,Column2,etc.)
          if (isFirstRow) {
            isFirstRow = false;
            return;
          }
          
          // Skip the second row (title,ingredients,directions,etc.) - these are the actual column names
          if (isSecondRow) {
            isSecondRow = false;
            return;
          }
          
          // Now process the actual data rows
          const csvRecipe: CSVRecipe = {
            title: row[0] || '',
            ingredients: row[1] || '',
            directions: row[2] || '',
            link: row[3] || '',
            source: row[4] || '',
            NER: row[5] || '',
            site: row[6] || ''
          };
          
          const parsedRecipe = this.parseCSVRow(csvRecipe);
          if (parsedRecipe) {
            const recipeId = await this.insertRecipe(parsedRecipe);
            if (recipeId) {
              this.processedCount++;
            } else {
              this.errorCount++;
            }
          } else {
            this.skippedCount++;
          }

          dataRowCount++;

          // Progress update every 100 rows
          if (rowCount % 100 === 0) {
            console.log(`Progress: ${rowCount} rows processed, ${this.processedCount} imported, ${this.errorCount} errors, ${this.skippedCount} skipped`);
          }
        })
        .on('end', () => {
          finalize().catch(reject);
        })
        .on('error', (error) => {
          console.error('Error processing CSV:', error);
          if (!isProcessingComplete) {
            isProcessingComplete = true;
            reject(error);
          }
        });
    });
  }

  async saveDatabase(): Promise<void> {
    if (!this.db || !this.SQLModule) return;

    const dbPath = path.join(__dirname, '../../src/database/recipes.db');
    
    // Debug: Check database state before saving
    const ingredientCount = this.db.exec('SELECT COUNT(*) as count FROM recipe_ingredients')[0]?.values[0]?.[0];
    console.log(`Database has ${ingredientCount} ingredients before saving`);
    
    const data = this.db.export();
    fs.writeFileSync(dbPath, data);
    console.log(`Database saved to: ${dbPath}`);
    
    // Verify the saved file
    const savedData = fs.readFileSync(dbPath);
    const verifyDb = new this.SQLModule.Database(savedData);
    const savedIngredientCount = verifyDb.exec('SELECT COUNT(*) as count FROM recipe_ingredients')[0]?.values[0]?.[0];
    console.log(`Saved database has ${savedIngredientCount} ingredients`);
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  // Method to show sample of parsed data
  async showSampleData(): Promise<void> {
    if (!this.db) return;

    // Get a sample recipe
    const sampleRecipe = this.db.exec(`
      SELECT r.id, r.title, r.difficulty, r.prep_time, r.cook_time, r.total_time
      FROM recipes r 
      LIMIT 1
    `);

    if (sampleRecipe.length > 0 && sampleRecipe[0].values.length > 0) {
      const [recipeId, title, difficulty, prepTime, cookTime, totalTime] = sampleRecipe[0].values[0];

      // Get sample ingredients
      const sampleIngredients = this.db.exec(`
        SELECT ri.ingredient_name, ri.quantity, ri.unit, ri.kind
        FROM recipe_ingredients ri
        WHERE ri.recipe_id = ${recipeId}
        LIMIT 5
      `);

      // Optionally, we could log a summary or perform additional checks here
    } else {
      console.log('No recipes found in database to display sample data.');
    }
  }
}

// Main execution
async function main() {
  const csvPath = '/Users/gideonabate/Downloads/recipes_top500.csv';

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  const importer = new Top500RecipeImporter();
  
  try {
    await importer.initialize();
    await importer.processCSVFile(csvPath);
    await importer.showSampleData();
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  } finally {
    await importer.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { Top500RecipeImporter };
