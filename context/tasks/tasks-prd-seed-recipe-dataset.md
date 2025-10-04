# Tasks: Seed Recipe Dataset (0 → 1000 Recipes in 30 Minutes)

## Relevant Files

### ETL Package Structure (MealPrep-ETL/)
**Location**: `/Users/gideonabate/Documents/MealPrep-ETL/` (separate repository)

- `package.json` - ETL-specific dependencies and scripts
- `tsconfig.json` - TypeScript configuration for ETL package
- `vitest.config.ts` - Test configuration with coverage reporting
- `README.md` - Comprehensive documentation and usage guide
- `LICENSE` - ISC license file
- `.gitignore` - Git ignore patterns for ETL-specific files
- `src/main.ts` - Main orchestration script for the recipe dataset generation process
- `src/main.test.ts` - Unit tests for the main orchestration script
- `src/sources/usda.ts` - USDA data source handlers for SNAP-Ed and FoodData Central
- `src/sources/usda.test.ts` - Unit tests for USDA data source handlers
- `src/sources/wikibooks.ts` - Wikibooks Cookbook scraper implementation
- `src/sources/wikibooks.test.ts` - Unit tests for Wikibooks scraper
- `src/sources/openfoodfacts.ts` - Open Food Facts data handler (optional)
- `src/sources/openfoodfacts.test.ts` - Unit tests for Open Food Facts handler
- `src/processors/normalizer.ts` - Data normalization logic to transform raw data into schema
- `src/processors/normalizer.test.ts` - Unit tests for data normalization
- `src/processors/validator.ts` - Data validation rules and quality checks
- `src/processors/validator.test.ts` - Unit tests for data validation
- `src/processors/classifier.ts` - Dietary classification and ingredient categorization logic
- `src/processors/classifier.test.ts` - Unit tests for dietary classification
- `src/utils/cache.ts` - Caching utilities for downloaded data and processed results
- `src/utils/cache.test.ts` - Unit tests for caching utilities
- `src/utils/logger.ts` - Logging utilities with progress indicators and error reporting
- `src/utils/logger.test.ts` - Unit tests for logging utilities
- `src/utils/retry.ts` - Retry logic for network requests with exponential backoff
- `src/utils/retry.test.ts` - Unit tests for retry logic
- `src/schemas/recipeSchemas.ts` - Schema definitions copied from main project
- `src/schemas/recipeSchemas.test.ts` - Unit tests for schema validation
- `src/types/etl.ts` - ETL-specific types for data processing and output
- `src/types/index.ts` - Type exports for easy importing
- `output/` - Directory for generated output files (recipes.csv, recipes.json, etc.)

### Main Project Integration
- `src/schemas/recipeSchemas.ts` - Source schemas (copied to ETL package)
- `src/types/database.ts` - Database types (not needed in ETL package)

### Notes

- **Separate Repository**: The ETL functionality is now in a completely separate repository (`MealPrep-ETL`)
- **Clean Separation**: No mixing of concerns - ETL package is independent of main project
- **Schema Sharing**: Schemas are copied from main project to ETL package for consistency
- **Testing**: Unit tests are placed alongside code files in the ETL package structure
- **Commands**: 
  - `cd ../MealPrep-ETL && npm test` to run ETL tests
  - `cd ../MealPrep-ETL && npm run build` to build the ETL package
  - `cd ../MealPrep-ETL && npm start` to run the seed process
- **Dependencies**: ETL package has its own dependencies separate from main project
- **Output**: Generated files go to `MealPrep-ETL/output/` and can be copied to main project as needed
- **Git Integration**: ETL package has its own Git repository with proper documentation

## Tasks

- [x] 1.0 Setup ETL Package Infrastructure and Dependencies
  - [x] 1.1 Create mealprep-etl/ directory and initialize as separate npm package
  - [x] 1.2 Add ETL-specific dependencies to mealprep-etl/package.json (cheerio, csv-parser, node-cache, axios, vitest)
  - [x] 1.3 Create mealprep-etl/ directory structure (src/, output/, schemas/, types/)
  - [x] 1.4 Set up TypeScript configuration for ETL package with proper module resolution
  - [x] 1.5 Copy schema definitions from main project to mealprep-etl/src/schemas/
  - [x] 1.6 Create ETL-specific types (not database types) for data processing
  - [x] 1.7 Move ETL package to separate repository (MealPrep-ETL)
  - [x] 1.8 Set up proper Git repository with README, LICENSE, and documentation
  - [x] 1.9 Create comprehensive .gitignore and project structure

