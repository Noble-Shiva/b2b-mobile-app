// Mock data for development purposes
// In a real app, this would be replaced with actual API calls

import { get } from './client';

// Create a simple delay function since it's not in helpers.ts
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Product type definition
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  ratingCount: number;
  inStock: boolean;
  discount: number;
  featured: boolean;
  [key: string]: any;
}

// Order type definition
export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  date: string;
  total: number;
  items: any[];
  [key: string]: any;
}

// Categories
const categories = [
  { id: '1', name: 'Vegetables', icon: '🥦' },
  { id: '2', name: 'Fruits', icon: '🍎' },
  { id: '3', name: 'Dairy', icon: '🥛' },
  { id: '4', name: 'Bakery', icon: '🍞' },
  { id: '5', name: 'Snacks', icon: '🍿' },
  { id: '6', name: 'Beverages', icon: '🥤' },
  { id: '7', name: 'Personal Care', icon: '🧴' },
  { id: '8', name: 'Household', icon: '🧹' },
  { id: '9', name: 'Breakfast', icon: '🥣' },
  { id: '10', name: 'Meat', icon: '🥩' },
  { id: '11', name: 'Frozen', icon: '❄️' },
  { id: '12', name: 'Instant Food', icon: '🍜' }
];

// Products
const products = [
  {
    id: '1',
    name: 'Fresh Spinach',
    description: 'Organic spinach leaves, locally sourced and packed with nutrients.',
    price: 159,  // ₹159 (converted from $1.99)
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=300&auto=format&fit=crop',
    category: '1',
    rating: 4.8,
    ratingCount: 245,
    inStock: true,
    discount: 10,
    featured: true,
    weight: '250g',
    origin: 'Local Farm'
  },
  {
    id: '2',
    name: 'Organic Carrots',
    description: 'Sweet and crunchy organic carrots, perfect for salads or cooking.',
    price: 199,  // ₹199 (converted from $2.49)
    image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?q=80&w=300&auto=format&fit=crop',
    category: '1',
    rating: 4.6,
    ratingCount: 189,
    inStock: true,
    discount: 0,
    featured: true,
    weight: '500g',
    origin: 'Organic Farms'
  },
  {
    id: '3',
    name: 'Red Apples',
    description: 'Crisp and sweet red apples, perfect for snacking or baking.',
    price: 319,  // ₹319 (converted from $3.99)
    image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=300&auto=format&fit=crop',
    category: '2',
    rating: 4.9,
    ratingCount: 352,
    inStock: true,
    discount: 15,
    featured: true,
    weight: '1kg',
    origin: 'Washington',
    hasOptions: true
  },
  {
    id: '4',
    name: 'Banana Bunch',
    description: 'Ripe and ready-to-eat bananas, rich in potassium and natural energy.',
    price: 143,  // ₹143 (converted from $1.79)
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=300&auto=format&fit=crop',
    category: '2',
    rating: 4.7,
    ratingCount: 128,
    inStock: true,
    discount: 0,
    featured: false,
    weight: '~7 pcs (1kg)',
    origin: 'Ecuador'
  },
  {
    id: '5',
    name: 'Whole Milk',
    description: 'Fresh whole milk from grass-fed cows, pasteurized for safety.',
    price: 239,  // ₹239 (converted from $2.99)
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=300&auto=format&fit=crop',
    category: '3',
    rating: 4.5,
    ratingCount: 215,
    inStock: true,
    discount: 5,
    featured: true,
    volume: '1L',
    origin: 'Local Dairy',
    hasOptions: true
  },
  {
    id: '6',
    name: 'Greek Yogurt',
    description: 'Creamy Greek yogurt, high in protein and perfect for breakfast or snacks.',
    price: 359,  // ₹359 (converted from $4.49)
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=300&auto=format&fit=crop',
    category: '3',
    rating: 4.8,
    ratingCount: 178,
    inStock: true,
    discount: 0,
    featured: true,
    weight: '500g',
    origin: 'Artisan Dairy'
  },
  {
    id: '7',
    name: 'Sourdough Bread',
    description: 'Artisanal sourdough bread, freshly baked with a perfect crust.',
    price: 399,  // ₹399 (converted from $4.99)
    image: 'https://images.unsplash.com/photo-1585478259715-4d3a5f4a8b71?q=80&w=300&auto=format&fit=crop',
    category: '4',
    rating: 4.9,
    ratingCount: 156,
    inStock: true,
    discount: 0,
    featured: true,
    weight: '500g',
    origin: 'Local Bakery'
  },
  {
    id: '8',
    name: 'Chocolate Croissants',
    description: 'Buttery croissants filled with rich chocolate, baked to golden perfection.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=300&auto=format&fit=crop',
    category: '4',
    rating: 4.6,
    ratingCount: 203,
    inStock: true,
    discount: 10,
    featured: false,
    quantity: '4 pcs',
    origin: 'French Bakery',
    hasOptions: true
  },
  {
    id: '9',
    name: 'Potato Chips',
    description: 'Crispy potato chips with just the right amount of salt.',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=300&auto=format&fit=crop',
    category: '5',
    rating: 4.7,
    ratingCount: 189,
    inStock: true,
    discount: 0,
    featured: false,
    weight: '150g',
    origin: 'Snack Co.'
  },
  {
    id: '10',
    name: 'Mixed Nuts',
    description: 'Premium blend of roasted almonds, cashews, and walnuts.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=300&auto=format&fit=crop',
    category: '5',
    rating: 4.5,
    ratingCount: 142,
    inStock: true,
    discount: 0,
    featured: true,
    weight: '250g',
    origin: 'Premium Nuts Inc.'
  },
  {
    id: '11',
    name: 'Sparkling Water',
    description: 'Refreshing sparkling water with natural fruit flavors, zero calories.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1598540172462-b3a29564fd51?q=80&w=300&auto=format&fit=crop',
    category: '6',
    rating: 4.4,
    ratingCount: 167,
    inStock: true,
    discount: 0,
    featured: false,
    volume: '6 x 330ml',
    origin: 'Spring Water Co.',
    hasOptions: true
  },
  {
    id: '12',
    name: 'Cold Brew Coffee',
    description: 'Smooth cold brew coffee made from premium arabica beans.',
    price: 4.49,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=300&auto=format&fit=crop',
    category: '6',
    rating: 4.8,
    ratingCount: 213,
    inStock: true,
    discount: 5,
    featured: true,
    volume: '500ml',
    origin: 'Artisan Coffee'
  },
  {
    id: '13',
    name: 'Shampoo',
    description: 'Nourishing shampoo for all hair types, with natural ingredients.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1556227834-09f1de7a7d14?q=80&w=300&auto=format&fit=crop',
    category: '7',
    rating: 4.6,
    ratingCount: 178,
    inStock: true,
    discount: 10,
    featured: false,
    volume: '400ml',
    origin: 'Natural Care'
  },
  {
    id: '14',
    name: 'Hand Soap',
    description: 'Gentle hand soap with moisturizing properties and a fresh scent.',
    price: 279,  // ₹279 (converted from $3.49)
    image: 'https://images.unsplash.com/photo-1607006344380-b6775a0824ce?q=80&w=300&auto=format&fit=crop',
    category: '7',
    rating: 4.7,
    ratingCount: 156,
    inStock: true,
    discount: 0,
    featured: false,
    volume: '300ml',
    origin: 'Clean Hands Co.'
  },
  {
    id: '15',
    name: 'Laundry Detergent',
    description: 'Effective laundry detergent that removes stains while being gentle on fabrics.',
    price: 719,  // ₹719 (converted from $8.99)
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=300&auto=format&fit=crop',
    category: '8',
    rating: 4.5,
    ratingCount: 189,
    inStock: true,
    discount: 15,
    featured: true,
    volume: '1.5L',
    origin: 'Clean Home',
    hasOptions: true
  },
  {
    id: '16',
    name: 'Dish Sponges',
    description: 'Durable dish sponges with scrubbing power for tough messes.',
    price: 2.49,
    image: 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?q=80&w=300&auto=format&fit=crop',
    category: '8',
    rating: 4.3,
    ratingCount: 142,
    inStock: true,
    discount: 0,
    featured: false,
    quantity: '4 pcs',
    origin: 'Kitchen Essentials'
  },
  {
    id: '17',
    name: 'Granola',
    description: 'Crunchy granola with nuts, seeds, and dried fruits for a nutritious breakfast.',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1517593541899-73150c4c6a4d?q=80&w=300&auto=format&fit=crop',
    category: '9',
    rating: 4.8,
    ratingCount: 213,
    inStock: true,
    discount: 0,
    featured: true,
    weight: '400g',
    origin: 'Healthy Breakfast Co.'
  },
  {
    id: '18',
    name: 'Instant Oatmeal',
    description: 'Quick-cooking oatmeal packets in various flavors for busy mornings.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?q=80&w=300&auto=format&fit=crop',
    category: '9',
    rating: 4.5,
    ratingCount: 178,
    inStock: true,
    discount: 5,
    featured: false,
    quantity: '8 packets',
    origin: 'Morning Foods',
    hasOptions: true
  },
  {
    id: '19',
    name: 'Chicken Breast',
    description: 'Premium boneless, skinless chicken breasts, perfect for grilling or baking.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=300&auto=format&fit=crop',
    category: '10',
    rating: 4.7,
    ratingCount: 156,
    inStock: true,
    discount: 0,
    featured: true,
    weight: '500g',
    origin: 'Free Range Farms'
  },
  {
    id: '20',
    name: 'Ground Beef',
    description: 'Lean ground beef, perfect for burgers, meatballs, or tacos.',
    price: 6.49,
    image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?q=80&w=300&auto=format&fit=crop',
    category: '10',
    rating: 4.6,
    ratingCount: 189,
    inStock: true,
    discount: 10,
    featured: false,
    weight: '400g',
    origin: 'Premium Meats'
  },
  {
    id: '21',
    name: 'Frozen Pizza',
    description: 'Restaurant-quality frozen pizza with premium toppings.',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300&auto=format&fit=crop',
    category: '11',
    rating: 4.4,
    ratingCount: 142,
    inStock: true,
    discount: 0,
    featured: false,
    weight: '400g',
    origin: 'Gourmet Frozen Foods'
  },
  {
    id: '22',
    name: 'Ice Cream',
    description: 'Creamy vanilla ice cream with real vanilla beans.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=300&auto=format&fit=crop',
    category: '11',
    rating: 4.9,
    ratingCount: 213,
    inStock: true,
    discount: 0,
    featured: true,
    volume: '500ml',
    origin: 'Artisan Creamery',
    hasOptions: true
  },
  {
    id: '23',
    name: 'Instant Noodles',
    description: 'Quick and flavorful instant noodles, ready in minutes.',
    price: 79,   // ₹79 (converted from $0.99)
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=300&auto=format&fit=crop',
    category: '12',
    rating: 4.3,
    ratingCount: 178,
    inStock: true,
    discount: 0,
    featured: false,
    weight: '85g',
    origin: 'Quick Meals Co.'
  },
  {
    id: '24',
    name: 'Microwave Rice',
    description: 'Perfectly cooked rice in just 90 seconds, no mess or fuss.',
    price: 2.49,
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=300&auto=format&fit=crop',
    category: '12',
    rating: 4.5,
    ratingCount: 156,
    inStock: true,
    discount: 5,
    featured: true,
    weight: '250g',
    origin: 'Instant Foods',
    hasOptions: true
  }
];

