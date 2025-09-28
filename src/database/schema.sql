-- SQLite Schema for Family Meal Planning MVP
-- Version: 1.0
-- Created: 2024

-- Enable FTS5 extension for full-text search
-- Note: FTS5 is included in modern SQLite builds

-- Recipes table - stores all recipe information
CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
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
    kind TEXT CHECK(kind IN ('protein_main', 'protein_source', 'vegetable', 'grain', 'dairy', 'fat', 'spice', 'other')) DEFAULT 'other',
    
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

-- FTS5 Virtual Table for full-text recipe search
-- This enables fast searching across recipe titles, descriptions, and ingredients
CREATE VIRTUAL TABLE IF NOT EXISTS recipes_fts USING fts5(
    recipe_id UNINDEXED,
    title,
    description,
    ingredients,
    instructions,
    tags,
    content='recipes',
    content_rowid='id'
);

-- Triggers to keep FTS5 index in sync with main tables
-- Insert trigger for new recipes - MUST use rowid = NEW.id
CREATE TRIGGER IF NOT EXISTS recipes_fts_insert AFTER INSERT ON recipes BEGIN
    INSERT INTO recipes_fts(
        rowid,
        recipe_id, 
        title, 
        description, 
        ingredients, 
        instructions, 
        tags
    ) VALUES (
        NEW.id,
        NEW.id,
        NEW.title,
        COALESCE(NEW.description, ''),
        (SELECT GROUP_CONCAT(ingredient_name, ' ') FROM recipe_ingredients WHERE recipe_id = NEW.id),
        (SELECT GROUP_CONCAT(instruction, ' ') FROM recipe_instructions WHERE recipe_id = NEW.id ORDER BY step_number),
        (SELECT GROUP_CONCAT(tag_name, ' ') FROM recipe_tags WHERE recipe_id = NEW.id)
    );
END;

-- Update trigger for recipe changes - MUST use rowid = NEW.id
CREATE TRIGGER IF NOT EXISTS recipes_fts_update AFTER UPDATE ON recipes BEGIN
    UPDATE recipes_fts SET
        title = NEW.title,
        description = COALESCE(NEW.description, ''),
        ingredients = (SELECT GROUP_CONCAT(ingredient_name, ' ') FROM recipe_ingredients WHERE recipe_id = NEW.id),
        instructions = (SELECT GROUP_CONCAT(instruction, ' ') FROM recipe_instructions WHERE recipe_id = NEW.id ORDER BY step_number),
        tags = (SELECT GROUP_CONCAT(tag_name, ' ') FROM recipe_tags WHERE recipe_id = NEW.id)
    WHERE rowid = NEW.id;
END;

-- Delete trigger for recipe removal - MUST use rowid = OLD.id
CREATE TRIGGER IF NOT EXISTS recipes_fts_delete AFTER DELETE ON recipes BEGIN
    DELETE FROM recipes_fts WHERE rowid = OLD.id;
END;

-- Triggers to update FTS5 when ingredients change - MUST use rowid
CREATE TRIGGER IF NOT EXISTS recipe_ingredients_fts_update AFTER INSERT ON recipe_ingredients BEGIN
    UPDATE recipes_fts SET
        ingredients = (SELECT GROUP_CONCAT(ingredient_name, ' ') FROM recipe_ingredients WHERE recipe_id = NEW.recipe_id)
    WHERE rowid = NEW.recipe_id;
END;

CREATE TRIGGER IF NOT EXISTS recipe_ingredients_fts_delete AFTER DELETE ON recipe_ingredients BEGIN
    UPDATE recipes_fts SET
        ingredients = (SELECT GROUP_CONCAT(ingredient_name, ' ') FROM recipe_ingredients WHERE recipe_id = OLD.recipe_id)
    WHERE rowid = OLD.recipe_id;
END;

-- Triggers to update FTS5 when instructions change - MUST use rowid
CREATE TRIGGER IF NOT EXISTS recipe_instructions_fts_update AFTER INSERT ON recipe_instructions BEGIN
    UPDATE recipes_fts SET
        instructions = (SELECT GROUP_CONCAT(instruction, ' ') FROM recipe_instructions WHERE recipe_id = NEW.recipe_id ORDER BY step_number)
    WHERE rowid = NEW.recipe_id;
END;

