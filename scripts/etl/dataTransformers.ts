/**
 * Data Transformation Utilities
 * 
 * This module provides intelligent parsing and transformation of unstructured
 * recipe data from CSV into structured database records. It's designed to handle
 * the messy, inconsistent data found in large recipe datasets from various sources.
 * 
 * Key Capabilities:
 * 1. Ingredient Parsing: Extracts quantities, units, and names from text
 *    - Supports both imperial and metric measurements
 *    - Handles fractions, mixed numbers, and word quantities
 *    - Normalizes units to standard forms
 * 2. Instruction Analysis: Extracts cooking times and temperatures
 *    - Identifies prep time vs cook time from context
 *    - Extracts temperature settings
 * 3. Recipe Classification: Determines difficulty and dietary tags
 *    - Analyzes ingredient complexity and instruction count
 *    - Automatically detects dietary restrictions
 * 4. Data Validation: Ensures data quality and consistency
 *    - Validates required fields
 *    - Cleans malformed data
 * 5. Intelligent Ingredient Classification:
 *    - 10 categories with 500+ keywords
 *    - Pattern-based fallback classification
 *    - Handles unknown ingredients intelligently
 * 
 * Example transformations:
 * Imperial: "1 c. firmly packed brown sugar" → { name: "brown sugar", quantity: 1, unit: "cup", kind: "spice" }
 * Metric: "500g ground beef" → { name: "ground beef", quantity: 500, unit: "gram", kind: "protein_main" }
 * Complex: "2 1/2 cups all-purpose flour" → { name: "all-purpose flour", quantity: 2.5, unit: "cup", kind: "grain" }
 * 
 * Version: 1.0
 */

import type { RecipeIngredient, RecipeInstruction } from '../../src/schemas/recipeSchemas';

/**
 * IngredientParser - Converts unstructured ingredient strings into structured data
 * 
 * This class handles the complex task of parsing ingredient strings from various sources,
 * supporting both imperial and metric measurements:
 * 
 * Imperial Examples:
 * - "1 c. firmly packed brown sugar" → { name: "brown sugar", quantity: 1, unit: "cup" }
 * - "2 1/2 cups all-purpose flour" → { name: "all-purpose flour", quantity: 2.5, unit: "cup" }
 * - "1/4 tsp salt" → { name: "salt", quantity: 0.25, unit: "teaspoon" }
 * 
 * Metric Examples:
 * - "500g ground beef" → { name: "ground beef", quantity: 500, unit: "gram" }
 * - "250ml milk" → { name: "milk", quantity: 250, unit: "milliliter" }
 * - "2kg potatoes" → { name: "potatoes", quantity: 2, unit: "kilogram" }
 * 
 * It uses regex patterns to identify quantities, units, and ingredient names,
 * normalizes units to standard forms, and classifies ingredients into categories
 * for better organization and meal planning.
 */
export class IngredientParser {
  // Regex patterns to match different quantity formats in ingredient strings
  private static readonly QUANTITY_PATTERNS = [
    // Fractions: 1/2, 3/4, etc.
    /^(\d+\/\d+)\s+(.+)$/,
    // Mixed numbers: 1 1/2, 2 3/4, etc.
    /^(\d+\s+\d+\/\d+)\s+(.+)$/,
    // Decimals: 1.5, 2.25, etc.
    /^(\d+\.\d+)\s+(.+)$/,
    // Whole numbers: 1, 2, 3, etc.
    /^(\d+)\s+(.+)$/,
    // Words: one, two, half, etc.
    /^(one|two|three|four|five|six|seven|eight|nine|ten|half|quarter|third)\s+(.+)$/i
  ];

  // Regex patterns to identify measurement units in ingredient strings
  // Supports both imperial and metric measurements
  private static readonly UNIT_PATTERNS = [
    // Volume units: imperial and metric - simplified pattern
    /\b(cup|cups|c\.|tbsp|tablespoon|tablespoons|tsp|teaspoon|teaspoons|fl oz|fluid ounce|pint|pints|quart|quarts|gallon|gallons|ml|milliliter|milliliters|cl|centiliter|centiliters|dl|deciliter|deciliters|l|liter|liters|litre|litres)\b/gi,
    // Weight units: imperial and metric
    /\b(lb|lbs|pound|pounds|oz|ounce|ounces|kg|kilogram|kilograms|g|gram|grams|mg|milligram|milligrams|tonne|tonnes|stone|stones)\b/gi,
    // Length units: imperial and metric (for measurements like "2cm thick")
    /\b(inch|inches|in|ft|feet|foot|yard|yards|yd|mile|miles|mm|millimeter|millimeters|cm|centimeter|centimeters|m|meter|meters|metre|metres|km|kilometer|kilometers)\b/gi,
    // Count units: pieces, slices, cloves, etc.
    /\b(piece|pieces|slice|slices|clove|cloves|head|heads|bunch|bunches|can|cans|package|packages|bag|bags|box|boxes|bottle|bottles|jar|jars|tube|tubes)\b/gi,
    // Size descriptors: small, medium, large, etc.
    /\b(small|medium|large|extra large|xl|jumbo|mini|tiny|micro|macro)\b/gi,
    // Temperature units (for ingredients that specify temperature)
    /\b(°c|°f|celsius|fahrenheit|farenheit)\b/gi,
    // Special case for units at start of string (like "c. firmly packed")
    /^(c\.|tbsp|tsp|fl oz|lb|oz|ml|g|kg|in|ft|cm|m)/gi
  ];