- [ ] 2.0 Implement Data Source Handlers
  - [ ] 2.1 Create USDA SNAP-Ed data source handler with API/CSV download capabilities
  - [ ] 2.2 Implement USDA FoodData Central bulk CSV download and parsing
  - [ ] 2.3 Build Wikibooks Cookbook scraper with rate limiting and HTML parsing
  - [ ] 2.4 Create Open Food Facts data handler (optional stretch goal)
  - [ ] 2.5 Implement common data source interface for consistent error handling
  - [ ] 2.6 Add retry logic with exponential backoff for all network requests
  - [ ] 2.7 Create data source configuration system for API endpoints and rate limits

- [ ] 3.0 Build Data Processing Pipeline
  - [ ] 3.1 Implement text cleaning utilities to remove wiki markup and HTML tags
  - [ ] 3.2 Create measurement standardization system (cups, tbsp, tsp, etc.)
  - [ ] 3.3 Build ingredient name normalization and deduplication logic
  - [ ] 3.4 Implement instruction parsing to extract discrete cooking steps
  - [ ] 3.5 Create text encoding handling for special characters and Unicode
  - [ ] 3.6 Add parallel processing capabilities for multiple data sources
  - [ ] 3.7 Implement streaming CSV processing for large USDA datasets

- [ ] 4.0 Create Data Normalization System
  - [ ] 4.1 Build recipe normalizer to transform raw data into CompleteRecipeSchema format
  - [ ] 4.2 Implement ingredient normalization with proper quantity/unit parsing
  - [ ] 4.3 Create instruction normalization with step numbering and time extraction
  - [ ] 4.4 Build tag normalization system for dietary, category, cuisine, and cooking method tags
  - [ ] 4.5 Implement metadata extraction (source, license, attribution) for each recipe
  - [ ] 4.6 Add schema validation using existing Zod schemas from the project
  - [ ] 4.7 Create data transformation pipeline with error handling and logging

- [ ] 5.0 Implement Validation and Quality Assurance
  - [ ] 5.1 Create recipe validation rules (minimum ingredients, steps, required fields)
  - [ ] 5.2 Implement dietary classification system using ingredient heuristics
  - [ ] 5.3 Build ingredient categorization system (protein_main, vegetable, etc.)
  - [ ] 5.4 Create recipe deduplication logic based on title similarity and ingredient overlap
  - [ ] 5.5 Implement data quality scoring and flagging system for manual review
  - [ ] 5.6 Add validation reporting with detailed error context and statistics
  - [ ] 5.7 Create data integrity checks to ensure schema compliance

- [ ] 6.0 Build Output Generation System
  - [ ] 6.1 Implement recipes.json generation matching CompleteRecipeSchema
  - [ ] 6.2 Create recipes.csv export with normalized database columns
  - [ ] 6.3 Build ingredients.csv export with recipe_id relationships
  - [ ] 6.4 Implement instructions.csv export with step ordering
  - [ ] 6.5 Create tags.csv export with proper tag_type categorization
  - [ ] 6.6 Build dataset-metadata.json with creation stats and validation results
  - [ ] 6.7 Implement compliance-report.json with licensing and attribution tracking
  - [ ] 6.8 Add output file validation to ensure generated files are properly formatted

- [ ] 7.0 Add Performance Monitoring and Caching
  - [ ] 7.1 Implement in-memory caching system for downloaded data using node-cache
  - [ ] 7.2 Create progress monitoring with real-time indicators and ETA calculations
  - [ ] 7.3 Add performance metrics tracking (processing time, memory usage, throughput)
  - [ ] 7.4 Implement caching strategy for processed data to avoid re-computation
  - [ ] 7.5 Create memory-efficient data structures for large dataset processing
  - [ ] 7.6 Add timeout handling and resource cleanup for long-running processes
  - [ ] 7.7 Implement batch processing with configurable batch sizes for optimal performance

- [ ] 8.0 Integration Testing and Documentation
  - [ ] 8.1 Create comprehensive unit tests for all ETL components with >80% coverage
  - [ ] 8.2 Build integration tests for end-to-end data flow from sources to output
  - [ ] 8.3 Implement mock data sources for reliable testing without external dependencies
  - [ ] 8.4 Create performance tests to ensure 30-minute processing constraint is met
  - [ ] 8.5 Add error handling tests for network failures, parsing errors, and edge cases
  - [ ] 8.6 Write comprehensive README documentation for the ETL system
  - [ ] 8.7 Create usage examples and troubleshooting guide for developers
  - [ ] 8.8 Add CI/CD integration to run ETL tests as part of the build process
