/**
 * Category mapping utility to help map frontend category names to backend category IDs/names
 * This ensures products added by admin appear in the correct user-side category pages
 */

// Category mapping configuration
export const CATEGORY_MAPPING = {
  // Electronics category mappings
  'electronics': ['electronics', 'electronic', 'tech'],
  'smartphones': ['smartphones', 'mobile', 'phone', 'smartphone'],
  'laptops': ['laptops', 'laptop', 'notebook'],
  'computers': ['computers', 'computer', 'pc', 'desktop'],
  'headphones': ['headphones', 'headphone', 'earphones', 'earbuds'],
  
  // Fashion category mappings
  'fashion': ['fashion', 'clothing', 'apparel'],
  'clothing': ['clothing', 'clothes', 'apparel', 'garments'],
  
  // Home & Kitchen category mappings
  'home-kitchen': ['home', 'kitchen', 'home-kitchen', 'furniture', 'home-decor', 'bedding', 'garden', 'tools'],
  'home': ['home', 'furniture', 'home-decor', 'bedding', 'garden', 'tools'],
  'kitchen': ['kitchen', 'cookware', 'kitchenware'],
  
  // Books & Media category mappings
  'books': ['books', 'book', 'literature', 'media'],
  'music': ['music', 'audio', 'cd', 'vinyl'],
  'movies': ['movies', 'film', 'dvd', 'blu-ray'],
  
  // Sports category mappings
  'sports': ['sports', 'sport', 'fitness', 'outdoor', 'athletic'],
  
  // Add more mappings as needed
};

/**
 * Check if a product belongs to a specific category based on its category field
 * @param {Object} product - Product object with category field
 * @param {string} targetCategory - Target category name (e.g., 'electronics', 'smartphones')
 * @returns {boolean} - True if product belongs to the category
 */
export const isProductInCategory = (product, targetCategory) => {
  if (!product || !product.category) return false;
  
  const productCategory = product.category.toLowerCase();
  const categoryVariations = CATEGORY_MAPPING[targetCategory.toLowerCase()] || [targetCategory.toLowerCase()];
  
  return categoryVariations.some(variation => 
    productCategory.includes(variation) || 
    variation.includes(productCategory)
  );
};

/**
 * Filter products by category using the mapping
 * @param {Array} products - Array of products
 * @param {string} category - Category name to filter by
 * @returns {Array} - Filtered products
 */
export const filterProductsByCategory = (products, category) => {
  if (!products || !Array.isArray(products)) return [];
  if (!category) return products;
  
  return products.filter(product => isProductInCategory(product, category));
};

/**
 * Get category display name from product category
 * @param {string} productCategory - Product's category field
 * @returns {string} - Display-friendly category name
 */
export const getCategoryDisplayName = (productCategory) => {
  if (!productCategory) return 'Uncategorized';
  
  const category = productCategory.toLowerCase();
  
  // Find the main category that contains this product category
  for (const [mainCategory, variations] of Object.entries(CATEGORY_MAPPING)) {
    if (variations.some(variation => 
      category.includes(variation) || variation.includes(category)
    )) {
      return mainCategory.charAt(0).toUpperCase() + mainCategory.slice(1);
    }
  }
  
  return productCategory.charAt(0).toUpperCase() + productCategory.slice(1);
};

/**
 * Get all available categories from products
 * @param {Array} products - Array of products
 * @returns {Array} - Array of unique category names
 */
export const getAvailableCategories = (products) => {
  if (!products || !Array.isArray(products)) return [];
  
  const categories = new Set();
  products.forEach(product => {
    if (product.category) {
      categories.add(getCategoryDisplayName(product.category));
    }
  });
  
  return Array.from(categories).sort();
};