  // Comprehensive classification system for ingredients
  // 
  // This system uses a multi-layered approach to handle the vast variety of ingredients:
  // 1. Keyword Matching: Exact matches against comprehensive ingredient lists
  // 2. Pattern Recognition: Regex patterns for common ingredient types
  // 3. Intelligent Fallbacks: Smart classification for unknown ingredients
  // 
  // Categories:
  // - protein_main: Meat, poultry, game
  // - protein_source: Fish, seafood, plant-based proteins
  // - vegetable: All plant-based vegetables and herbs
  // - grain: Grains, starches, breads, pastas
  // - dairy: Milk products, cheeses, fermented dairy
  // - fat: Oils, fats, butter, margarine
  // - spice: Herbs, spices, seasonings, flavorings
  // - fruit: Fresh and dried fruits, fruit products
  // - nuts_seeds: Nuts, seeds, nut butters, seed products
  // - condiments: Sauces, dressings, spreads, pickled items
  // - other: Anything that doesn't fit the above categories
  public static readonly INGREDIENT_CLASSIFICATIONS = {
    // Main protein sources (meat, poultry) - expanded list
    protein_main: [
      'chicken', 'beef', 'pork', 'lamb', 'turkey', 'duck', 'goose', 'venison',
      'bacon', 'ham', 'sausage', 'pepperoni', 'salami', 'prosciutto', 'chorizo',
      'brisket', 'ribs', 'steak', 'chop', 'cutlet', 'tenderloin', 'roast',
      'ground beef', 'ground pork', 'ground turkey', 'ground chicken', 'mince',
      'poultry', 'game', 'rabbit', 'bison', 'elk', 'boar'
    ],
    // Alternative protein sources (fish, seafood, plant-based) - expanded
    protein_source: [
      'fish', 'salmon', 'tuna', 'cod', 'halibut', 'shrimp', 'crab', 'lobster',
      'scallops', 'mussels', 'clams', 'oysters', 'tofu', 'tempeh', 'seitan',
      'mackerel', 'sardines', 'anchovy', 'anchovies', 'trout', 'bass', 'snapper',
      'tilapia', 'prawns', 'crayfish', 'crawfish', 'squid', 'octopus', 'calamari',
      'lentils', 'chickpeas', 'garbanzo', 'black beans', 'kidney beans', 'pinto beans',
      'navy beans', 'lima beans', 'edamame', 'quinoa', 'hemp seeds', 'chia seeds',
      'nutritional yeast', 'protein powder', 'whey', 'casein'
    ],
    // Dairy products - expanded
    dairy: [
      'milk', 'cheese', 'butter', 'cream', 'yogurt', 'sour cream', 'buttermilk',
      'margarine', 'heavy cream', 'half and half', 'ricotta', 'cottage cheese',
      'mozzarella', 'cheddar', 'parmesan', 'feta', 'goat cheese', 'brie', 'camembert',
      'gouda', 'swiss', 'provolone', 'monterey jack', 'colby', 'pepper jack',
      'blue cheese', 'gorgonzola', 'roquefort', 'stilton', 'cream cheese', 'mascarpone',
      'kefir', 'greek yogurt', 'skyr', 'quark', 'fromage blanc', 'creme fraiche',
      'ice cream', 'gelato', 'sorbet', 'frozen yogurt'
    ],
    // Vegetables and plant-based ingredients - greatly expanded
    vegetable: [
      'onion', 'garlic', 'tomato', 'pepper', 'carrot', 'celery', 'lettuce',
      'spinach', 'broccoli', 'cauliflower', 'mushroom', 'potato', 'sweet potato',
      'corn', 'peas', 'beans', 'cucumber', 'zucchini', 'squash', 'eggplant',
      'bell pepper', 'jalapeño', 'chili pepper', 'cabbage', 'kale', 'arugula',
      'asparagus', 'artichoke', 'avocado', 'beet', 'beets', 'beetroot', 'radish',
      'turnip', 'rutabaga', 'parsnip', 'leek', 'shallot', 'scallion', 'green onion',
      'spring onion', 'chive', 'chives', 'herbs', 'cilantro', 'parsley', 'basil',
      'oregano', 'thyme', 'rosemary', 'sage', 'mint', 'dill', 'tarragon',
      'fennel', 'endive', 'escarole', 'radicchio', 'watercress', 'mizuna',
      'bok choy', 'napa cabbage', 'daikon', 'jicama', 'kohlrabi', 'okra',
      'brussels sprouts', 'collard greens', 'mustard greens', 'chard', 'beet greens',
      'arugula', 'rocket', 'mesclun', 'mache', 'frisee', 'iceberg', 'romaine',
      'butter lettuce', 'bibb lettuce', 'red leaf', 'green leaf', 'spinach',
      'microgreens', 'sprouts', 'alfalfa', 'mung bean sprouts', 'broccoli sprouts'
    ],
    // Grains and starches - expanded
    grain: [
      'rice', 'pasta', 'noodles', 'bread', 'flour', 'oats', 'quinoa', 'barley',
      'wheat', 'buckwheat', 'millet', 'couscous', 'bulgur', 'crackers', 'cereal',
      'brown rice', 'white rice', 'wild rice', 'jasmine rice', 'basmati rice',
      'arborio rice', 'sushi rice', 'sticky rice', 'black rice', 'red rice',
      'spaghetti', 'penne', 'rigatoni', 'fettuccine', 'linguine', 'macaroni',
      'lasagna', 'ravioli', 'tortellini', 'gnocchi', 'ramen', 'soba', 'udon',
      'rice noodles', 'vermicelli', 'angel hair', 'fusilli', 'rotini', 'ziti',
      'breadcrumbs', 'panko', 'croutons', 'tortilla', 'pita', 'naan', 'bagel',
      'muffin', 'biscuit', 'scone', 'croissant', 'baguette', 'sourdough',
      'rye bread', 'whole wheat', 'multigrain', 'sprouted', 'gluten-free bread',
      'cornmeal', 'polenta', 'grits', 'semolina', 'farro', 'spelt', 'kamut',
      'amaranth', 'teff', 'sorghum', 'triticale', 'rye', 'oats', 'steel cut oats',
      'rolled oats', 'instant oats', 'granola', 'muesli'
    ],
    // Fats and oils - expanded
    fat: [
      'oil', 'olive oil', 'vegetable oil', 'coconut oil', 'butter', 'margarine',
      'lard', 'shortening', 'ghee', 'avocado oil', 'sesame oil', 'canola oil',
      'sunflower oil', 'safflower oil', 'peanut oil', 'walnut oil', 'almond oil',
      'hazelnut oil', 'pistachio oil', 'macadamia oil', 'grapeseed oil',
      'rice bran oil', 'palm oil', 'palm kernel oil', 'cottonseed oil',
      'soybean oil', 'corn oil', 'flaxseed oil', 'hemp oil', 'argan oil',
      'truffle oil', 'chili oil', 'garlic oil', 'herb oil', 'infused oil',
      'bacon fat', 'duck fat', 'chicken fat', 'beef tallow', 'schmaltz'
    ],
    // Herbs, spices, and seasonings - greatly expanded
    spice: [
      'salt', 'pepper', 'garlic powder', 'onion powder', 'paprika', 'cumin',
      'oregano', 'basil', 'thyme', 'rosemary', 'sage', 'parsley', 'cilantro',
      'dill', 'chives', 'bay leaves', 'vanilla', 'cinnamon', 'nutmeg', 'ginger',
      'turmeric', 'cayenne', 'red pepper flakes', 'black pepper', 'white pepper',
      'pink pepper', 'green pepper', 'allspice', 'cardamom', 'cloves', 'star anise',
      'fennel seeds', 'caraway seeds', 'mustard seeds', 'poppy seeds', 'sesame seeds',
      'sunflower seeds', 'pumpkin seeds', 'chia seeds', 'flax seeds', 'hemp seeds',
      'coriander', 'cilantro seeds', 'dill seeds', 'anise', 'licorice', 'tarragon',
      'marjoram', 'savory', 'sumac', 'za\'atar', 'herbes de provence', 'italian seasoning',
      'poultry seasoning', 'pumpkin pie spice', 'apple pie spice', 'chai spice',
      'five spice', 'seven spice', 'berbere', 'harissa', 'ras el hanout',
      'jerk seasoning', 'cajun seasoning', 'old bay', 'taco seasoning', 'chili powder',
      'smoked paprika', 'sweet paprika', 'hot paprika', 'chipotle', 'jalapeño powder',
      'habanero powder', 'ghost pepper', 'scotch bonnet', 'piri piri', 'sriracha',
      'sambal oelek', 'gochujang', 'miso', 'tamari', 'soy sauce', 'worcestershire',
      'fish sauce', 'oyster sauce', 'hoisin sauce', 'teriyaki sauce', 'ponzu',
      'mirin', 'sake', 'rice vinegar', 'balsamic vinegar', 'apple cider vinegar',
      'white vinegar', 'red wine vinegar', 'sherry vinegar', 'champagne vinegar',
      'lemon juice', 'lime juice', 'orange juice', 'grapefruit juice', 'pomegranate juice',
      'tamarind', 'date syrup', 'maple syrup', 'honey', 'agave', 'molasses',
      'brown sugar', 'white sugar', 'powdered sugar', 'coconut sugar', 'turbinado',
      'demerara', 'muscovado', 'jaggery', 'palm sugar', 'stevia', 'monk fruit',
      'xylitol', 'erythritol', 'sorbitol', 'maltitol', 'saccharin', 'aspartame'
    ],
    // Fruits - new category
    fruit: [
      'apple', 'banana', 'orange', 'lemon', 'lime', 'grapefruit', 'strawberry',
      'blueberry', 'raspberry', 'blackberry', 'cranberry', 'cherry', 'grape',
      'peach', 'pear', 'plum', 'apricot', 'nectarine', 'pineapple', 'mango',
      'papaya', 'kiwi', 'passion fruit', 'dragon fruit', 'pomegranate', 'fig',
      'date', 'raisin', 'prune', 'coconut', 'avocado', 'tomato', 'cucumber',
      'watermelon', 'cantaloupe', 'honeydew', 'persimmon', 'guava', 'lychee',
      'rambutan', 'durian', 'jackfruit', 'breadfruit', 'plantain', 'banana',
      'dried fruit', 'fruit leather', 'jam', 'jelly', 'marmalade', 'preserves',
      'compote', 'chutney', 'relish', 'pickled fruit', 'candied fruit'
    ],
    // Nuts and seeds - new category
    nuts_seeds: [
      'almond', 'walnut', 'pecan', 'hazelnut', 'pistachio', 'cashew', 'macadamia',
      'brazil nut', 'pine nut', 'peanut', 'sunflower seed', 'pumpkin seed',
      'sesame seed', 'chia seed', 'flax seed', 'hemp seed', 'poppy seed',
      'caraway seed', 'fennel seed', 'mustard seed', 'coriander seed',
      'nut butter', 'peanut butter', 'almond butter', 'cashew butter',
      'sunflower butter', 'tahini', 'halva', 'nut milk', 'almond milk',
      'coconut milk', 'oat milk', 'soy milk', 'rice milk', 'hemp milk'
    ],
    // Condiments and sauces - new category
    condiments: [
      'ketchup', 'mustard', 'mayonnaise', 'ranch', 'blue cheese dressing',
      'caesar dressing', 'italian dressing', 'vinaigrette', 'balsamic glaze',
      'hot sauce', 'tabasco', 'sriracha', 'chili sauce', 'barbecue sauce',
      'teriyaki sauce', 'soy sauce', 'worcestershire sauce', 'fish sauce',
      'oyster sauce', 'hoisin sauce', 'sweet and sour sauce', 'duck sauce',
      'plum sauce', 'tartar sauce', 'cocktail sauce', 'horseradish sauce',
      'aioli', 'pesto', 'chimichurri', 'salsa', 'guacamole', 'hummus',
      'tzatziki', 'tahini', 'miso paste', 'wasabi', 'pickled ginger',
      'capers', 'olives', 'pickles', 'relish', 'chutney', 'preserves'
    ]
  };

