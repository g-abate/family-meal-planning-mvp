// Build script to generate versioned recipes.sqlite
// Processes recipe JSON data and creates SQLite database with FTS5 index
// Version: 1.0

import Database from 'better-sqlite3';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const RECIPES_JSON_PATH = join(__dirname, 'recipes.json');
const OUTPUT_DB_PATH = join(__dirname, '../../public/recipes.sqlite');
const SCHEMA_PATH = join(__dirname, '../../src/database/schema.sql');

interface RecipeData {
  id: number;
  title: string;
  description?: string;
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  image_url?: string;
  source_url?: string;
  calories_per_serving?: number;
  protein_per_serving?: number;
  carbs_per_serving?: number;
  fat_per_serving?: number;
  is_featured?: boolean;
  ingredients: {
    name: string;
    quantity?: number;
    unit?: string;
    notes?: string;
    is_optional?: boolean;
    kind?: 'protein_main' | 'protein_source' | 'vegetable' | 'grain' | 'dairy' | 'fat' | 'spice' | 'other';
  }[];
  instructions: {
    step: number;
    instruction: string;
    prep_time?: number;
    cook_time?: number;
    temperature?: number;
    notes?: string;
  }[];
  tags: {
    name: string;
    type: 'dietary' | 'category' | 'cuisine' | 'cooking_method';
  }[];
}