// Recent orders
const recentOrders = [
  {
    id: '1001',
    orderNumber: 'ORD-2023-1001',
    date: '2023-06-15T14:30:00Z',
    status: 'delivered',
    total: 35.97,
    items: [
      { id: '1', name: 'Fresh Spinach', quantity: 2, price: 1.99 },
      { id: '7', name: 'Sourdough Bread', quantity: 1, price: 4.99 },
      { id: '12', name: 'Cold Brew Coffee', quantity: 2, price: 4.49 },
      { id: '17', name: 'Granola', quantity: 1, price: 5.99 },
      { id: '22', name: 'Ice Cream', quantity: 1, price: 4.99 }
    ]
  },
  {
    id: '1002',
    orderNumber: 'ORD-2023-1002',
    date: '2023-06-10T11:15:00Z',
    status: 'delivered',
    total: 29.94,
    items: [
      { id: '3', name: 'Red Apples', quantity: 1, price: 3.99 },
      { id: '5', name: 'Whole Milk', quantity: 2, price: 2.99 },
      { id: '10', name: 'Mixed Nuts', quantity: 1, price: 7.99 },
      { id: '19', name: 'Chicken Breast', quantity: 1, price: 7.99 }
    ]
  },
  {
    id: '1003',
    orderNumber: 'ORD-2023-1003',
    date: '2023-06-05T09:45:00Z',
    status: 'delivered',
    total: 42.96,
    items: [
      { id: '6', name: 'Greek Yogurt', quantity: 2, price: 4.49 },
      { id: '9', name: 'Potato Chips', quantity: 1, price: 2.99 },
      { id: '15', name: 'Laundry Detergent', quantity: 1, price: 8.99 },
      { id: '20', name: 'Ground Beef', quantity: 2, price: 6.49 },
      { id: '24', name: 'Microwave Rice', quantity: 2, price: 2.49 }
    ]
  }
];