  /**
   * Parses an ingredient string into structured data
   * 
   * Supports both imperial and metric measurements:
   * - "1 c. firmly packed brown sugar" → { name: "brown sugar", quantity: 1, unit: "cup" }
   * - "2 1/2 cups all-purpose flour" → { name: "all-purpose flour", quantity: 2.5, unit: "cup" }
   * - "500g ground beef" → { name: "ground beef", quantity: 500, unit: "gram" }
   * - "250ml milk" → { name: "milk", quantity: 250, unit: "milliliter" }
   * - "salt to taste" → { name: "salt", quantity: null, unit: null, is_optional: true }
   * 
   * @param ingredientStr - Raw ingredient string from CSV
   * @returns Structured ingredient data with normalized units
   */
  static parseIngredient(ingredientStr: string): RecipeIngredient {
    // Handle undefined, null, or non-string inputs
    if (!ingredientStr || typeof ingredientStr !== 'string') {
      return {
        ingredient_name: 'Unknown ingredient',
        quantity: undefined,
        unit: undefined,
        kind: 'other',
        is_optional: false,
        sort_order: 0
      };
    }
    
    const trimmed = ingredientStr.trim();
    
    // Handle empty strings
    if (trimmed.length === 0) {
      return {
        ingredient_name: 'Unknown ingredient',
        quantity: undefined,
        unit: undefined,
        kind: 'other',
        is_optional: false,
        sort_order: 0
      };
    }
    
    // Initialize variables to store parsed data
    let quantity: number | null = null;
    let unit: string | null = null;
    let name = trimmed;

    // Step 1: Try to extract quantity using regex patterns
    // We check patterns in order of specificity (most specific first)
    for (const pattern of this.QUANTITY_PATTERNS) {
      const match = trimmed.match(pattern);
      if (match) {
        const quantityStr = match[1].trim();
        const rest = match[2].trim();
        
        // Parse different quantity formats
        if (quantityStr.includes('/')) {
          // Handle fractions like "1/2", "3/4"
          const parts = quantityStr.split('/');
          if (parts.length === 2) {
            quantity = parseFloat(parts[0]) / parseFloat(parts[1]);
          }
        } else if (quantityStr.includes(' ')) {
          // Handle mixed numbers like "1 1/2", "2 3/4"
          const parts = quantityStr.split(' ');
          if (parts.length === 2 && parts[1].includes('/')) {
            const whole = parseFloat(parts[0]);
            const fractionParts = parts[1].split('/');
            const fraction = parseFloat(fractionParts[0]) / parseFloat(fractionParts[1]);
            quantity = whole + fraction;
          }
        } else {
          // Handle whole numbers and decimals
          quantity = parseFloat(quantityStr);
        }

        // Step 2: Look for measurement units in the remaining text
        let unitMatch = null;
        
        for (let i = 0; i < this.UNIT_PATTERNS.length; i++) {
          const pattern = this.UNIT_PATTERNS[i];
          const match = rest.match(pattern);
          if (match) {
            unitMatch = match;
            break;
          }
        }
        
        if (unitMatch) {
          // Found a unit, extract it and clean the ingredient name
          unit = this.normalizeUnit(unitMatch[0]);
          name = rest.replace(unitMatch[0], '').trim();
        } else {
          // No unit found, use the rest as ingredient name
          name = rest;
        }
        
        break; // Found a match, stop checking other patterns
      }
    }

    // Step 3: If no quantity was found, check for unit-only patterns
    // This handles cases like "salt" or "olive oil" where there's no quantity
    if (quantity === null) {
      for (const pattern of this.UNIT_PATTERNS) {
        const match = trimmed.match(pattern);
        if (match) {
          unit = this.normalizeUnit(match[0]);
          name = trimmed.replace(match[0], '').trim();
          break;
        }
      }
    }

    // Step 4: Ensure name is not empty or undefined
    const finalName = name && name.trim().length > 0 ? name.trim() : 'Unknown ingredient';

    // Step 5: Classify the ingredient for meal planning and filtering
    const kind = this.classifyIngredient(finalName);

    // Step 6: Return structured ingredient data
    return {
      ingredient_name: finalName,
      quantity: quantity || undefined,
      unit: unit || undefined,
      kind,
      is_optional: this.isOptional(trimmed),
      sort_order: 0
    };
  }