function loadRecipeData(): RecipeData[] {
  if (!existsSync(RECIPES_JSON_PATH)) {
    console.warn(`Recipe data file not found at ${RECIPES_JSON_PATH}`);
    console.log('Creating sample recipe data...');
    return createSampleRecipeData();
  }

  try {
    const data = readFileSync(RECIPES_JSON_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load recipe data:', error);
    throw error;
  }
}

function createSampleRecipeData(): RecipeData[] {
  return [
    {
      id: 1,
      title: "Classic Spaghetti Carbonara",
      description: "A creamy Italian pasta dish with eggs, cheese, and pancetta",
      prep_time: 15,
      cook_time: 20,
      servings: 4,
      difficulty: "medium",
      image_url: "https://example.com/carbonara.jpg",
      calories_per_serving: 520,
      protein_per_serving: 28,
      carbs_per_serving: 45,
      fat_per_serving: 25,
      is_featured: true,
      ingredients: [
        { name: "spaghetti", quantity: 400, unit: "g", kind: "grain" },
        { name: "pancetta", quantity: 150, unit: "g", kind: "protein_main" },
        { name: "eggs", quantity: 3, unit: "large", kind: "protein_source" },
        { name: "parmesan cheese", quantity: 75, unit: "g", notes: "grated", kind: "dairy" },
        { name: "black pepper", quantity: 1, unit: "tsp", kind: "spice" },
        { name: "salt", quantity: 1, unit: "tsp", kind: "spice" }
      ],
      instructions: [
        {
          step: 1,
          instruction: "Bring a large pot of salted water to boil and cook spaghetti according to package directions",
          prep_time: 5
        },
        {
          step: 2,
          instruction: "While pasta cooks, dice pancetta and cook in a large pan until crispy",
          prep_time: 5,
          cook_time: 8
        },
        {
          step: 3,
          instruction: "Beat eggs with grated parmesan and black pepper in a bowl",
          prep_time: 2
        },
        {
          step: 4,
          instruction: "Drain pasta, reserving 1 cup of pasta water, and add to pancetta pan",
          cook_time: 2
        },
        {
          step: 5,
          instruction: "Remove from heat, add egg mixture and pasta water, tossing quickly to create creamy sauce",
          cook_time: 1
        }
      ],
      tags: [
        { name: "italian", type: "cuisine" },
        { name: "main-course", type: "category" },
        { name: "quick", type: "category" },
        { name: "vegetarian", type: "dietary" }
      ]
    },
    {
      id: 2,
      title: "Grilled Salmon with Lemon Herb Butter",
      description: "Perfectly grilled salmon with a bright lemon herb butter sauce",
      prep_time: 10,
      cook_time: 15,
      servings: 4,
      difficulty: "easy",
      calories_per_serving: 380,
      protein_per_serving: 35,
      carbs_per_serving: 2,
      fat_per_serving: 24,
      is_featured: true,
      ingredients: [
        { name: "salmon fillets", quantity: 4, unit: "pieces", notes: "6 oz each", kind: "protein_main" },
        { name: "butter", quantity: 4, unit: "tbsp", kind: "fat" },
        { name: "lemon", quantity: 1, unit: "large", notes: "juiced and zested", kind: "vegetable" },
        { name: "fresh dill", quantity: 2, unit: "tbsp", notes: "chopped", kind: "spice" },
        { name: "fresh parsley", quantity: 2, unit: "tbsp", notes: "chopped", kind: "spice" },
        { name: "garlic", quantity: 2, unit: "cloves", notes: "minced", kind: "vegetable" },
        { name: "olive oil", quantity: 2, unit: "tbsp", kind: "fat" },
        { name: "salt", quantity: 1, unit: "tsp", kind: "spice" },
        { name: "black pepper", quantity: 0.5, unit: "tsp", kind: "spice" }
      ],
      instructions: [
        {
          step: 1,
          instruction: "Preheat grill to medium-high heat",
          prep_time: 5
        },
        {
          step: 2,
          instruction: "Mix butter with lemon juice, zest, herbs, and garlic",
          prep_time: 5
        },
        {
          step: 3,
          instruction: "Brush salmon with olive oil and season with salt and pepper",
          prep_time: 2
        },
        {
          step: 4,
          instruction: "Grill salmon for 4-5 minutes per side until cooked through",
          cook_time: 10
        },
        {
          step: 5,
          instruction: "Serve with lemon herb butter on top"
        }
      ],
      tags: [
        { name: "pescatarian", type: "dietary" },
        { name: "gluten-free", type: "dietary" },
        { name: "main-course", type: "category" },
        { name: "grilled", type: "cooking_method" },
        { name: "american", type: "cuisine" }
      ]
    },
    {
      id: 3,
      title: "Mediterranean Quinoa Bowl",
      description: "A healthy and colorful bowl with quinoa, vegetables, and tahini dressing",
      prep_time: 20,
      cook_time: 15,
      servings: 4,
      difficulty: "easy",
      calories_per_serving: 420,
      protein_per_serving: 18,
      carbs_per_serving: 52,
      fat_per_serving: 16,
      ingredients: [
        { name: "quinoa", quantity: 1, unit: "cup", notes: "dry", kind: "grain" },
        { name: "cherry tomatoes", quantity: 1, unit: "cup", notes: "halved", kind: "vegetable" },
        { name: "cucumber", quantity: 1, unit: "medium", notes: "diced", kind: "vegetable" },
        { name: "red bell pepper", quantity: 1, unit: "medium", notes: "diced", kind: "vegetable" },
        { name: "kalamata olives", quantity: 0.5, unit: "cup", notes: "pitted", kind: "fat" },
        { name: "red onion", quantity: 0.25, unit: "cup", notes: "thinly sliced", kind: "vegetable" },
        { name: "feta cheese", quantity: 0.5, unit: "cup", notes: "crumbled", kind: "dairy" },
        { name: "fresh parsley", quantity: 0.25, unit: "cup", notes: "chopped", kind: "spice" },
        { name: "tahini", quantity: 3, unit: "tbsp", kind: "fat" },
        { name: "lemon juice", quantity: 3, unit: "tbsp", kind: "vegetable" },
        { name: "olive oil", quantity: 2, unit: "tbsp", kind: "fat" },
        { name: "garlic", quantity: 1, unit: "clove", notes: "minced", kind: "vegetable" },
        { name: "salt", quantity: 0.5, unit: "tsp", kind: "spice" },
        { name: "black pepper", quantity: 0.25, unit: "tsp", kind: "spice" }
      ],
      instructions: [
        {
          step: 1,
          instruction: "Cook quinoa according to package directions and let cool",
          cook_time: 15
        },
        {
          step: 2,
          instruction: "Prepare all vegetables and set aside",
          prep_time: 10
        },
        {
          step: 3,
          instruction: "Make dressing by whisking tahini, lemon juice, olive oil, garlic, salt, and pepper",
          prep_time: 5
        },
        {
          step: 4,
          instruction: "Combine quinoa with vegetables and olives",
          prep_time: 5
        },
        {
          step: 5,
          instruction: "Drizzle with dressing and top with feta cheese and parsley"
        }
      ],
      tags: [
        { name: "vegetarian", type: "dietary" },
        { name: "gluten-free", type: "dietary" },
        { name: "main-course", type: "category" },
        { name: "mediterranean", type: "cuisine" },
        { name: "healthy", type: "category" }
      ]
    }
  ];
}

function createDatabase(): Database.Database {
  console.log('Creating SQLite database...');
  
  // Ensure output directory exists
  const outputDir = dirname(OUTPUT_DB_PATH);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const db = new Database(OUTPUT_DB_PATH);
  
  // Enable foreign keys and optimize for performance
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('cache_size = 10000');
  db.pragma('temp_store = MEMORY');

  return db;
}

function loadSchema(db: Database.Database): void {
  console.log('Loading database schema...');
  
  if (!existsSync(SCHEMA_PATH)) {
    throw new Error(`Schema file not found at ${SCHEMA_PATH}`);
  }

  const schema = readFileSync(SCHEMA_PATH, 'utf-8');
  
  // Split schema into individual statements and execute
  const statements = schema
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);

  for (const statement of statements) {
    try {
      db.exec(statement);
    } catch (error) {
      console.warn(`Warning: Failed to execute statement: ${statement.substring(0, 50)}...`);
      console.warn(`Error: ${error}`);
    }
  }
}

