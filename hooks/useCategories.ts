import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/api/categories';
import { Category } from '@/models/category';

// React Query key for categories
export const categoriesQueryKey = ['categories'];

// Fallback categories in case the API fails
const fallbackCategories: Category[] = [
  { id: '1', name: 'Ayurvedic Medicines', icon: '🌿', slug: 'ayurvedic-medicines', image: '', description: 'Traditional herbal medicines' },
  { id: '2', name: 'Herbs & Botanicals', icon: '🍃', slug: 'herbs-botanicals', image: '', description: 'Natural herbs and plant extracts' },
  { id: '3', name: 'Wellness Products', icon: '🧘', slug: 'wellness', image: '', description: 'Products for overall wellness' },
  { id: '4', name: 'Supplements', icon: '💊', slug: 'supplements', image: '', description: 'Dietary supplements and vitamins' },
  { id: '5', name: 'Natural Remedies', icon: '🍵', slug: 'natural-remedies', image: '', description: 'Natural solutions for common ailments' },
  { id: '6', name: 'Personal Care', icon: '🧴', slug: 'personal-care', image: '', description: 'Natural personal care products' },
];

// Enhanced categories fetcher with fallback
const fetchCategoriesWithFallback = async (): Promise<Category[]> => {
  try {
    // First attempt to get data from API
    const categories = await fetchCategories();
    
    // If we get an empty array, fall back to mock data
    if (categories.length === 0) {
      console.log('API returned empty categories, using fallback data');
      return fallbackCategories;
    }
    
    return categories;
  } catch (error) {
    console.log('Error fetching categories, using fallback data:', error);
    return fallbackCategories;
  }
};

/**
 * Custom hook for fetching categories using React Query
 * with fallback to mock data if the API fails
 * 
 * @returns The query result containing categories data, loading state, and errors
 */
export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: categoriesQueryKey,
    queryFn: fetchCategoriesWithFallback,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    // Provide fallback data immediately while loading
    placeholderData: fallbackCategories,
  });
}