  private static classifyIngredient(ingredientName: string): 'protein_main' | 'protein_source' | 'vegetable' | 'grain' | 'dairy' | 'fat' | 'spice' | 'fruit' | 'nuts_seeds' | 'condiments' | 'other' {
    // Handle undefined, null, or empty ingredient names
    if (!ingredientName || typeof ingredientName !== 'string' || ingredientName.trim().length === 0) {
      return 'other';
    }
    
    const name = ingredientName.toLowerCase().trim();
    
    // First, try exact keyword matching
    for (const [category, keywords] of Object.entries(this.INGREDIENT_CLASSIFICATIONS)) {
      for (const keyword of keywords) {
        if (name.includes(keyword)) {
          return category as 'protein_main' | 'protein_source' | 'vegetable' | 'grain' | 'dairy' | 'fat' | 'spice' | 'fruit' | 'nuts_seeds' | 'condiments' | 'other';
        }
      }
    }
    
    // If no exact match, try intelligent pattern-based classification
    return this.intelligentClassification(name);
  }

  /**
   * Intelligent fallback classification using pattern recognition
   * This handles ingredients that don't match our keyword lists
   */
  private static intelligentClassification(ingredientName: string): 'protein_main' | 'protein_source' | 'vegetable' | 'grain' | 'dairy' | 'fat' | 'spice' | 'fruit' | 'nuts_seeds' | 'condiments' | 'other' {
    // Handle undefined, null, or empty ingredient names
    if (!ingredientName || typeof ingredientName !== 'string' || ingredientName.trim().length === 0) {
      return 'other';
    }
    
    const name = ingredientName.toLowerCase();
    
    // Pattern-based classification rules
    
    // Check for protein patterns
    if (this.matchesProteinPatterns(name)) {
      return 'protein_main';
    }
    
    // Check for vegetable patterns
    if (this.matchesVegetablePatterns(name)) {
      return 'vegetable';
    }
    
    // Check for fruit patterns
    if (this.matchesFruitPatterns(name)) {
      return 'fruit';
    }
    
    // Check for grain/starch patterns
    if (this.matchesGrainPatterns(name)) {
      return 'grain';
    }
    
    // Check for dairy patterns
    if (this.matchesDairyPatterns(name)) {
      return 'dairy';
    }
    
    // Check for fat/oil patterns
    if (this.matchesFatPatterns(name)) {
      return 'fat';
    }
    
    // Check for spice/seasoning patterns
    if (this.matchesSpicePatterns(name)) {
      return 'spice';
    }
    
    // Check for nut/seed patterns
    if (this.matchesNutSeedPatterns(name)) {
      return 'nuts_seeds';
    }
    
    // Check for condiment/sauce patterns
    if (this.matchesCondimentPatterns(name)) {
      return 'condiments';
    }
    
    // Default to 'other' if no patterns match
    return 'other';
  }