function insertRecipeData(db: Database.Database, recipes: RecipeData[]): void {
  console.log(`Inserting ${recipes.length} recipes...`);

  const insertRecipe = db.prepare(`
    INSERT INTO recipes (
      id, title, description, prep_time, cook_time, total_time, servings, 
      difficulty, image_url, source_url, calories_per_serving, protein_per_serving,
      carbs_per_serving, fat_per_serving, is_featured, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertIngredient = db.prepare(`
    INSERT INTO recipe_ingredients (
      recipe_id, ingredient_name, quantity, unit, notes, is_optional, sort_order, kind
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertInstruction = db.prepare(`
    INSERT INTO recipe_instructions (
      recipe_id, step_number, instruction, prep_time, cook_time, temperature, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertTag = db.prepare(`
    INSERT INTO recipe_tags (recipe_id, tag_name, tag_type)
    VALUES (?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    for (const recipe of recipes) {
      // Calculate total time
      const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

      // Insert recipe
      insertRecipe.run(
        recipe.id,
        recipe.title,
        recipe.description || null,
        recipe.prep_time || null,
        recipe.cook_time || null,
        totalTime || null,
        recipe.servings || 1,
        recipe.difficulty || 'easy',
        recipe.image_url || null,
        recipe.source_url || null,
        recipe.calories_per_serving || null,
        recipe.protein_per_serving || null,
        recipe.carbs_per_serving || null,
        recipe.fat_per_serving || null,
        recipe.is_featured || false,
        true // is_active
      );

      // Insert ingredients
      recipe.ingredients.forEach((ingredient, index) => {
        insertIngredient.run(
          recipe.id,
          ingredient.name,
          ingredient.quantity || null,
          ingredient.unit || null,
          ingredient.notes || null,
          ingredient.is_optional || false,
          index,
          ingredient.kind || 'other'
        );
      });

      // Insert instructions
      recipe.instructions.forEach((instruction) => {
        insertInstruction.run(
          recipe.id,
          instruction.step,
          instruction.instruction,
          instruction.prep_time || null,
          instruction.cook_time || null,
          instruction.temperature || null,
          instruction.notes || null
        );
      });

      // Insert tags
      recipe.tags.forEach((tag) => {
        insertTag.run(recipe.id, tag.name, tag.type);
      });
    }
  });

  transaction();
}

function optimizeDatabase(db: Database.Database): void {
  console.log('Optimizing database...');
  
  // Analyze tables for better query planning
  db.exec('ANALYZE');
  
  // Vacuum to optimize storage
  db.exec('VACUUM');
  
  // Get database statistics
  const stats = db.prepare(`
    SELECT 
      (SELECT COUNT(*) FROM recipes) as recipe_count,
      (SELECT COUNT(*) FROM recipe_ingredients) as ingredient_count,
      (SELECT COUNT(*) FROM recipe_instructions) as instruction_count,
      (SELECT COUNT(*) FROM recipe_tags) as tag_count
  `).get();

  console.log('Database statistics:', stats);
}

function main(): void {
  try {
    console.log('Starting recipe database build...');
    
    // Load recipe data
    const recipes = loadRecipeData();
    console.log(`Loaded ${recipes.length} recipes`);

    // Create and configure database
    const db = createDatabase();
    
    // Load schema
    loadSchema(db);
    
    // Insert recipe data
    insertRecipeData(db, recipes);
    
    // Optimize database
    optimizeDatabase(db);
    
    // Close database
    db.close();
    
    console.log(`✅ Recipe database built successfully at ${OUTPUT_DB_PATH}`);
    
  } catch (error) {
    console.error('❌ Failed to build recipe database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as buildRecipes };