// API functions
export const fetchCategories = (): Promise<{ id: string; name: string; icon: string }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categories);
    }, 500);
  });
};

export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  try {
    // Use the generic POST method which automatically includes client_id
    const { post } = await import('./client');
    
    const response = await post<any>('/products', {});
    
    console.log('API Response - Featured Products:', response.length);
    
    // Handle different response formats
    let productsData: any[] = [];
    
    if (response && typeof response === 'object') {
      // Check if response has a products array
      if ('products' in response && Array.isArray(response.products)) {
        productsData = response.products;
      }
      // Check if response is directly an array
      else if (Array.isArray(response)) {
        productsData = response;
      }
      // Check if response has a data property with products
      else if ('data' in response && response.data && Array.isArray(response.data)) {
        productsData = response.data;
      }
    }
    
    if (productsData.length === 0) {
      console.warn('No products found in API response');
      return [];
    }
    
    // Transform the API response to match our Product interface
    const products = productsData.map((item: any) => ({
      id: item.id?.toString() || '',
      name: item.name || '',
      description: item.description || '',
      price: parseFloat(item.price) || 0,
      image: item.image || item.images || '',
      category: item.categories?.[0]?.id?.toString() || '',
      rating: parseFloat(item.average_rating) || 0,
      ratingCount: parseInt(item.review_count) || 0,
      inStock: item.stock_status === 'instock',
      discount: 0, // Calculate discount if available in API
      featured: true,
      weight: item.weight || '',
      origin: item.origin || '',
      hasOptions: item.has_options || false
    }));

    // Sort products: valid image URLs first, then empty image URLs
    return products.sort((a: Product, b: Product) => {
      const aHasImage = a.image && a.image.trim() !== '';
      const bHasImage = b.image && b.image.trim() !== '';
      
      if (aHasImage && !bHasImage) return -1;
      if (!aHasImage && bHasImage) return 1;
      return 0;
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    // Return empty array in case of error
    return [];
  }
};

export const fetchRecentOrders = (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(recentOrders);
    }, 600);
  });
};