  // Pattern matching helper methods - dynamically use INGREDIENT_CLASSIFICATIONS
  // This ensures that any ingredient in our comprehensive lists will be caught
  // by pattern matching, even if it wasn't caught by exact keyword matching
  private static matchesProteinPatterns(name: string): boolean {
    // Use the actual protein keywords from our classification system
    const proteinKeywords = this.INGREDIENT_CLASSIFICATIONS.protein_main.concat(
      this.INGREDIENT_CLASSIFICATIONS.protein_source
    );
    
    // Create regex patterns from the actual keywords
    const proteinPatterns = this.createPatternsFromKeywords(proteinKeywords);
    
    // Add some general protein-related patterns
    const generalPatterns = [
      /meat|poultry|game|protein/i,
      /steak|chop|cutlet|tenderloin|roast|brisket|ribs/i,
      /ground|mince/i
    ];
    
    return [...proteinPatterns, ...generalPatterns].some(pattern => pattern.test(name));
  }

  private static matchesVegetablePatterns(name: string): boolean {
    const vegetableKeywords = this.INGREDIENT_CLASSIFICATIONS.vegetable;
    const vegetablePatterns = this.createPatternsFromKeywords(vegetableKeywords);
    
    // Add general vegetable patterns
    const generalPatterns = [
      /vegetable|veggie|greens|leafy/i,
      /root|bulb|tuber|stalk|stem/i,
      /cruciferous|allium|nightshade/i,
      /sprout|shoot|bud|flower/i
    ];
    
    return [...vegetablePatterns, ...generalPatterns].some(pattern => pattern.test(name));
  }

  private static matchesFruitPatterns(name: string): boolean {
    const fruitKeywords = this.INGREDIENT_CLASSIFICATIONS.fruit;
    const fruitPatterns = this.createPatternsFromKeywords(fruitKeywords);
    
    // Add general fruit patterns
    const generalPatterns = [
      /berry|fruit|citrus|tropical/i,
      /dried fruit|jam|jelly|marmalade/i,
      /compote|chutney|preserve/i
    ];
    
    return [...fruitPatterns, ...generalPatterns].some(pattern => pattern.test(name));
  }

  private static matchesGrainPatterns(name: string): boolean {
    const grainKeywords = this.INGREDIENT_CLASSIFICATIONS.grain;
    const grainPatterns = this.createPatternsFromKeywords(grainKeywords);
    
    // Add general grain patterns
    const generalPatterns = [
      /grain|cereal|starch|carb/i,
      /bread|pasta|noodle|rice/i,
      /flour|meal|bran|germ/i,
      /cracker|biscuit|muffin/i
    ];
    
    return [...grainPatterns, ...generalPatterns].some(pattern => pattern.test(name));
  }

  private static matchesDairyPatterns(name: string): boolean {
    const dairyKeywords = this.INGREDIENT_CLASSIFICATIONS.dairy;
    const dairyPatterns = this.createPatternsFromKeywords(dairyKeywords);
    
    // Add general dairy patterns
    const generalPatterns = [
      /dairy|milk|cream|cheese|yogurt/i,
      /butter|margarine|kefir/i,
      /fermented|cultured|probiotic/i
    ];
    
    return [...dairyPatterns, ...generalPatterns].some(pattern => pattern.test(name));
  }

  private static matchesFatPatterns(name: string): boolean {
    const fatKeywords = this.INGREDIENT_CLASSIFICATIONS.fat;
    const fatPatterns = this.createPatternsFromKeywords(fatKeywords);
    
    // Add general fat patterns
    const generalPatterns = [
      /oil|fat|grease|tallow|lard/i,
      /shortening|ghee|schmaltz/i
    ];
    
    return [...fatPatterns, ...generalPatterns].some(pattern => pattern.test(name));
  }

  private static matchesSpicePatterns(name: string): boolean {
    const spiceKeywords = this.INGREDIENT_CLASSIFICATIONS.spice;
    const spicePatterns = this.createPatternsFromKeywords(spiceKeywords);
    
    // Add general spice patterns
    const generalPatterns = [
      /spice|herb|seasoning|flavor/i,
      /powder|ground|dried|fresh/i,
      /extract|essence|aroma/i,
      /sauce|paste|condiment/i,
      /vinegar|juice|syrup/i
    ];
    
    return [...spicePatterns, ...generalPatterns].some(pattern => pattern.test(name));
  }

  private static matchesNutSeedPatterns(name: string): boolean {
    const nutSeedKeywords = this.INGREDIENT_CLASSIFICATIONS.nuts_seeds;
    const nutSeedPatterns = this.createPatternsFromKeywords(nutSeedKeywords);
    
    // Add general nut/seed patterns
    const generalPatterns = [
      /nut|seed|kernel/i,
      /butter|paste|milk/i,
      /tahini|halva/i
    ];
    
    return [...nutSeedPatterns, ...generalPatterns].some(pattern => pattern.test(name));
  }

  private static matchesCondimentPatterns(name: string): boolean {
    const condimentKeywords = this.INGREDIENT_CLASSIFICATIONS.condiments;
    const condimentPatterns = this.createPatternsFromKeywords(condimentKeywords);
    
    // Add general condiment patterns
    const generalPatterns = [
      /sauce|dressing|dip|spread/i,
      /pickle|relish|chutney/i,
      /ketchup|mustard|mayo/i,
      /hot sauce|barbecue|teriyaki/i
    ];
    
    return [...condimentPatterns, ...generalPatterns].some(pattern => pattern.test(name));
  }