CREATE TRIGGER IF NOT EXISTS recipe_instructions_fts_delete AFTER DELETE ON recipe_instructions BEGIN
    UPDATE recipes_fts SET
        instructions = (SELECT GROUP_CONCAT(instruction, ' ') FROM recipe_instructions WHERE recipe_id = OLD.recipe_id ORDER BY step_number)
    WHERE rowid = OLD.recipe_id;
END;

-- Triggers to update FTS5 when tags change - MUST use rowid
CREATE TRIGGER IF NOT EXISTS recipe_tags_fts_update AFTER INSERT ON recipe_tags BEGIN
    UPDATE recipes_fts SET
        tags = (SELECT GROUP_CONCAT(tag_name, ' ') FROM recipe_tags WHERE recipe_id = NEW.recipe_id)
    WHERE rowid = NEW.recipe_id;
END;

CREATE TRIGGER IF NOT EXISTS recipe_tags_fts_delete AFTER DELETE ON recipe_tags BEGIN
    UPDATE recipes_fts SET
        tags = (SELECT GROUP_CONCAT(tag_name, ' ') FROM recipe_tags WHERE recipe_id = OLD.recipe_id)
    WHERE rowid = OLD.recipe_id;
END;

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

-- Enhanced constraints and indexes from improved patch
CREATE UNIQUE INDEX IF NOT EXISTS uq_recipe_ingredients_order ON recipe_ingredients(recipe_id, sort_order);
CREATE UNIQUE INDEX IF NOT EXISTS uq_recipe_instructions_step ON recipe_instructions(recipe_id, step_number);
CREATE INDEX IF NOT EXISTS idx_recipe_tags_type_name ON recipe_tags(tag_type, tag_name);

-- Views for common queries
CREATE VIEW IF NOT EXISTS recipe_summary AS
SELECT 
    r.id,
    r.title,
    r.description,
    r.prep_time,
    r.cook_time,
    r.total_time,
    r.servings,
    r.difficulty,
    r.image_url,
    r.is_featured,
    r.is_active,
    GROUP_CONCAT(DISTINCT rt.tag_name) as tags,
    GROUP_CONCAT(DISTINCT 
        CASE WHEN rt.tag_type = 'dietary' THEN rt.tag_name 
        END
    ) as dietary_tags,
    COUNT(ri.id) as ingredient_count
FROM recipes r
LEFT JOIN recipe_tags rt ON r.id = rt.recipe_id
LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
WHERE r.is_active = TRUE
GROUP BY r.id, r.title, r.description, r.prep_time, r.cook_time, r.total_time, r.servings, r.difficulty, r.image_url, r.is_featured, r.is_active;

-- View for dietary tag filtering
CREATE VIEW IF NOT EXISTS recipes_by_dietary_tag AS
SELECT 
    r.id,
    r.title,
    r.description,
    r.prep_time,
    r.cook_time,
    r.total_time,
    r.servings,
    r.difficulty,
    r.image_url,
    rt.tag_name as dietary_tag
FROM recipes r
INNER JOIN recipe_tags rt ON r.id = rt.recipe_id
WHERE r.is_active = TRUE 
    AND rt.tag_type = 'dietary'
    AND rt.tag_name IN ('vegetarian', 'vegan', 'pescatarian', 'gluten-free', 'dairy-free');

-- Fix updated_at trigger (current schema lacks this)
CREATE TRIGGER IF NOT EXISTS recipes_touch_updated_at
AFTER UPDATE ON recipes
BEGIN
  UPDATE recipes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Insert some sample category tags
INSERT OR IGNORE INTO recipe_tags (recipe_id, tag_name, tag_type) VALUES
(1, 'main-course', 'category'),
(2, 'side-dish', 'category'),
(3, 'soup', 'category'),
(4, 'salad', 'category'),
(5, 'dessert', 'category');

-- Insert some sample cuisine tags
INSERT OR IGNORE INTO recipe_tags (recipe_id, tag_name, tag_type) VALUES
(1, 'italian', 'cuisine'),
(2, 'mexican', 'cuisine'),
(3, 'asian', 'cuisine'),
(4, 'american', 'cuisine'),
(5, 'mediterranean', 'cuisine');

-- Insert some sample cooking method tags
INSERT OR IGNORE INTO recipe_tags (recipe_id, tag_name, tag_type) VALUES
(1, 'baked', 'cooking_method'),
(2, 'grilled', 'cooking_method'),
(3, 'stir-fried', 'cooking_method'),
(4, 'slow-cooked', 'cooking_method'),
(5, 'raw', 'cooking_method');