// Fetch product by id from real API
export const fetchProductById = async (id: string) => {
  try {
    // Use the generic POST method which automatically includes client_id
    const { post } = await import('./client');
    
    const response = await post<any>(`/products/${id}`, {});
    
    console.log('Product details fetched successfully:', response.length);
    return response;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

// Helper function to apply client-side filters
export const applyClientSideFilters = (products: any[], filters: any = {}): any[] => {
      let filteredProducts = [...products];
      
      // Apply additional filters
      if (filters) {
        // Filter by price range - ensure this works with our Indian rupee prices
        if (filters.priceRange && Array.isArray(filters.priceRange) && filters.priceRange.length === 2) {
          const minPrice = filters.priceRange[0];
          const maxPrice = filters.priceRange[1];
          
          console.log(`Filtering products by price range: ₹${minPrice} - ₹${maxPrice}`);
          
          filteredProducts = filteredProducts.filter(p => {
            const productPrice = typeof p.price === 'number' ? p.price : 0;
            return productPrice >= minPrice && productPrice <= maxPrice;
          });
        }
        
        // Filter by in-stock status
        if (filters.inStock) {
          console.log('Filtering for in-stock products only');
          filteredProducts = filteredProducts.filter(p => p.inStock);
        }
        
        // Sort products
        if (filters.sortBy) {
          console.log(`Sorting products by: ${filters.sortBy}`);
          
          switch (filters.sortBy) {
            case 'price_low':
              filteredProducts.sort((a, b) => {
                const priceA = typeof a.price === 'number' ? a.price : 0;
                const priceB = typeof b.price === 'number' ? b.price : 0;
                return priceA - priceB;
              });
              break;
              
            case 'price_high':
              filteredProducts.sort((a, b) => {
                const priceA = typeof a.price === 'number' ? a.price : 0;
                const priceB = typeof b.price === 'number' ? b.price : 0;
                return priceB - priceA;
              });
              break;
              
            case 'newest':
              // In a real app, we would sort by date added
              // Here we'll just reverse the array as a placeholder
              filteredProducts.reverse();
              break;
              
            case 'popularity':
            default:
              filteredProducts.sort((a, b) => {
                const ratingA = typeof a.rating === 'number' ? a.rating : 0;
                const ratingB = typeof b.rating === 'number' ? b.rating : 0;
                return ratingB - ratingA;
              });
              break;
          }
        }
      }
  
  return filteredProducts;
};

export const searchProducts = (query = '', categoryId: string | null = null, filters: any = {}): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredProducts = [...products];
      
      // Filter by category if specified
      if (categoryId) {
        filteredProducts = filteredProducts.filter(p => p.category === categoryId);
      }
      
      // Filter by search query if provided
      if (query) {
        const lowerQuery = query.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(lowerQuery) || 
          p.description.toLowerCase().includes(lowerQuery)
        );
      }
      
      // Apply additional filters using the helper function
      filteredProducts = applyClientSideFilters(filteredProducts, filters);
      
      console.log(`Search returned ${filteredProducts.length} products`);
      resolve(filteredProducts);
    }, 1000);
  });
};