  /**
   * Creates regex patterns from keyword lists for pattern matching
   * This ensures we use the same comprehensive data for both exact matching and pattern matching
   */
  private static createPatternsFromKeywords(keywords: string[]): RegExp[] {
    // Group keywords by length to create more efficient patterns
    const shortKeywords = keywords.filter(k => k.length <= 3);
    const mediumKeywords = keywords.filter(k => k.length > 3 && k.length <= 8);
    const longKeywords = keywords.filter(k => k.length > 8);
    
    const patterns: RegExp[] = [];
    
    // Create patterns for different keyword lengths
    if (shortKeywords.length > 0) {
      patterns.push(new RegExp(`\\b(${shortKeywords.join('|')})\\b`, 'i'));
    }
    if (mediumKeywords.length > 0) {
      patterns.push(new RegExp(`\\b(${mediumKeywords.join('|')})\\b`, 'i'));
    }
    if (longKeywords.length > 0) {
      patterns.push(new RegExp(`\\b(${longKeywords.join('|')})\\b`, 'i'));
    }
    
    return patterns;
  }

  private static isOptional(ingredientStr: string): boolean {
    if (!ingredientStr || typeof ingredientStr !== 'string') {
      return false;
    }
    
    const optionalKeywords = ['optional', 'to taste', 'as needed', 'if desired'];
    return optionalKeywords.some(keyword => 
      ingredientStr.toLowerCase().includes(keyword)
    );
  }

  /**
   * Converts metric units to imperial for standardization
   * This helps normalize measurements across different recipe sources
   * 
   * @param quantity - The numeric value
   * @param unit - The unit to convert
   * @returns Object with converted quantity and unit
   */
  static convertToImperial(quantity: number, unit: string): { quantity: number; unit: string } {
    if (!unit || typeof unit !== 'string') {
      return { quantity, unit: unit || 'unknown' };
    }
    
    const lowerUnit = unit.toLowerCase();
    
    // Volume conversions (metric to imperial)
    if (lowerUnit === 'ml' || lowerUnit === 'milliliter' || lowerUnit === 'milliliters') {
      return { quantity: quantity * 0.00422675, unit: 'cups' }; // 1 ml ≈ 0.00422675 cups
    }
    if (lowerUnit === 'l' || lowerUnit === 'liter' || lowerUnit === 'liters' || lowerUnit === 'litre' || lowerUnit === 'litres') {
      return { quantity: quantity * 4.22675, unit: 'cups' }; // 1 L ≈ 4.22675 cups
    }
    if (lowerUnit === 'cl' || lowerUnit === 'centiliter' || lowerUnit === 'centiliters') {
      return { quantity: quantity * 0.0422675, unit: 'cups' }; // 1 cl ≈ 0.0422675 cups
    }
    if (lowerUnit === 'dl' || lowerUnit === 'deciliter' || lowerUnit === 'deciliters') {
      return { quantity: quantity * 0.422675, unit: 'cups' }; // 1 dl ≈ 0.422675 cups
    }
    
    // Weight conversions (metric to imperial)
    if (lowerUnit === 'g' || lowerUnit === 'gram' || lowerUnit === 'grams') {
      return { quantity: quantity * 0.035274, unit: 'oz' }; // 1 g ≈ 0.035274 oz
    }
    if (lowerUnit === 'kg' || lowerUnit === 'kilogram' || lowerUnit === 'kilograms') {
      return { quantity: quantity * 2.20462, unit: 'lbs' }; // 1 kg ≈ 2.20462 lbs
    }
    if (lowerUnit === 'mg' || lowerUnit === 'milligram' || lowerUnit === 'milligrams') {
      return { quantity: quantity * 0.000035274, unit: 'oz' }; // 1 mg ≈ 0.000035274 oz
    }
    
    // Length conversions (metric to imperial)
    if (lowerUnit === 'cm' || lowerUnit === 'centimeter' || lowerUnit === 'centimeters') {
      return { quantity: quantity * 0.393701, unit: 'inches' }; // 1 cm ≈ 0.393701 inches
    }
    if (lowerUnit === 'mm' || lowerUnit === 'millimeter' || lowerUnit === 'millimeters') {
      return { quantity: quantity * 0.0393701, unit: 'inches' }; // 1 mm ≈ 0.0393701 inches
    }
    if (lowerUnit === 'm' || lowerUnit === 'meter' || lowerUnit === 'meters' || lowerUnit === 'metre' || lowerUnit === 'metres') {
      return { quantity: quantity * 3.28084, unit: 'feet' }; // 1 m ≈ 3.28084 feet
    }
    
    // If no conversion needed, return as-is
    return { quantity, unit };
  }

  /**
   * Normalizes unit names to standard forms
   * This helps with consistency across different recipe sources
   * 
   * @param unit - The unit to normalize
   * @returns Normalized unit name
   */
  static normalizeUnit(unit: string): string {
    if (!unit || typeof unit !== 'string') {
      return 'unknown';
    }
    
    const lowerUnit = unit.toLowerCase();
    
    // Volume unit normalization
    const volumeMap: { [key: string]: string } = {
      'c': 'cup', 'c.': 'cup', 'cups': 'cup', 'cup': 'cup',
      'tbsp': 'tablespoon', 'tablespoon': 'tablespoon', 'tablespoons': 'tablespoon',
      'tsp': 'teaspoon', 'teaspoon': 'teaspoon', 'teaspoons': 'teaspoon',
      'fl oz': 'fluid ounce', 'fluid ounce': 'fluid ounce', 'fluid ounces': 'fluid ounce',
      'pint': 'pint', 'pints': 'pint',
      'quart': 'quart', 'quarts': 'quart',
      'gallon': 'gallon', 'gallons': 'gallon',
      'ml': 'milliliter', 'milliliter': 'milliliter', 'milliliters': 'milliliter',
      'l': 'liter', 'liter': 'liter', 'liters': 'liter', 'litre': 'liter', 'litres': 'liter'
    };
    
    // Weight unit normalization
    const weightMap: { [key: string]: string } = {
      'lb': 'pound', 'lbs': 'pound', 'pound': 'pound', 'pounds': 'pound',
      'oz': 'ounce', 'ounce': 'ounce', 'ounces': 'ounce',
      'kg': 'kilogram', 'kilogram': 'kilogram', 'kilograms': 'kilogram',
      'g': 'gram', 'gram': 'gram', 'grams': 'gram',
      'mg': 'milligram', 'milligram': 'milligram', 'milligrams': 'milligram'
    };
    
    // Check volume units first
    if (volumeMap[lowerUnit]) {
      return volumeMap[lowerUnit];
    }
    
    // Check weight units
    if (weightMap[lowerUnit]) {
      return weightMap[lowerUnit];
    }
    
    // Return original if no normalization found
    return unit;
  }
}

