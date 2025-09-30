-- Simplified SQLite Schema for Recipe Import
-- Version: 1.0
-- Created: 2024

-- Recipes table - stores all recipe information
CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    prep_time INTEGER, -- minutes
    cook_time INTEGER, -- minutes
    total_time INTEGER, -- minutes (calculated)
    servings INTEGER DEFAULT 1,
    difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'easy',
    image_url TEXT,
    source_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Nutritional information (optional for MVP)
    calories_per_serving INTEGER,
    protein_per_serving REAL, -- grams
    carbs_per_serving REAL,   -- grams
    fat_per_serving REAL,     -- grams
    
    -- Metadata
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Recipe ingredients table - stores ingredients with quantities
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER NOT NULL,
    ingredient_name TEXT NOT NULL,
    quantity REAL,
    unit TEXT, -- cups, tbsp, tsp, lbs, oz, etc.
    notes TEXT, -- optional preparation notes
    is_optional BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    kind TEXT CHECK(kind IN ('protein_main', 'protein_source', 'vegetable', 'grain', 'dairy', 'fat', 'spice', 'fruit', 'nuts_seeds', 'condiments', 'other')) DEFAULT 'other',
    
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- Recipe instructions table - stores step-by-step cooking instructions
CREATE TABLE IF NOT EXISTS recipe_instructions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER NOT NULL,
    step_number INTEGER NOT NULL,
    instruction TEXT NOT NULL,
    prep_time INTEGER, -- minutes for this step
    cook_time INTEGER, -- minutes for this step
    temperature INTEGER, -- degrees F/C
    notes TEXT, -- optional notes for this step
    
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- Recipe tags table - stores dietary and category tags
CREATE TABLE IF NOT EXISTS recipe_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER NOT NULL,
    tag_name TEXT NOT NULL,
    tag_type TEXT CHECK(tag_type IN ('dietary', 'category', 'cuisine', 'cooking_method')) NOT NULL,
    
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    UNIQUE(recipe_id, tag_name, tag_type)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_recipes_total_time ON recipes(total_time);
CREATE INDEX IF NOT EXISTS idx_recipes_is_active ON recipes(is_active);
CREATE INDEX IF NOT EXISTS idx_recipes_is_featured ON recipes(is_featured);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at);

CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient_name ON recipe_ingredients(ingredient_name);

CREATE INDEX IF NOT EXISTS idx_recipe_instructions_recipe_id ON recipe_instructions(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_instructions_step_number ON recipe_instructions(recipe_id, step_number);

CREATE INDEX IF NOT EXISTS idx_recipe_tags_recipe_id ON recipe_tags(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_tags_tag_name ON recipe_tags(tag_name);
CREATE INDEX IF NOT EXISTS idx_recipe_tags_tag_type ON recipe_tags(tag_type);

-- Enhanced constraints and indexes
CREATE UNIQUE INDEX IF NOT EXISTS uq_recipe_ingredients_order ON recipe_ingredients(recipe_id, sort_order);
CREATE UNIQUE INDEX IF NOT EXISTS uq_recipe_instructions_step ON recipe_instructions(recipe_id, step_number);
CREATE INDEX IF NOT EXISTS idx_recipe_tags_type_name ON recipe_tags(tag_type, tag_name);