// Fetch products by category slug from real API
export interface ProductApiResponse {
  count: number;      // Total count of all products (not just the paginated results)
  products: any[];    // The paginated products array
  hasMore: boolean;   // Whether there are more products to load
  nextOffset: number; // The next offset to use for pagination
  [key: string]: any;
}

export interface PaginationOptions {
  offset?: number;
  limit?: number;
}

export const fetchProductsByCategorySlug = async (
  slug: string, 
  { offset = 0, limit = 30 }: PaginationOptions = {},
  filters: any = {}
): Promise<ProductApiResponse> => {
  try {
    if (!slug) {
      console.warn('Cannot fetch products: No slug provided');
      return { count: 0, products: [], hasMore: false, nextOffset: 0 };
    }
    
    // Build query parameters including filters
    const queryParams = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString()
    });
    
    // Add filter parameters to the query
    if (filters.priceRange && Array.isArray(filters.priceRange) && filters.priceRange.length === 2) {
      queryParams.append('min_price', filters.priceRange[0].toString());
      queryParams.append('max_price', filters.priceRange[1].toString());
    }
    
    if (filters.inStock) {
      queryParams.append('in_stock', 'true');
    }
    
    if (filters.sortBy) {
      queryParams.append('sort_by', filters.sortBy);
    }
    
    // Make API call to categories/[slug] endpoint with pagination and filter parameters
    // Use POST method since the API now expects POST with client_id in body
    const { post } = await import('./client');
    
    // Prepare the request body with filters and pagination
    const requestBody = {
      slug: slug,
      offset: offset,
      limit: limit,
      ...filters
    };
    
    const response = await post<any>(`/categories/${slug}`, requestBody);
    
    console.log(`Fetching products for category ${slug} with offset=${offset}, limit=${limit}, filters=${JSON.stringify(filters)}`);
    
    console.log(`Fetched products for category slug: ${slug}`);
    
    // Handle different response formats
    if (response && typeof response === 'object') {
      // Response has products array and count
      if ('products' in response && Array.isArray(response.products)) {
        let products = response.products;
        
        // Apply client-side filters if the API doesn't handle them
        products = applyClientSideFilters(products, filters);
        
        const productCount = products.length;
        console.log(`Found ${productCount} products in category ${slug} after filtering`);
        
        // Calculate if there are more items to load
        const hasMore = productCount > offset + products.length;
        return {
          count: productCount,
          products: products,
          hasMore,
          nextOffset: hasMore ? offset + limit : offset
        };
      }
      // Response already has the expected format with count field
      else if ('count' in response && 'products' in response) {
        let products = response.products;
        
        // Apply client-side filters if the API doesn't handle them
        products = applyClientSideFilters(products, filters);
        
        return {
          ...response,
          products: products
        } as ProductApiResponse;
      }
      // Response is directly an array of products
      else if (Array.isArray(response)) {
        let products = response;
        
        // Apply client-side filters if the API doesn't handle them
        products = applyClientSideFilters(products, filters);
        
        const productCount = products.length;
        console.log(`Found ${productCount} products in array format for category ${slug} after filtering`);
        
        // Calculate if there are more items to load
        const hasMore = productCount > offset + products.length;
        return {
          count: productCount,
          products: products,
          hasMore,
          nextOffset: hasMore ? offset + limit : offset
        };
      }
    }
    
    // If we reach here, the response format wasn't recognized
    console.warn('Unrecognized product response format:', response);
    return { count: 0, products: [], hasMore: false, nextOffset: 0 };
  } catch (error) {
    console.error(`Error fetching products for category ${slug}:`, error);
    // Return empty response on error
    return { count: 0, products: [], hasMore: false, nextOffset: 0 };
  }
};