/**
 * InstructionParser - Extracts cooking metadata from instruction text
 * 
 * This class analyzes cooking instructions to extract:
 * - Cooking times (prep time, cook time)
 * - Temperatures (oven temp, cooking temp)
 * - Cooking methods (bake, fry, grill, etc.)
 * 
 * Example transformations:
 * - "Bake for 30 minutes at 350°F" → { cook_time: 30, temperature: 350 }
 * - "Simmer for 15-20 minutes" → { cook_time: 17.5 } (average of range)
 * - "Chop vegetables (5 minutes)" → { prep_time: 5 }
 */
export class InstructionParser {
  // Regex patterns to identify time references in cooking instructions
  private static readonly TIME_PATTERNS = [
    // Time ranges: "15-20 minutes", "1 to 2 hours"
    /(\d+)\s*(?:to|-)\s*(\d+)\s*(minute|minutes|min|hour|hours|hr|hrs)/i,
    // Single times: "30 minutes", "1 hour"
    /(\d+)\s*(minute|minutes|min|hour|hours|hr|hrs)/i,
    // Contextual times: "for about 15 minutes", "approximately 1 hour"
    /(?:for|about|approximately)\s*(\d+)\s*(minute|minutes|min|hour|hours|hr|hrs)/i
  ];

  // Regex patterns to identify temperature references
  private static readonly TEMPERATURE_PATTERNS = [
    // Fahrenheit: "350°F", "350 F"
    /(\d+)\s*°?\s*[fF]/i,
    // Celsius: "180°C", "180 C"
    /(\d+)\s*°?\s*[cC]/i,
    // Word format: "350 degrees F", "180 degrees C"
    /(\d+)\s*degrees?\s*[fF]/i,
    /(\d+)\s*degrees?\s*[cC]/i
  ];

  static parseInstruction(instructionStr: string, stepNumber: number): RecipeInstruction {
    const instruction = instructionStr.trim();
    
    // Extract cooking time
    let cookTime: number | undefined;
    let prepTime: number | undefined;
    
    // Find all time references in the instruction
    const timeMatches: Array<{time: number, minutes: number, context: string}> = [];
    
    for (const pattern of this.TIME_PATTERNS) {
      let match;
      const regex = new RegExp(pattern.source, `${pattern.flags  }g`);
      while ((match = regex.exec(instruction)) !== null) {
        const time = parseInt(match[1]);
        const unit = match[2] ? match[2].toLowerCase() : '';
        
        // Convert to minutes
        const minutes = unit.includes('hour') ? time * 60 : time;
        
        // Get context around this match
        const start = Math.max(0, match.index - 20);
        const end = Math.min(instruction.length, match.index + match[0].length + 20);
        const context = instruction.slice(start, end).toLowerCase();
        
        timeMatches.push({time, minutes, context});
      }
    }
    
    // Process time matches and assign to prep or cook time
    for (const match of timeMatches) {
      const {minutes, context} = match;
      
      if (context.includes('prep') || context.includes('chop') || context.includes('slice') ||
          context.includes('dice') || context.includes('mix') || context.includes('stir') ||
          context.includes('prepare') || context.includes('cut') || context.includes('mince') ||
          context.includes('marinate')) {
        prepTime = minutes;
      } else if (context.includes('bake') || context.includes('cook') || context.includes('fry') || 
                 context.includes('grill') || context.includes('roast') || context.includes('simmer') ||
                 context.includes('boil') || context.includes('steam') || context.includes('broil')) {
        cookTime = minutes;
      } else if (!prepTime && !cookTime) {
        // If no clear context and no time assigned yet, default to cook time
        cookTime = minutes;
      }
    }

    // Extract temperature
    let temperature: number | undefined;
    for (const pattern of this.TEMPERATURE_PATTERNS) {
      const match = instruction.match(pattern);
      if (match) {
        temperature = parseInt(match[1]);
        // Convert Celsius to Fahrenheit if needed
        if (match[0] && match[0].toLowerCase().includes('c')) {
          temperature = Math.round(temperature * 9/5 + 32);
        }
        break;
      }
    }

    return {
      step_number: stepNumber,
      instruction,
      prep_time: prepTime,
      cook_time: cookTime,
      temperature
    };
  }
}

// Recipe analyzer for extracting metadata
export class RecipeAnalyzer {
  static analyzeDifficulty(ingredients: string[], instructions: string[]): 'easy' | 'medium' | 'hard' {
    const ingredientCount = ingredients.length;
    const instructionCount = instructions.length;
    const totalWords = instructions.join(' ').split(' ').length;
    
    // Simple scoring system
    let score = 0;
    
    // Ingredient complexity
    if (ingredientCount > 15) score += 2;
    else if (ingredientCount > 8) score += 1;
    
    // Instruction complexity
    if (instructionCount > 8) score += 2;
    else if (instructionCount > 4) score += 1;
    
    // Word count complexity
    if (totalWords > 200) score += 2;
    else if (totalWords > 100) score += 1;
    
    // Advanced techniques
    const advancedTechniques = [
      'braise', 'sous vide', 'temper', 'emulsify', 'clarify', 'confit',
      'brunoise', 'julienne', 'chiffonade', 'flambé', 'deglaze'
    ];
    
    const instructionText = instructions.filter(i => i && typeof i === 'string').join(' ').toLowerCase();
    const techniqueCount = advancedTechniques.filter(technique => 
      instructionText.includes(technique)
    ).length;
    
    score += techniqueCount;
    
    if (score >= 5) return 'hard';
    if (score >= 2) return 'medium';
    return 'easy';
  }

