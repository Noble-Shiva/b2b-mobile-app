// TypeScript model for category data from the API

// API Response type from ayurcentral API 
export interface ApiCategoryResponse {
  success: boolean;
  message: string;
  data: ApiCategory[];
}

// Image object interfaces for WooCommerce and WordPress style responses
interface WooCommerceImage {
  src: string;
  alt?: string;
  name?: string;
  id?: number | string;
}

interface WordPressImage {
  url: string;
  id?: number | string;
  alt?: string;
  title?: string;
}

// API Category item structure
export interface ApiCategory {
  term_id?: number; // Make term_id optional since some APIs might not have it
  id?: number | string; // Some APIs use 'id' instead of 'term_id'
  name: string;
  slug?: string; // Make slug optional as it might not be present in all responses
  term_group?: number; // Make these optional since they might not be present
  term_taxonomy_id?: number;
  taxonomy?: string;
  parent?: number;
  count?: number;
  filter?: string;
  term_order?: string;
  // Support various image formats
  image?: string | WooCommerceImage | WordPressImage | Record<string, any>;
  image_url?: string; // Some categories might have image_url instead of image
  thumbnail?: string; // Some categories might use thumbnail
  description?: string;
  // Additional product-related fields
  product_id?: number | string;
  product_slug?: string;
  title?: string; // Some products use title instead of name
}

// Converted model for our app usage 
export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  image: string;
}

// Default images for categories if none are available from API
const defaultCategoryImages = [
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=300&auto=format&fit=crop', // Ayurvedic herbs
  'https://images.unsplash.com/photo-1589243837929-71a0d3fa9694?q=80&w=300&auto=format&fit=crop', // Medicinal plants
  'https://images.unsplash.com/photo-1516401266446-6432a8a07d41?q=80&w=300&auto=format&fit=crop', // Natural remedies
  'https://images.unsplash.com/photo-1445264718234-a623be589d37?q=80&w=300&auto=format&fit=crop', // Health supplements
  'https://images.unsplash.com/photo-1602541916542-e55c055c96de?q=80&w=300&auto=format&fit=crop', // Wellness products
];

// Emoji icons for categories
const categoryIcons = {
  'ayurvedic-medicines': '🌿',
  'herbs-botanicals': '🍃',
  'supplements': '💊',
  'wellness': '🧘',
  'natural-remedies': '🍵',
  'personal-care': '🧴',
  default: '🌱',
};

// Create a unique ID for categories that might not have one
let idCounter = 1000;

// Helper function to create a slug from a name
const createSlugFromName = (name: string): string => {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    || `category-${idCounter++}`; // Fallback if empty
};

// Converting API data to our app model with robust error handling
export const mapApiCategoryToCategory = (apiCategory: ApiCategory): Category => {
  // Generate a slug if one isn't provided
  const slug = apiCategory.slug || 
    (apiCategory.name ? createSlugFromName(apiCategory.name) : `category-${idCounter}`);
  
  // Get emoji icon based on slug or use default
  const icon = categoryIcons[slug as keyof typeof categoryIcons] || categoryIcons.default;
  
  // Get image URL from API or use default
  let imageUrl = '';
  
  // Try to get image from various possible properties with enhanced handling for products
  // Handle complex image object structures that might exist in product data
  if (apiCategory.image && typeof apiCategory.image === 'object' && 'src' in apiCategory.image) {
    // Handle WooCommerce style image objects
    imageUrl = String(apiCategory.image.src);
  } else if (apiCategory.image && typeof apiCategory.image === 'object' && 'url' in apiCategory.image) {
    // Handle WordPress style image objects
    imageUrl = String(apiCategory.image.url);
  } else if (apiCategory.image && typeof apiCategory.image === 'string') {
    // Handle direct image URLs
    if (apiCategory.image.startsWith('http')) {
      imageUrl = apiCategory.image;
    } else if (apiCategory.image.startsWith('/')) {
      // Handle relative URLs by prepending domain
      imageUrl = 'https://ayurcentral.in' + apiCategory.image;
    }
  } else if (apiCategory.image_url && typeof apiCategory.image_url === 'string' && apiCategory.image_url.startsWith('http')) {
    imageUrl = apiCategory.image_url;
  } else if (apiCategory.thumbnail && typeof apiCategory.thumbnail === 'string' && apiCategory.thumbnail.startsWith('http')) {
    imageUrl = apiCategory.thumbnail;
  } else {
    // Use a random default image if no valid image URL found
    const randomIndex = Math.floor(Math.random() * defaultCategoryImages.length);
    imageUrl = defaultCategoryImages[randomIndex];
  }
  
  // Handle case where term_id might be undefined
  let id: string;
  if (apiCategory.term_id !== undefined && apiCategory.term_id !== null) {
    id = apiCategory.term_id.toString();
  } else if ('id' in apiCategory && apiCategory.id !== undefined && apiCategory.id !== null) {
    // Some APIs might use 'id' instead of 'term_id'
    id = String(apiCategory.id);
  } else {
    // Generate a unique ID if none exists
    id = `temp-${idCounter++}`;
  }
  
  return {
    id,
    name: apiCategory.name || `Category ${id}`,
    icon,
    slug,
    image: imageUrl,
  };
};