// Get products by category
export const fetchProductsByCategory = (categoryId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categoryProducts = products.filter(product => product.category === categoryId);
      resolve(categoryProducts);
    }, 800);
  });
};

// Get trending products
export const fetchTrendingProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo purposes, we'll consider products with highest ratings as trending
      const trending = [...products]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);
      resolve(trending);
    }, 800);
  });
};

// Get discounted products
export const fetchDiscountedProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const discounted = products.filter(product => product.discount > 0);
      resolve(discounted);
    }, 800);
  });
};

// Fetch products by brand with filters support
export const fetchProductsByBrand = async (
  brandSlug: string,
  { offset = 0, limit = 30 }: PaginationOptions = {},
  filters: any = {}
): Promise<ProductApiResponse> => {
  try {
    if (!brandSlug) {
      console.warn('Cannot fetch products: No brand slug provided');
      return { count: 0, products: [], hasMore: false, nextOffset: 0 };
    }
    
    // Build query parameters including filters
    const queryParams = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString()
    });
    
    // Add filter parameters to the query
    if (filters.priceRange && Array.isArray(filters.priceRange) && filters.priceRange.length === 2) {
      queryParams.append('min_price', filters.priceRange[0].toString());
      queryParams.append('max_price', filters.priceRange[1].toString());
    }
    
    if (filters.inStock) {
      queryParams.append('in_stock', 'true');
    }
    
    if (filters.sortBy) {
      queryParams.append('sort_by', filters.sortBy);
    }
    
    // Make API call to brands/[slug] endpoint with pagination and filter parameters
    // Use POST method since the API now expects POST with client_id in body
    const { post } = await import('./client');
    
    // Prepare the request body with filters and pagination
    const requestBody = {
      slug: brandSlug,
      offset: offset,
      limit: limit,
      ...filters
    };
    
    const response = await post<any>(`/brands/${brandSlug}`, requestBody);
    
    console.log(`Fetching products for brand ${brandSlug} with offset=${offset}, limit=${limit}, filters=${JSON.stringify(filters)}`);
    
    // Handle different response formats
    if (response && typeof response === 'object') {
      // Response has products array and count
      if ('products' in response && Array.isArray(response.products)) {
        let products = response.products;
        
        // Apply client-side filters if the API doesn't handle them
        products = applyClientSideFilters(products, filters);
        
        const productCount = products.length;
        console.log(`Found ${productCount} products for brand ${brandSlug} after filtering`);
        
        // Calculate if there are more items to load
        const hasMore = productCount > offset + products.length;
        return {
          count: productCount,
          products: products,
          hasMore,
          nextOffset: hasMore ? offset + limit : offset
        };
      }
      // Response already has the expected format with count field
      else if ('count' in response && 'products' in response) {
        let products = response.products;
        
        // Apply client-side filters if the API doesn't handle them
        products = applyClientSideFilters(products, filters);
        
        return {
          ...response,
          products: products
        } as ProductApiResponse;
      }
      // Response is directly an array of products
      else if (Array.isArray(response)) {
        let products = response;
        
        // Apply client-side filters if the API doesn't handle them
        products = applyClientSideFilters(products, filters);
        
        const productCount = products.length;
        console.log(`Found ${productCount} products in array format for brand ${brandSlug} after filtering`);
        
        // Calculate if there are more items to load
        const hasMore = productCount > offset + products.length;
        return {
          count: productCount,
          products: products,
          hasMore,
          nextOffset: hasMore ? offset + limit : offset
        };
      }
    }
    
    // If we reach here, the response format wasn't recognized
    console.warn('Unrecognized product response format for brand:', response);
    return { count: 0, products: [], hasMore: false, nextOffset: 0 };
  } catch (error) {
    console.error(`Error fetching products for brand ${brandSlug}:`, error);
    // Return empty response on error
    return { count: 0, products: [], hasMore: false, nextOffset: 0 };
  }
};