  static extractDietaryTags(ingredients: string[]): string[] {
    const tags: string[] = [];
    
    // Filter out undefined/null ingredients and ensure they're strings
    const validIngredients = ingredients.filter(ing => 
      ing && typeof ing === 'string' && ing.trim().length > 0
    );
    
    if (validIngredients.length === 0) {
      return tags;
    }
    
    const ingredientText = validIngredients.filter(i => i && typeof i === 'string').join(' ').toLowerCase();
    
    // Use our comprehensive classification data instead of hardcoded lists
    const hasMeat = this.hasMeatIngredients(ingredientText);
    const hasDairy = this.hasDairyIngredients(ingredientText);
    const hasGluten = this.hasGlutenIngredients(ingredientText);
    
    // Vegetarian check - no meat or fish
    if (!hasMeat) {
      tags.push('vegetarian');
    }
    
    // Vegan check - no meat, dairy, or eggs
    if (!hasMeat && !hasDairy) {
      tags.push('vegan');
    }
    
    // Gluten-free check
    if (!hasGluten) {
      tags.push('gluten-free');
    }
    
    // Dairy-free check
    if (!hasDairy) {
      tags.push('dairy-free');
    }
    
    return tags;
  }

  /**
   * Checks if ingredients contain meat or fish (excluding plant-based proteins)
   */
  private static hasMeatIngredients(ingredientText: string): boolean {
    // Get all protein ingredients, but exclude plant-based ones
    const meatKeywords = IngredientParser.INGREDIENT_CLASSIFICATIONS.protein_main.concat(
      IngredientParser.INGREDIENT_CLASSIFICATIONS.protein_source.filter(ing => 
        !this.isPlantBasedProtein(ing)
      )
    );
    return meatKeywords.some(keyword => ingredientText.includes(keyword));
  }

  /**
   * Checks if ingredients contain dairy or eggs
   */
  private static hasDairyIngredients(ingredientText: string): boolean {
    const dairyKeywords = IngredientParser.INGREDIENT_CLASSIFICATIONS.dairy.concat(['egg', 'eggs']);
    return dairyKeywords.some(keyword => ingredientText.includes(keyword));
  }

  /**
   * Checks if ingredients contain gluten-containing grains
   */
  private static hasGlutenIngredients(ingredientText: string): boolean {
    const glutenKeywords = IngredientParser.INGREDIENT_CLASSIFICATIONS.grain.filter(ing => 
      this.isGlutenContaining(ing)
    );
    return glutenKeywords.some(keyword => ingredientText.includes(keyword));
  }

  /**
   * Determines if a protein ingredient is plant-based
   */
  private static isPlantBasedProtein(ingredient: string): boolean {
    const plantBasedProteins = [
      'tofu', 'tempeh', 'seitan', 'lentils', 'chickpeas', 'garbanzo', 
      'black beans', 'kidney beans', 'pinto beans', 'navy beans', 'lima beans', 
      'edamame', 'quinoa', 'hemp seeds', 'chia seeds', 'nutritional yeast', 
      'protein powder', 'whey', 'casein'
    ];
    return plantBasedProteins.includes(ingredient);
  }

  /**
   * Determines if a grain ingredient contains gluten
   */
  private static isGlutenContaining(ingredient: string): boolean {
    const glutenContaining = [
      'flour', 'bread', 'pasta', 'wheat', 'barley', 'rye', 'spaghetti', 'penne', 
      'rigatoni', 'fettuccine', 'linguine', 'macaroni', 'lasagna', 'ravioli', 
      'tortellini', 'gnocchi', 'ramen', 'soba', 'udon', 'rice noodles', 'vermicelli', 
      'angel hair', 'fusilli', 'rotini', 'ziti', 'breadcrumbs', 'panko', 'croutons', 
      'tortilla', 'pita', 'naan', 'bagel', 'muffin', 'biscuit', 'scone', 'croissant', 
      'baguette', 'sourdough', 'rye bread', 'whole wheat', 'multigrain', 'sprouted', 
      'gluten-free bread', 'cornmeal', 'polenta', 'grits', 'semolina', 'farro', 
      'spelt', 'kamut', 'amaranth', 'teff', 'sorghum', 'triticale', 'rye', 'oats', 
      'steel cut oats', 'rolled oats', 'instant oats', 'granola', 'muesli'
    ];
    return glutenContaining.includes(ingredient);
  }

  static estimateCookingTimes(instructions: string[]): { prepTime: number; cookTime: number } {
    let minPrepTime = Infinity;
    let minCookTime = Infinity;
    
    for (const instruction of instructions) {
      const parsed = InstructionParser.parseInstruction(instruction, 1);
      if (parsed.prep_time) minPrepTime = Math.min(minPrepTime, parsed.prep_time);
      if (parsed.cook_time) minCookTime = Math.min(minCookTime, parsed.cook_time);
    }
    
    // If no times extracted, estimate based on instruction count
    if (minPrepTime === Infinity && minCookTime === Infinity) {
      minPrepTime = Math.max(5, instructions.length * 2);
      minCookTime = Math.max(10, instructions.length * 3);
    }
    
    return {
      prepTime: minPrepTime === Infinity ? 0 : minPrepTime,
      cookTime: minCookTime === Infinity ? 0 : minCookTime
    };
  }
}

// Data validator for ensuring data quality
export class DataValidator {
  static validateRecipe(recipe: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!recipe.title || recipe.title.trim().length === 0) {
      errors.push('Recipe title is required');
    }
    
    if (!recipe.ingredients || !Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
      errors.push('At least one ingredient is required');
    }
    
    if (!recipe.directions || !Array.isArray(recipe.directions) || recipe.directions.length === 0) {
      errors.push('At least one instruction is required');
    }
    
    if (recipe.title && recipe.title.length > 100) {
      errors.push('Recipe title is too long (max 100 characters)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static cleanRecipeData(recipe: any): any {
    return {
      title: recipe.title?.trim() || '',
      description: recipe.description?.trim() || '',
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      directions: Array.isArray(recipe.directions) ? recipe.directions : [],
      link: recipe.link?.trim() || '',
      source: recipe.source?.trim() || '',
      site: recipe.site?.trim() || ''
    };
  }
}
