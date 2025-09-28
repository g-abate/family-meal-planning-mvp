# PRD: Seed Recipe Dataset (0 → 1000 Recipes in 30 Minutes)

## Introduction/Overview

This feature creates a normalized dataset of at least 1000 recipes using only public domain and Creative Commons–licensed sources. The dataset will serve as the initial content library for the MealPrep app, providing users with a diverse collection of recipes across different dietary preferences and cuisines. The goal is to build a robust foundation of recipe data that can be imported into the app's SQLite database.

## Goals

1. **Data Collection**: Gather recipe data from trusted open-license sources (USDA SNAP-Ed, USDA FoodData Central, Wikibooks Cookbook)
2. **Data Normalization**: Transform recipes into a consistent schema with standardized formatting
3. **Legal Compliance**: Ensure all recipes are from public domain or CC-BY/CC-BY-SA sources only
4. **Performance**: Complete the entire process within 30 minutes on a standard development machine
5. **Quality Assurance**: Deliver a clean, deduplicated dataset with proper validation
6. **Integration Ready**: Generate files in formats suitable for database import

## User Stories

**As a developer**, I want to run a single command to generate a comprehensive recipe dataset so that I can quickly populate the app with initial content.

**As a developer**, I want the dataset to include diverse dietary options (vegetarian, vegan, pescatarian, omnivore) so that the app serves users with different meal preferences.

**As a developer**, I want clear attribution and licensing information for each recipe so that we maintain legal compliance.

**As a developer**, I want the process to be idempotent with caching so that I can re-run it without re-downloading data unnecessarily.

**As a developer**, I want detailed logging and error reporting so that I can identify and resolve any data quality issues.

## Functional Requirements

### 1. Data Ingestion
1.1. The system must download USDA SNAP-Ed recipe data from the official API/CSV endpoints
1.2. The system must scrape Wikibooks Cookbook pages programmatically with proper rate limiting
1.3. The system must handle USDA FoodData Central bulk CSV downloads
1.4. The system must implement caching to avoid re-downloading data on subsequent runs
1.5. The system must handle network failures gracefully with retry logic and exponential backoff

### 2. Data Processing
2.1. The system must clean and normalize recipe text (remove wiki markup, HTML tags, standardize measurements)
2.2. The system must extract ingredients, steps, and metadata from each source format
2.3. The system must standardize ingredient names and measurements (e.g., "1 cup" vs "1 c.")
2.4. The system must parse and clean cooking instructions into discrete steps
2.5. The system must handle text encoding issues and special characters properly

### 3. Data Normalization
3.1. The system must transform all recipes into the standardized schema matching the existing database structure:
   ```json
   {
     "title": "String (max 100 chars)",
     "description": "String (max 500 chars, optional)",
     "prep_time": "Number (minutes, optional)",
     "cook_time": "Number (minutes, optional)", 
     "total_time": "Number (minutes, calculated)",
     "servings": "Number (1-20, default 1)",
     "difficulty": "String (easy | medium | hard, default easy)",
     "image_url": "String (URL, optional)",
     "source_url": "String (URL, optional)",
     "calories_per_serving": "Number (optional)",
     "protein_per_serving": "Number (grams, optional)",
     "carbs_per_serving": "Number (grams, optional)",
     "fat_per_serving": "Number (grams, optional)",
     "is_featured": "Boolean (default false)",
     "is_active": "Boolean (default true)",
     "ingredients": [
       {
         "ingredient_name": "String (max 100 chars)",
         "quantity": "Number (optional)",
         "unit": "String (max 20 chars, optional)",
         "notes": "String (max 200 chars, optional)",
         "is_optional": "Boolean (default false)",
         "sort_order": "Number (default 0)",
         "kind": "String (protein_main | protein_source | vegetable | grain | dairy | fat | spice | other)"
       }
     ],
     "instructions": [
       {
         "step_number": "Number (min 1)",
         "instruction": "String (max 500 chars)",
         "prep_time": "Number (minutes, optional)",
         "cook_time": "Number (minutes, optional)",
         "temperature": "Number (degrees F, optional)",
         "notes": "String (max 200 chars, optional)"
       }
     ],
     "tags": [
       {
         "tag_name": "String (max 50 chars)",
         "tag_type": "String (dietary | category | cuisine | cooking_method)"
       }
     ],
     "metadata": {
       "source": "String (usda | wikibooks | openfoodfacts)",
       "license": "String (public_domain | cc_by | cc_by_sa)",
       "attribution": "String (source attribution)"
     }
   }
   ```

### 4. Data Validation
4.1. The system must validate that each recipe has at least 3 ingredients
4.2. The system must validate that each recipe has at least 1 cooking step
4.3. The system must flag recipes missing critical data (prep time, serving size) for manual review
4.4. The system must deduplicate recipes based on title similarity and ingredient overlap
4.5. The system must filter out broken or incomplete entries

