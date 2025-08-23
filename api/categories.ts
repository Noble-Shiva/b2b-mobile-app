import { get } from './client';
import { ApiCategoryResponse, Category, mapApiCategoryToCategory, ApiCategory } from '@/models/category';

// API endpoint for categories
const CATEGORIES_ENDPOINT = '/categories?client_id=ac_0123';

// Function to fetch categories from the API
export const fetchCategories = async (filterNoProducts: boolean = true): Promise<Category[]> => {
  try {
    // Fetch the raw data from API
    const response = await get<ApiCategory[] | ApiCategoryResponse>(CATEGORIES_ENDPOINT);
    
    let categoryData: ApiCategory[] = [];
    
    // Log response structure to understand what we're dealing with
    console.log('API Response type:', Array.isArray(response) ? 'array' : typeof response);
    if (typeof response === 'object' && response !== null) {
      console.log('Response keys:', Object.keys(response));
    }
    
    // Handle different possible response formats
    if (Array.isArray(response)) {
      // Direct array of categories
      console.log('Response is array with', response.length, 'categories');
      
      // Check if response objects have a 'product' array
      const firstItem = response[0];
      if (firstItem && typeof firstItem === 'object' && 'product' in firstItem && Array.isArray(firstItem.product)) {
        console.log('Response objects contain product arrays');
        
        // Process and flatten all product arrays from all response items
        const allProducts: ApiCategory[] = [];
        
        response.forEach((item: any) => {
          if (item && typeof item === 'object' && 'product' in item && Array.isArray(item.products)) {
            console.log(`Processing ${item.products.length} products from response item`);
            
            // Map product array items to ApiCategory format
            const products = item.products.map((prod: any) => {
              // Create a consistent ApiCategory object from product data
              const category: ApiCategory = {
                name: prod.name || prod.title || '',
                id: prod.id || prod.product_id || prod.term_id || undefined,
                slug: prod.slug || prod.product_slug || undefined,
                image: prod.image || prod.thumbnail || prod.image_url || undefined,
              };
              return category;
            });
            
            allProducts.push(...products);
          }
        });
        
        if (allProducts.length > 0) {
          console.log(`Processed a total of ${allProducts.length} products from all response items`);
          categoryData = allProducts;
        } else {
          // If no products were found, use the original response
          categoryData = response;
        }
      } else {
        // Regular array of categories
        categoryData = response;
      }
    } else if (response && typeof response === 'object') {
      // Response with a data property
      if ('data' in response && Array.isArray(response.data)) {
        console.log('Response has data array with', response.data.length, 'categories');
        categoryData = response.data;
      } else if ('success' in response && !response.success) {
        throw new Error(response.message || 'API returned error status');
      } else if ('id' in response && 'name' in response) {
        // Single category object - more lenient check
        console.log('Response is a single category object with id and name');
        
        // Use type assertion with a record to access properties safely
        const responseObj = response as Record<string, unknown>;
        
        // Safely convert the response to an ApiCategory object
        const safeCategory: ApiCategory = {
          name: String(responseObj.name || ''),
          // Type-safe conversion for id
          id: responseObj.id as string | number | undefined,
        };
        
        // Add optional properties if they exist
        if ('slug' in responseObj && responseObj.slug) {
          safeCategory.slug = String(responseObj.slug);
        }
        
        // Handle image fields safely
        if ('image' in responseObj && responseObj.image) {
          safeCategory.image = String(responseObj.image);
        }
        if ('image_url' in responseObj && responseObj.image_url) {
          safeCategory.image_url = String(responseObj.image_url);
        }
        if ('thumbnail' in responseObj && responseObj.thumbnail) {
          safeCategory.thumbnail = String(responseObj.thumbnail);
        }
        
        console.log('Safe category created:', safeCategory);
        categoryData = [safeCategory];
      } else {
        // Try to extract categories from the unknown structure
        console.log('Unknown response format, attempting to extract category data...');
        // Check if any of the properties look like an array of categories
        const potentialArrays = Object.entries(response as Record<string, any>)
          .filter(([_, value]) => Array.isArray(value) && value.length > 0);
        
        if (potentialArrays.length > 0) {
          // Use the first array property we find
          const [key, array] = potentialArrays[0];
          console.log(`Found potential category array in property '${key}' with ${array.length} items`);
          categoryData = array;
        } else {
          // As a last resort, try to interpret the entire response as a category
          console.log('No arrays found, trying to interpret response as a category');
          try {
            // Extract any properties that look useful for a category
            const extractedCategory: Partial<ApiCategory> = {};
            Object.entries(response as Record<string, any>).forEach(([key, value]) => {
              if (key === 'id' || key === 'term_id') extractedCategory.id = value;
              if (key === 'name') extractedCategory.name = String(value);
              if (key === 'slug') extractedCategory.slug = String(value);
              if (key === 'image' || key === 'image_url' || key === 'thumbnail') {
                extractedCategory.image = String(value);
              }
            });
            
            if (extractedCategory.id || extractedCategory.name) {
              console.log('Created category from extracted properties:', extractedCategory);
              categoryData = [extractedCategory as ApiCategory];
            } else {
              throw new Error('Could not extract category data');
            }
          } catch (error) {
            console.log('Unknown response format:', JSON.stringify(response).slice(0, 200) + '...');
            throw new Error('Unexpected API response format');
          }
        }
      }
    } else {
      throw new Error('Unexpected API response format');
    }
    
    // Filter out categories without products if requested
    if (filterNoProducts) {
      console.log('Filtering categories to only include those with products');
      categoryData = categoryData.filter((cat: any) => {
        // Check if the category has a count property greater than zero
        if (cat.count !== undefined && cat.count > 0) {
          return true;
        }
        
        // Fallback to checking product arrays if count is not available
        if (cat.product && Array.isArray(cat.product) && cat.product.length > 0) {
          return true;
        }
        
        if (cat.products && Array.isArray(cat.products) && cat.products.length > 0) {
          // Normalize data structure by moving items to 'product' property
          cat.product = cat.products;
          return true;
        }
        
        return false;
      });
      
      console.log(`After filtering, ${categoryData.length} categories with products remain`);
    }
    
    // Convert all API categories to our internal model with proper error handling
    try {
      // Map each API category to our internal model
      return categoryData.map(mapApiCategoryToCategory);
    } catch (error) {
      console.error('Error mapping category data:', error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
