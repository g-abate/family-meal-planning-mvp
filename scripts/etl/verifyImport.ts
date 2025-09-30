#!/usr/bin/env tsx

/**
 * Verification Script for Recipe Import
 * 
 * This script checks that the imported data is correctly stored in all tables.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { Database } from 'sql.js';
import initSqlJs from 'sql.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifyImport() {
  console.log('Loading database...');
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, '../../src/database/recipes.db');
  
  if (!fs.existsSync(dbPath)) {
    console.error('Database file not found:', dbPath);
    return;
  }
  
  const data = fs.readFileSync(dbPath);
  const db = new SQL.Database(data);
  
  console.log('\n=== Database Verification ===\n');
  
  // Check recipes table
  const recipes = db.exec('SELECT COUNT(*) as count FROM recipes');
  console.log(`📊 Recipes: ${recipes[0].values[0][0]} records`);
  
  // Check recipe_ingredients table
  const ingredients = db.exec('SELECT COUNT(*) as count FROM recipe_ingredients');
  console.log(`🥘 Ingredients: ${ingredients[0].values[0][0]} records`);
  
  // Check recipe_instructions table
  const instructions = db.exec('SELECT COUNT(*) as count FROM recipe_instructions');
  console.log(`📝 Instructions: ${instructions[0].values[0][0]} records`);
  
  // Check recipe_tags table
  const tags = db.exec('SELECT COUNT(*) as count FROM recipe_tags');
  console.log(`🏷️  Tags: ${tags[0].values[0][0]} records`);
  
  console.log('\n=== Sample Recipe Data ===\n');
  
  // Get a sample recipe with all its data
  const sampleRecipe = db.exec(`
    SELECT r.id, r.title, r.difficulty, r.prep_time, r.cook_time, r.total_time, r.source_url
    FROM recipes r 
    ORDER BY r.id 
    LIMIT 1
  `);
 
  if (sampleRecipe.length > 0) {
    const [recipeId, title, difficulty, prepTime, cookTime, totalTime, sourceUrl] = sampleRecipe[0].values[0];
    console.log(`🍽️  Sample Recipe: ${title} (ID: ${recipeId})`);
    console.log(`   Difficulty: ${difficulty}, Prep: ${prepTime}min, Cook: ${cookTime}min, Total: ${totalTime}min`);
    if (sourceUrl) {
      console.log(`   Source URL: ${sourceUrl}`);
    }
    
    // Get ingredients for this recipe
    const recipeIngredients = db.exec(`
      SELECT ingredient_name, quantity, unit, kind
      FROM recipe_ingredients 
      WHERE recipe_id = ${recipeId}
      ORDER BY sort_order
    `);
    
    if (recipeIngredients.length > 0) {
      console.log(`\n   🥘 Ingredients (${recipeIngredients[0].values.length}):`);
      recipeIngredients[0].values.forEach((ingredient: any, index: number) => {
        const qty = ingredient[1] ? `${ingredient[1]} ` : '';
        const unit = ingredient[2] ? `${ingredient[2]} ` : '';
        console.log(`      ${index + 1}. ${qty}${unit}${ingredient[0]} (${ingredient[3]})`);
      });
    }
    
    // Get instructions for this recipe
    const recipeInstructions = db.exec(`
      SELECT step_number, instruction, prep_time, cook_time, temperature
      FROM recipe_instructions 
      WHERE recipe_id = ${recipeId}
      ORDER BY step_number
    `);
    
    if (recipeInstructions.length > 0) {
      console.log(`\n   📝 Instructions (${recipeInstructions[0].values.length}):`);
      recipeInstructions[0].values.forEach((instruction: any) => {
        const timing = instruction[2] || instruction[3] ? ` (${instruction[2] || 0}min prep, ${instruction[3] || 0}min cook)` : '';
        const temp = instruction[4] ? ` @ ${instruction[4]}°F` : '';
        console.log(`      ${instruction[0]}. ${instruction[1]}${timing}${temp}`);
      });
    }
    
    // Get tags for this recipe
    const recipeTags = db.exec(`
      SELECT tag_name, tag_type
      FROM recipe_tags 
      WHERE recipe_id = ${recipeId}
      ORDER BY tag_type, tag_name
    `);
    
    if (recipeTags.length > 0) {
      console.log(`\n   🏷️  Tags (${recipeTags[0].values.length}):`);
      const tagsByType: { [key: string]: string[] } = {};
      recipeTags[0].values.forEach((tag: any) => {
        if (!tagsByType[tag[1]]) tagsByType[tag[1]] = [];
        tagsByType[tag[1]].push(tag[0]);
      });
      
      Object.entries(tagsByType).forEach(([type, tags]) => {
        console.log(`      ${type}: ${tags.join(', ')}`);
      });
    }
  }
  
  console.log('\n=== Data Quality Checks ===\n');
  
  // Check for any missing data
  const missingIngredients = db.exec(`
    SELECT COUNT(*) as count 
    FROM recipes r 
    LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id 
    WHERE ri.recipe_id IS NULL
  `);
  console.log(`❌ Recipes without ingredients: ${missingIngredients[0].values[0][0]}`);
  
  const missingInstructions = db.exec(`
    SELECT COUNT(*) as count 
    FROM recipes r 
    LEFT JOIN recipe_instructions ri ON r.id = ri.recipe_id 
    WHERE ri.recipe_id IS NULL
  `);
  console.log(`❌ Recipes without instructions: ${missingInstructions[0].values[0][0]}`);
  
  // Check ingredient parsing quality
  const ingredientStats = db.exec(`
    SELECT 
      COUNT(*) as total,
      COUNT(quantity) as with_quantity,
      COUNT(unit) as with_unit,
      COUNT(CASE WHEN kind = 'other' THEN 1 END) as unclassified
    FROM recipe_ingredients
  `);
  
  const stats = ingredientStats[0].values[0];
  console.log(`\n📈 Ingredient Parsing Stats:`);
  console.log(`   Total ingredients: ${stats[0]}`);
  console.log(`   With quantity: ${stats[1]} (${Math.round(stats[1]/stats[0]*100)}%)`);
  console.log(`   With unit: ${stats[2]} (${Math.round(stats[2]/stats[0]*100)}%)`);
  console.log(`   Unclassified: ${stats[3]} (${Math.round(stats[3]/stats[0]*100)}%)`);
  
  db.close();
  console.log('\n✅ Verification complete!');
}

verifyImport().catch(console.error);