### 5. Dietary Classification
5.1. The system must automatically classify recipes using the existing dietary tag system: vegetarian, vegan, pescatarian, gluten-free, dairy-free, keto, paleo
5.2. The system must use ingredient heuristics to detect meat, dairy, eggs, fish, gluten, and other dietary restrictions
5.3. The system must handle edge cases and ambiguous ingredients appropriately
5.4. The system must classify ingredients by kind: protein_main, protein_source, vegetable, grain, dairy, fat, spice, other

### 6. Output Generation
6.1. The system must generate `recipes.json` as a JSON array of all recipes in normalized schema matching the CompleteRecipeSchema
6.2. The system must generate `recipes.csv` with normalized columns for database import (title, description, prep_time, cook_time, total_time, servings, difficulty, etc.)
6.3. The system must generate `ingredients.csv` with recipe_id, ingredient_name, quantity, unit, notes, is_optional, sort_order, kind
6.4. The system must generate `instructions.csv` with recipe_id, step_number, instruction, prep_time, cook_time, temperature, notes
6.5. The system must generate `tags.csv` with recipe_id, tag_name, tag_type
6.6. The system must generate `dataset-metadata.json` with creation stats, source counts, and validation results
6.7. The system must generate `compliance-report.json` with licensing and attribution information

### 7. Performance & Monitoring
7.1. The system must complete the entire process within 30 minutes on a standard development machine
7.2. The system must provide real-time progress indicators during processing
7.3. The system must log all errors and warnings with detailed context
7.4. The system must generate a summary report of processing results

## Non-Goals (Out of Scope)

- **Real-time data updates**: This is a one-time seed dataset generation, not a live data sync
- **Recipe image processing**: Images are not included in this dataset
- **Nutritional analysis**: Nutritional information is not required for this MVP
- **User-generated content**: Only curated, licensed content from official sources
- **Advanced recipe search**: Search functionality is handled by the app, not the dataset generator
- **Recipe rating/review system**: This is not part of the initial dataset
- **Multi-language support**: English-only recipes for the initial dataset

## Design Considerations

### File Structure
```
scripts/etl/
├── seedRecipes.ts          # Main orchestration script
├── sources/
│   ├── usda.ts            # USDA data source handlers
│   ├── wikibooks.ts       # Wikibooks scraper
│   └── openfoodfacts.ts   # Open Food Facts handler (optional)
├── processors/
│   ├── normalizer.ts      # Data normalization logic
│   ├── validator.ts       # Data validation rules
│   └── classifier.ts      # Dietary classification logic
├── utils/
│   ├── cache.ts           # Caching utilities
│   ├── logger.ts          # Logging utilities
│   └── retry.ts           # Retry logic for network requests
└── output/
    ├── recipes.csv
    ├── recipes.json
    ├── dataset-metadata.json
    └── compliance-report.json
```

### Error Handling Strategy
- Network failures: Retry with exponential backoff (max 3 attempts)
- Parsing errors: Log detailed error context and skip problematic recipes
- Validation failures: Flag for manual review rather than discarding
- Rate limiting: Implement proper delays between requests

## Technical Considerations

### Dependencies
- **Node.js/TypeScript**: Integrate with existing project structure
- **Cheerio**: HTML parsing for web scraping
- **csv-parser**: CSV file processing
- **node-cache**: In-memory caching for downloaded data
- **axios**: HTTP client with retry capabilities

### Performance Optimizations
- Parallel processing of multiple data sources
- Streaming CSV processing for large files
- Memory-efficient data structures
- Caching of processed data to avoid re-computation

### Legal Compliance
- Verify source licensing before processing
- Include proper attribution in output files
- Generate compliance report for audit trail
- Filter out any potentially copyrighted content

## Success Metrics

1. **Dataset Size**: At least 1000 valid recipes generated
2. **Processing Time**: Complete within 30 minutes
3. **Data Quality**: <5% parsing errors, >95% successful validation rate
4. **Coverage**: Recipes across all dietary categories (vegetarian, vegan, pescatarian, gluten-free, dairy-free, keto, paleo)
5. **Compliance**: 100% of recipes from approved open-license sources
6. **Deduplication**: <2% duplicate recipes in final dataset

## Open Questions

1. Should we implement a dry-run mode to preview what recipes would be generated without actually creating the files?
2. Do you want the ability to filter recipes by specific dietary preferences during generation?
3. Should we include a recipe preview/validation interface for manual review of flagged recipes?
4. Do you want integration with the existing database schema, or should this remain as a separate data generation tool?
5. Should we implement incremental updates to add new recipes to existing datasets?

---

**Target Completion**: This PRD should enable a junior developer to implement the complete recipe dataset generation system within 2-3 development days, following the existing project's TypeScript patterns and testing requirements.
