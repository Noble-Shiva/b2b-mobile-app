import { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView, Dimensions, Image } from 'react-native';
import { LegendList } from '@legendapp/list';
import { Text } from '@/components/ui';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Search as SearchIcon, X, SlidersHorizontal, ChevronDown, ChevronRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  runOnJS,
  interpolateColor,
  FadeInDown 
} from 'react-native-reanimated';
import { searchProducts, fetchProductsByCategorySlug, fetchProductsByBrand, ProductApiResponse, PaginationOptions } from '@/api/products';
import { fetchCategories } from '@/api/categories';
import ProductCard from '@/components/search/ProductCard';
import FilterModal from '@/components/search/FilterModal';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';

import { selectIsDark } from '@/store/themeSlice';
import ProductSkeleton from '@/components/skeletons/ProductSkeleton';
import { Category, ApiCategory } from '@/models/category';
import {
  selectSearchFilters,
  selectSearchHistory,
  setFilters,
  addToHistory,
} from '@/store/searchSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { colors } from '@/utils/theme';

// Get screen width to calculate sidebar width (20% of screen)
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.2; // 20% of screen width

interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  brand_logo: string | null;
}

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string; brand?: string }>();
  const isDark = useSelector(selectIsDark);
  const searchHistory = useSelector(selectSearchHistory);
  const filters = useSelector(selectSearchFilters);
  const dispatch = useDispatch();

  // Pagination state
  const [paginationParams, setPaginationParams] = useState<PaginationOptions>({
    offset: 0,
    limit: 30
  });

  // State to track all loaded products
  const [allLoadedProducts, setAllLoadedProducts] = useState<any[]>([]);

  // Track if we're loading more products
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(typeof params.category === 'string' ? params.category : null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(typeof params.brand === 'string' ? params.brand : null);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [hasFiltersApplied, setHasFiltersApplied] = useState<boolean>(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Animation values for category selection
  const selectedIndicatorY = useSharedValue(0);
  const selectedIndicatorOpacity = useSharedValue(0);
  const [categoryItemHeights, setCategoryItemHeights] = useState<{ [key: string]: { y: number; height: number } }>({});

  // Animated style for selection indicator
  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: selectedIndicatorY.value }],
      opacity: selectedIndicatorOpacity.value,
    };
  });

  // Define a type that includes the API response structure
  type CategoryWithProducts = Category & {
    term_id?: number;
    imageUrl?: string;
    product?: any[];
  };

  // Categories from API with enhanced error handling
  const {
    data: categories = [] as CategoryWithProducts[],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery<CategoryWithProducts[]>({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(true), // Only fetch categories with products
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Brands from API
  const {
    data: brands = [] as Brand[],
    isLoading: isBrandsLoading,
    isError: isBrandsError,
  } = useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await axios.get('https://b2b.ayurcentralonline.com/wp-json/b2b/v1/brands');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Handle navigation param changes
  useEffect(() => {
    // Reset products and pagination when switching between brands and categories
    setAllLoadedProducts([]);
    setPaginationParams({
      offset: 0,
      limit: 30
    });

    // Reset filters applied flag and applied filters when switching categories/brands
    setHasFiltersApplied(false);
    setAppliedFilters({});
    
    // Also reset filters in Redux to clear selectedItems
    dispatch(setFilters({
      priceRange: [0, 5000] as [number, number],
      sortBy: 'popularity',
      inStock: true,
      selectedItems: [] as string[],
    }));

    // Update selected states based on URL params
    if (params.category) {
      setSelectedCategory(params.category);
      setSelectedBrand(null);
    } else if (params.brand) {
      setSelectedBrand(params.brand);
      setSelectedCategory(null);
    } else {
      // Clear both if no params
      setSelectedCategory(null);
      setSelectedBrand(null);
    }

    // Clear search when params change
    setSearchQuery('');
    
    console.log('Navigation changed - filters reset');
  }, [params.category, params.brand]);

  // Note: No need to reset products when filters change since we're doing client-side filtering
  // The applyClientSideFilters function will handle filtering automatically

  // Query for products from the selected category or brand with pagination (no filters applied to API)
  const {
    data: productsData,
    isLoading: isProductsDataLoading,
    isError: isProductsDataError,
    refetch: refetchProductsData,
    isFetching: isProductsDataFetching
  } = useQuery<ProductApiResponse>({
    queryKey: ['products', selectedCategory, selectedBrand, paginationParams],
    queryFn: async () => {
      // TODO: Implement server-side filtering by passing filters to API
      // For now, we fetch all products and filter client-side
      
      if (selectedCategory) {
        // Find the selected category and get its slug
        const category = categories.find((cat: CategoryWithProducts) => {
          const catId = cat.id?.toString() || '';
          const termId = cat.term_id?.toString() || '';
          return catId === selectedCategory || termId === selectedCategory;
        });
        
        if (category && category.slug) {
          // TODO: Add filter parameters to API call when implementing server-side filtering
          return await fetchProductsByCategorySlug(category.slug, paginationParams);
        }
      } else if (selectedBrand) {
        try {
          console.log('Fetching products for brand:', selectedBrand);
          // TODO: Add filter parameters to API call when implementing server-side filtering
          // For now using the axios call directly since fetchProductsByBrand expects 3 params
          const response = await axios.get(
            `https://b2b.ayurcentralonline.com/wp-json/b2b/v1/brands/${selectedBrand}`,
            {
              params: {
                offset: paginationParams.offset || 0,
                limit: paginationParams.limit || 30
              }
            }
          );

          // Transform the response to match the ProductApiResponse type
          return {
            count: response.data.count || 0,
            products: response.data.products || [],
            hasMore: response.data.hasMore || false,
            nextOffset: (paginationParams.offset || 0) + (paginationParams.limit || 30)
          };
        } catch (error) {
          console.error('Error fetching brand products:', error);
          throw error;
        }
      }
      
      // Return empty result if no category or brand
      return { 
        count: 0, 
        products: [], 
        hasMore: false,
        nextOffset: 0 
      };
    },
    enabled: (!!selectedCategory || !!selectedBrand) && !searchQuery, // Only fetch when a category or brand is selected and no search
    staleTime: 2 * 60 * 1000 // 2 minutes cache
  });

  // Handle query success and update the all loaded products state
  useEffect(() => {
    if (productsData) {
      if (paginationParams.offset === 0) {
        // Reset products list when it's a fresh fetch (offset 0) or refresh
        console.log('Resetting products list with new data:', productsData.products.length, 'products');
        setAllLoadedProducts(productsData.products);
      } else {
        // Append new products to existing list when paginating
        console.log('Appending', productsData.products.length, 'more products');
        setAllLoadedProducts(prev => [...prev, ...productsData.products]);
      }
      setIsLoadingMore(false);
    }
  }, [productsData, paginationParams.offset]);

  // Products from search API (no filters applied to API)
  const {
    data: searchResults = [],
    isLoading: isSearchLoading,
    isError: isSearchError,
    refetch: refetchSearch,
  } = useQuery<any[]>({
    queryKey: ['searchProducts', searchQuery],
    queryFn: () => {
      // TODO: Implement server-side filtering by passing filters to search API
      // For now, we fetch all search results and filter client-side
      return searchProducts(searchQuery, selectedCategory, {});
    },
    enabled: !!searchQuery, // Only run search if there's a query
  });

  // Combined loading and error states
  const isProductsLoading = searchQuery ? isSearchLoading : isProductsDataLoading;
  const isProductsError = searchQuery ? isSearchError : isProductsDataError;

  // Client-side filtering function
  const applyClientSideFilters = (productsToFilter: any[]) => {
    if (!hasFiltersApplied || !productsToFilter || productsToFilter.length === 0) {
      return productsToFilter;
    }

    let filteredProducts = [...productsToFilter];

    // Apply only the changed filters
    const changedFilters = appliedFilters;

    // Filter by price range if changed
    if (changedFilters.priceRange && Array.isArray(changedFilters.priceRange) && changedFilters.priceRange.length === 2) {
      const [minPrice, maxPrice] = changedFilters.priceRange;
      console.log(`Client-side filtering by price range: ₹${minPrice} - ₹${maxPrice}`);
      
      filteredProducts = filteredProducts.filter(product => {
        const productPrice = typeof product.price === 'number' ? product.price : 0;
        return productPrice >= minPrice && productPrice <= maxPrice;
      });
    }

    // Filter by stock status if changed
    if (changedFilters.inStock !== undefined) {
      console.log(`Client-side filtering for in-stock: ${changedFilters.inStock}`);
      if (changedFilters.inStock) {
        filteredProducts = filteredProducts.filter(product => product.inStock);
      }
    }

    // Filter by selected items (brand, type, category, properties) if changed
    if (changedFilters.selectedItems && Array.isArray(changedFilters.selectedItems) && changedFilters.selectedItems.length > 0) {
      console.log(`Client-side filtering by selected items:`, changedFilters.selectedItems);
      
      filteredProducts = filteredProducts.filter(product => {
        // For demo purposes, we'll match against product properties
        // In a real app, you'd match against actual product data
        const productBrand = product.brand?.toLowerCase() || '';
        const productCategory = product.category?.toLowerCase() || '';
        const productType = product.type?.toLowerCase() || '';
        const productTags = product.tags || [];
        
        return changedFilters.selectedItems.some((selectedItem: string) => {
          // Convert selectedItem to match against product properties
          const itemLower = selectedItem.toLowerCase();
          
          // Check if the selected item matches any product property
          return productBrand.includes(itemLower) ||
                 productCategory.includes(itemLower) ||
                 productType.includes(itemLower) ||
                 productTags.some((tag: string) => tag.toLowerCase().includes(itemLower));
        });
      });
    }

    // Sort products if changed
    if (changedFilters.sortBy) {
      console.log(`Client-side sorting by: ${changedFilters.sortBy}`);
      
      switch (changedFilters.sortBy) {
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

    console.log(`Client-side filtering resulted in ${filteredProducts.length} products`);
    return filteredProducts;
  };

  // Products to display - either from search or from our accumulated list, with client-side filtering
  const rawProducts = searchQuery ? searchResults : allLoadedProducts;
  const filteredProducts = applyClientSideFilters(rawProducts);
  
  // Insert brands section after 4-6 products based on total count
  const shouldShowBrandsSection = !searchQuery && (selectedCategory || selectedBrand) && filteredProducts.length > 0;
  const brandsInsertPosition = filteredProducts.length >= 6 ? 6 : Math.min(4, filteredProducts.length);

  // Define filter categories to show in sections
  const filterCategories = [
    {
      id: 'brand',
      name: 'Filter by Brand',
      items: [
        { id: 'organic-india', name: 'Organic India', icon: '🌿' },
        { id: 'patanjali', name: 'Patanjali', icon: '🕉️' },
        { id: 'himalaya', name: 'Himalaya', icon: '🏔️' },
        { id: 'baidyanath', name: 'Baidyanath', icon: '⚕️' },
        { id: 'dabur', name: 'Dabur', icon: '🌱' },
      ]
    },
    {
      id: 'type',
      name: 'Filter by Type',
      items: [
        { id: 'tablets', name: 'Tablets', icon: '💊' },
        { id: 'powder', name: 'Powder', icon: '🥄' },
        { id: 'oil', name: 'Oil', icon: '🫒' },
        { id: 'syrup', name: 'Syrup', icon: '🍯' },
        { id: 'capsules', name: 'Capsules', icon: '💊' },
      ]
    },
    {
      id: 'category',
      name: 'Filter by Category',
      items: [
        { id: 'immunity', name: 'Immunity', icon: '🛡️' },
        { id: 'digestive', name: 'Digestive', icon: '🫃' },
        { id: 'skin-care', name: 'Skin Care', icon: '✨' },
        { id: 'hair-care', name: 'Hair Care', icon: '💇' },
        { id: 'pain-relief', name: 'Pain Relief', icon: '🩹' },
      ]
    },
    {
      id: 'properties',
      name: 'Filter by Properties',
      items: [
        { id: 'organic', name: 'Organic', icon: '🌱' },
        { id: 'natural', name: 'Natural', icon: '🍃' },
        { id: 'herbal', name: 'Herbal', icon: '🌿' },
        { id: 'ayurvedic', name: 'Ayurvedic', icon: '🕉️' },
        { id: 'vegan', name: 'Vegan', icon: '🥬' },
      ]
    },
  ];

  // Insert both brands section and filter sections
  let productsWithSections = [...filteredProducts];
  
  if (shouldShowBrandsSection) {
    // Insert brands section
    productsWithSections = [
      ...filteredProducts.slice(0, brandsInsertPosition),
      { id: 'brands-section', type: 'brands-section' },
      { id: 'brands-spacer', type: 'brands-spacer' },
      ...filteredProducts.slice(brandsInsertPosition)
    ];

    // Insert filter sections after first 10 cards, then every 4 cards
    let insertPosition = 10; // After first 10 cards
    let filterIndex = 0;
    
    while (insertPosition < productsWithSections.length && filterIndex < filterCategories.length) {
      const filterCategory = filterCategories[filterIndex];
      
      // Insert filter section and spacer
      productsWithSections.splice(insertPosition, 0, 
        { id: `filter-section-${filterCategory.id}`, type: 'filter-section', filterCategory },
        { id: `filter-spacer-${filterCategory.id}`, type: 'filter-spacer' }
      );
      
      insertPosition += 4 + 2; // Move 4 cards ahead + 2 for the section items we just added
      filterIndex++;
    }
  }
  
  const products = productsWithSections;

  // Check if we have more products to load
  const hasMoreProducts = !searchQuery && 
    productsData ? productsData.hasMore === true : false;

  // For demo: if history is empty, add a sample search term
  useEffect(() => {
    if (searchHistory.length === 0) {
      dispatch(addToHistory('Sample Search'));
    }
  }, [searchHistory, dispatch]);

  // Initialize animation for already selected category/brand
  useEffect(() => {
    if ((selectedCategory || selectedBrand) && Object.keys(categoryItemHeights).length > 0) {
      const key = selectedCategory || selectedBrand;
      const position = categoryItemHeights[key!];
      if (position && selectedIndicatorOpacity.value === 0) {
        console.log('Initializing indicator at position:', position.y);
        selectedIndicatorY.value = position.y;
        selectedIndicatorOpacity.value = withDelay(100, withSpring(1, {
          damping: 15,
          stiffness: 200,
        }));
      }
    }
  }, [selectedCategory, selectedBrand, categoryItemHeights]);
  
  // Auto-select first category/brand when data is loaded
  useEffect(() => {
    if (!selectedCategory && !selectedBrand && !searchQuery) {
      if (params.category && categories.length > 0) {
        const firstCategory = categories[0];
        if (firstCategory) {
          const categoryId = firstCategory.id?.toString() || firstCategory.term_id?.toString() || '';
          if (categoryId) {
            setSelectedCategory(categoryId);
          }
        }
      } else if (params.brand && brands.length > 0) {
        const firstBrand = brands[0];
        if (firstBrand) {
          setSelectedBrand(firstBrand.slug);
        }
      }
    }
  }, [categories, brands, selectedCategory, selectedBrand, searchQuery, params]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    refetchProductsData();
  };

  const clearSearch = () => {
    setSearchQuery('');
    refetchProductsData();
  };

  const refetchProducts = async () => {
    console.log('Refetching products...');
    setIsRefreshing(true);
    
    // Reset pagination when manually refreshing
    setPaginationParams({
      offset: 0,
      limit: 30
    });

    // Don't clear loaded products immediately to avoid blank screen
    // Let the useEffect that handles productsData changes replace the products
    // setAllLoadedProducts([]);

    try {
      if (searchQuery) {
        await refetchSearch();
      } else {
        await refetchProductsData();
      }
    } catch (error) {
      console.error('Error refreshing products:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Function to load more products
  const loadMoreProducts = () => {
    if (hasMoreProducts && !isLoadingMore && !isProductsDataFetching) {
      console.log('Loading more products...');
      setIsLoadingMore(true);

      // Update pagination parameters to fetch next page
      setPaginationParams(prev => ({
        offset: productsData && 'nextOffset' in productsData ? 
          productsData.nextOffset : 
          (prev.offset || 0) + (prev.limit || 30),
        limit: prev.limit || 30
      }));
    }
  };

  // Handle scroll event to implement infinite scrolling
  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20; // How far from the bottom to trigger loading more

    // Check if the user has scrolled to the bottom
    if (layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom) {
      loadMoreProducts();
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    // Don't toggle - keep category selected when clicked again for better UX
    // Only change selection if it's a different category
    if (categoryId !== selectedCategory) {
      setSelectedCategory(categoryId);
      setSelectedBrand(null); // Clear brand selection when selecting category
      setSearchQuery(''); // Clear search when switching categories

      // Animate selection indicator to new position with delay
      const categoryPosition = categoryItemHeights[categoryId];
      if (categoryPosition) {
        console.log('Animating to category position:', categoryPosition.y);
        selectedIndicatorY.value = withDelay(150, withSpring(categoryPosition.y, {
          damping: 20,
          stiffness: 300,
          mass: 0.5,
        }));
        selectedIndicatorOpacity.value = withDelay(100, withSpring(1, {
          damping: 15,
          stiffness: 200,
        }));
      } else {
        console.log('Category position not found for:', categoryId);
      }

      // Log selected category for debugging
      const selectedCat = categories.find(cat =>
        String(cat.id) === categoryId || String(cat.term_id) === categoryId
      );
      if (selectedCat) {
        console.log(`Selected category: ${selectedCat.name} (${selectedCat.slug || 'no slug'})`);
      }
    }
    // If same category is clicked again, do nothing (keep it selected)
  };

  const handleBrandSelect = (brandSlug: string) => {
    // Don't toggle - keep brand selected when clicked again for better UX
    // Only change selection if it's a different brand
    if (brandSlug !== selectedBrand) {
      setSelectedBrand(brandSlug);
      setSelectedCategory(null); // Clear category selection when selecting brand
      setSearchQuery(''); // Clear search when switching brands

      // Animate selection indicator to new position with delay
      const brandPosition = categoryItemHeights[brandSlug];
      if (brandPosition) {
        selectedIndicatorY.value = withDelay(150, withSpring(brandPosition.y, {
          damping: 20,
          stiffness: 300,
          mass: 0.5,
        }));
        selectedIndicatorOpacity.value = withDelay(100, withSpring(1, {
          damping: 15,
          stiffness: 200,
        }));
      }

      // Log selected brand for debugging
      const selectedBr = brands.find(b => b.slug === brandSlug);
      if (selectedBr) {
        console.log(`Selected brand: ${selectedBr.name} (${selectedBr.slug})`);
      }
    }
    // If same brand is clicked again, do nothing (keep it selected)
  };

  const handleFilterItemSelect = (itemId: string, categoryId: string) => {
    // Get current selected items
    const currentSelectedItems = filters.selectedItems || [];
    
    // Toggle the item: if already selected, remove it, otherwise add it
    let newSelectedItems: string[];
    if (currentSelectedItems.includes(itemId)) {
      newSelectedItems = currentSelectedItems.filter(id => id !== itemId);
    } else {
      newSelectedItems = [...currentSelectedItems, itemId];
    }

    // Apply the updated filters
    const newFilters = {
      ...filters,
      selectedItems: newSelectedItems,
    };

    // Use the existing applyFilters function to handle the filtering
    applyFilters(newFilters);
    
    console.log(`Filter item ${itemId} from category ${categoryId} toggled. Selected items:`, newSelectedItems);
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const applyFilters = (newFilters: any) => {
    // Only track filters that have actually changed from their default values
    const defaultFilters = {
      priceRange: [0, 5000] as [number, number],
      sortBy: 'popularity',
      inStock: true,
      selectedItems: [] as string[],
    };

    const changedFilters: any = {};
    
    // Check which filters have changed from defaults
    if (JSON.stringify(newFilters.priceRange) !== JSON.stringify(defaultFilters.priceRange)) {
      changedFilters.priceRange = newFilters.priceRange;
      console.log('Price range filter changed:', newFilters.priceRange);
    }
    
    if (newFilters.sortBy !== defaultFilters.sortBy) {
      changedFilters.sortBy = newFilters.sortBy;
      console.log('Sort filter changed:', newFilters.sortBy);
    }
    
    if (newFilters.inStock !== defaultFilters.inStock) {
      changedFilters.inStock = newFilters.inStock;
      console.log('Stock filter changed:', newFilters.inStock);
    }

    // Check if selectedItems have changed
    const selectedItems = newFilters.selectedItems || [];
    if (selectedItems.length > 0) {
      changedFilters.selectedItems = selectedItems;
      console.log('Selected items filter changed:', selectedItems);
    }

    dispatch(setFilters(newFilters));
    setShowFilterModal(false);
    
    // Only mark as applied if there are actually changed filters (including selectedItems)
    const hasChanges = Object.keys(changedFilters).length > 0;
    setHasFiltersApplied(hasChanges);
    setAppliedFilters(changedFilters);
    
    console.log('Applied filters:', changedFilters);
    console.log('Has filters applied:', hasChanges);
    
    // No need to reset pagination or refetch since we're doing client-side filtering
    // The products will be filtered automatically through the applyClientSideFilters function
  };

  const handleAddToCart = (product: any) => {
    dispatch(addToCart(product));
  };

  const clearFilters = () => {
    // Reset filters to default values
    const defaultFilters = {
      priceRange: [0, 5000] as [number, number],
      sortBy: 'popularity',
      inStock: true,
      selectedItems: [] as string[],
    };
    
    dispatch(setFilters(defaultFilters));
    setHasFiltersApplied(false);
    setAppliedFilters({});
    
    console.log('Filters cleared - showing all products');
    
    // No need to reset pagination or refetch since we're doing client-side filtering
    // The products will be shown unfiltered automatically
  };

  // Determine which items to show in sidebar based on URL params
  const showBrands = params.brand !== undefined;
  const sidebarItems = showBrands ? brands : categories;

  // Filter options for the horizontal scrollable header
  const filterOptions = [
    { id: 'filters', label: 'Filters', hasDropdown: true },
    { id: 'sort', label: 'Sort', hasDropdown: true },
    { id: 'brand', label: 'Brand', hasDropdown: true },
    { id: 'category', label: showBrands ? 'Category' : 'Type', hasDropdown: true },
    { id: 'price', label: 'Price', hasDropdown: true },
    { id: 'rating', label: 'Rating', hasDropdown: true },
  ];

  const handleFilterOptionPress = (optionId: string) => {
    switch (optionId) {
      case 'filters':
        setShowFilterModal(true);
        break;
      case 'sort':
        // TODO: Implement sort dropdown
        console.log('Sort pressed');
        break;
      case 'brand':
        // TODO: Implement brand dropdown
        console.log('Brand pressed');
        break;
      case 'category':
        // TODO: Implement category/type dropdown
        console.log('Category/Type pressed');
        break;
      case 'price':
        // TODO: Implement price dropdown
        console.log('Price pressed');
        break;
      case 'rating':
        // TODO: Implement rating dropdown
        console.log('Rating pressed');
        break;
      default:
        break;
    }
  };

  // Skeleton loader for filter options
  const FilterOptionSkeleton = () => (
    <View style={[
      styles.filterOption,
      styles.filterOptionSkeleton,
      { 
        backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0',
        borderColor: isDark ? '#404040' : '#E0E0E0'
      }
    ]}>
      <View style={[
        styles.skeletonText,
        { backgroundColor: isDark ? '#404040' : '#E0E0E0' }
      ]} />
    </View>
  );

  // Helper function to check if a filter category has selected items
  const hasSelectedItemsForCategory = (categoryType: string) => {
    const selectedItems = filters.selectedItems || [];
    if (selectedItems.length === 0) return false;
    
    // Import filter categories from FilterModal or define them here
    const categoryMappings: { [key: string]: string[] } = {
      'brand': ['organic-india', 'patanjali', 'himalaya', 'baidyanath', 'dabur'],
      'category': ['immunity', 'digestive', 'skin-care', 'hair-care', 'pain-relief'],
      'type': ['tablets', 'powder', 'oil', 'syrup', 'capsules'],
      'properties': ['organic', 'natural', 'herbal', 'ayurvedic', 'vegan'],
    };
    
    const categoryItems = categoryMappings[categoryType] || [];
    return selectedItems.some(item => categoryItems.includes(item));
  };

  // Get count of selected items for a categoryr
  const getSelectedItemsCount = (categoryType: string) => {
    const selectedItems = filters.selectedItems || [];
    if (selectedItems.length === 0) return 0;
    
    const categoryMappings: { [key: string]: string[] } = {
      'brand': ['organic-india', 'patanjali', 'himalaya', 'baidyanath', 'dabur'],
      'category': ['immunity', 'digestive', 'skin-care', 'hair-care', 'pain-relief'],
      'type': ['tablets', 'powder', 'oil', 'syrup', 'capsules'],
      'properties': ['organic', 'natural', 'herbal', 'ayurvedic', 'vegan'],
    };
    
    const categoryItems = categoryMappings[categoryType] || [];
    return selectedItems.filter(item => categoryItems.includes(item)).length;
  };

  // Filter option component
  const FilterOption = ({ option }: { option: typeof filterOptions[0] }) => {
    let isActive = false;
    let selectedCount = 0;
    
    // Check if this filter option should be active
    if (option.id === 'filters') {
      isActive = hasFiltersApplied;
    } else {
      // Map filter option IDs to category types
      const categoryMap: { [key: string]: string } = {
        'brand': 'brand',
        'category': 'category',
        'type': 'type',
        'rating': 'properties', // Assuming rating maps to properties for demo
        'price': 'properties', // Price doesn't map to selectedItems, handle separately
      };
      
      const categoryType = categoryMap[option.id];
      if (categoryType) {
        isActive = hasSelectedItemsForCategory(categoryType);
        selectedCount = getSelectedItemsCount(categoryType);
      }
    }
    
    return (
      <TouchableOpacity
        style={[
          styles.filterOption,
          { 
            backgroundColor: isActive 
              ? (isDark ? colors.primary[800] : colors.primary[50])
              : (isDark ? '#2A2A2A' : '#F5F5F5'),
            borderColor: isActive 
              ? colors.primary[600]
              : (isDark ? '#404040' : '#E0E0E0')
          }
        ]}
        onPress={() => handleFilterOptionPress(option.id)}
      >
        <Text 
          variant="body-sm" 
          weight="medium"
          style={{
            ...styles.filterOptionText,
            color: isActive 
              ? colors.primary[600]
              : (isDark ? '#FFFFFF' : '#374151')
          }}
        >
          {option.label}
          {isActive && (
            option.id === 'filters' && hasFiltersApplied 
              ? ' •'
              : selectedCount > 0 
                ? ` (${selectedCount})`
                : ' •'
          )}
        </Text>
        {option.hasDropdown && (
          <ChevronDown 
            size={14} 
            color={isActive 
              ? colors.primary[600] 
              : (isDark ? '#BBBBBB' : '#6B7280')
            } 
            style={styles.dropdownIcon}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={[
        styles.header,
        {
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderBottomColor: isDark ? '#333333' : '#EEEEEE'
        }
      ]}>
        <TouchableOpacity
          style={[
            styles.searchContainer,
            { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }
          ]}
          onPress={() => router.push('/search-screen')}
        >
          <SearchIcon size={20} color={isDark ? '#BBBBBB' : '#666666'} />
          <Text 
            style={{
              ...styles.searchPlaceholder,
              color: isDark ? '#BBBBBB' : '#666666'
            }}
          >
            Search for products...
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }
          ]}
          onPress={() => setShowFilterModal(true)}
        >
          <SlidersHorizontal size={20} color={isDark ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {/* Categories/Brands Sidebar - 20% width */}
        <View style={[
          styles.categoriesSidebar,
          {
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
            borderRightColor: isDark ? '#333333' : '#EEEEEE',
            width: SIDEBAR_WIDTH,
          }
        ]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Animated Selection Indicator - Inside ScrollView */}
            <Animated.View
              style={[
                styles.selectionIndicator,
                {
                  backgroundColor: colors.primary[600],
                },
                animatedIndicatorStyle,
              ]}
            />
            {showBrands ? (
              // Brands loading state
              isBrandsLoading ? (
                <ActivityIndicator size="small" color={colors.primary[600]} />
              ) : isBrandsError ? (
                <Text variant="body" style={{ color: '#D32F2F' }}>Failed to load brands.</Text>
              ) : (
                // Brands list
                brands.map((brand: Brand) => {
                  const isSelected = selectedBrand === brand.slug;
                  
                  return (
                    <TouchableOpacity
                      key={brand.id}
                      style={[
                        styles.categoryItem,
                        // Removed old selection styling - using animated indicator instead
                      ]}
                      onPress={() => handleBrandSelect(brand.slug)}
                      onLayout={(event) => {
                        const { y, height } = event.nativeEvent.layout;
                        setCategoryItemHeights(prev => ({
                          ...prev,
                          [brand.slug]: { y, height }
                        }));
                        
                        // If this is the currently selected brand, update indicator position
                        if (isSelected && selectedIndicatorOpacity.value === 0) {
                          selectedIndicatorY.value = y;
                          selectedIndicatorOpacity.value = withDelay(100, withSpring(1, {
                            damping: 15,
                            stiffness: 200,
                          }));
                        }
                      }}
                    >
                    {brand.brand_logo ? (
                      <View style={[styles.categoryImageContainer, { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }]}>
                        <Image
                          source={{ uri: brand.brand_logo }}
                          style={styles.categoryImage}
                          resizeMode="contain"
                        />
                      </View>
                    ) : (
                      <View style={[
                        styles.categoryIconContainer,
                        { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }
                      ]}>
                        <Text style={styles.categoryIcon}>{brand.name.charAt(0)}</Text>
                      </View>
                    )}
                    <Text
                      variant="body-sm"
                      weight={isSelected ? "semibold" : "regular"}
                      color={isSelected ? 'accent' : 'primary'}
                      style={styles.categoryName}
                      numberOfLines={2}
                    >
                      {brand.name.replace(/&amp;/g, '&')}
                    </Text>
                  </TouchableOpacity>
                );
                })
              )
            ) : (
              // Categories loading state
              isCategoriesLoading ? (
                <ActivityIndicator size="small" color={colors.primary[600]} />
              ) : isCategoriesError ? (
                <Text variant="body" style={{ color: '#D32F2F' }}>Failed to load categories.</Text>
              ) : (
                // Categories list
                categories.map((item: CategoryWithProducts, index: number) => {
                  const categoryId = String(item.id || item.term_id || '');
                  const isSelected = selectedCategory === String(item.id) || selectedCategory === String(item.term_id);
                  
                  return (
                    <TouchableOpacity
                      key={String(item.id || item.term_id || `category-${index}`)}
                      style={[
                        styles.categoryItem,
                        // Removed old selection styling - using animated indicator instead
                      ]}
                      onPress={() => handleCategorySelect(categoryId)}
                      onLayout={(event) => {
                        const { y, height } = event.nativeEvent.layout;
                        setCategoryItemHeights(prev => ({
                          ...prev,
                          [categoryId]: { y, height }
                        }));
                        
                        // If this is the currently selected category, update indicator position
                        if (isSelected && selectedIndicatorOpacity.value === 0) {
                          selectedIndicatorY.value = y;
                          selectedIndicatorOpacity.value = withDelay(100, withSpring(1, {
                            damping: 15,
                            stiffness: 200,
                          }));
                        }
                      }}
                    >
                    {item.imageUrl ? (
                      <View style={[styles.categoryImageContainer, { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }]}>
                        <Image
                          source={{ uri: item.imageUrl }}
                          style={styles.categoryImage}
                          resizeMode="cover"
                        />
                      </View>
                    ) : (
                      <View style={[
                        styles.categoryIconContainer,
                        { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }
                      ]}>
                        <Text style={styles.categoryIcon}>{item.icon || '🛒'}</Text>
                      </View>
                    )}
                    <Text
                      variant="body-sm"
                      weight={isSelected ? "semibold" : "regular"}
                      color={isSelected ? 'accent' : 'primary'}
                      style={styles.categoryName}
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
                })
              )
            )}
          </ScrollView>
        </View>

        {/* Products Grid - 80% width */}
        <View style={styles.productsContainer}>
          {/* Sticky Filter Header - Only show when category/brand is selected */}
          {(selectedCategory || selectedBrand) && (
            <View style={[
              styles.filterHeader,
              { 
                backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                borderBottomColor: isDark ? '#333333' : '#EEEEEE'
              }
            ]}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterOptionsContainer}
              >
                {isProductsLoading ? (
                  // Show skeleton loaders
                  <>
                    <FilterOptionSkeleton />
                    <FilterOptionSkeleton />
                    <FilterOptionSkeleton />
                    <FilterOptionSkeleton />
                    <FilterOptionSkeleton />
                  </>
                ) : (
                  // Show actual filter options
                  filterOptions.map((option) => (
                    <FilterOption key={option.id} option={option} />
                  ))
                )}
              </ScrollView>
            </View>
          )}

          {isProductsLoading ? (
            <View>
              <ProductSkeleton />
              <ProductSkeleton />
            </View>
          ) : isProductsError ? (
            <Text variant="body" style={styles.errorText}>
              Failed to load products.
            </Text>
          ) : products.length === 0 ? (
            <Text variant="body" style={styles.noResultsText}>
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : selectedCategory
                  ? `No products found in category "${selectedCategory}"`
                  : selectedBrand
                    ? `No products found for brand "${selectedBrand}"`
                    : 'Select a category or brand to view products.'}
            </Text>
          ) : (
            <LegendList
              data={products}
              ListHeaderComponent={() => (
                // Scrollable Banner - Only show when category/brand is selected
                (selectedCategory || selectedBrand) ? (
                  <Animated.View 
                    style={[
                      styles.productsBanner,
                      {
                        backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                      }
                    ]}
                    entering={FadeInDown.duration(600).springify()}
                  >
                    <Image
                      source={{
                        uri: selectedCategory 
                          ? 'https://www.ayurcentralonline.com/wp-content/uploads/webp_images/web-sm-1-bn-1.webp'
                          : 'https://www.ayurcentralonline.com/wp-content/uploads/webp_images/2-1-3.webp'
                      }}
                      style={styles.bannerImage}
                      resizeMode="cover"
                    />
                    {/* Overlay If Required for Banner Texts*/}
                    {/* <View style={styles.bannerOverlay}>
                      <View style={styles.bannerContent}>
                        <Text 
                          variant="h3" 
                          weight="bold"
                          style={[
                            styles.bannerTitle,
                            { color: '#FFFFFF' }
                          ]}
                        >
                          {selectedCategory 
                            ? `${categories.find(cat => 
                                String(cat.id) === selectedCategory || String(cat.term_id) === selectedCategory
                              )?.name || 'Category'} Collection`
                            : `${brands.find(brand => brand.slug === selectedBrand)?.name || 'Brand'} Products`
                          }
                        </Text>
                        <Text 
                          variant="body" 
                          style={[
                            styles.bannerSubtitle,
                            { color: 'rgba(255, 255, 255, 0.9)' }
                          ]}
                        >
                          {selectedCategory 
                            ? 'Discover premium Ayurvedic solutions for your wellness needs'
                            : 'Authentic products from trusted Ayurvedic heritage'
                          }
                        </Text>
                      </View>
                    </View> */}
                  </Animated.View>
                ) : null
              )}
              renderItem={({ item, index }) => {
                                                  // Handle special brands spacer item (invisible spacer to prevent overlap)
                if (item.type === 'brands-spacer') {
                  return <View style={{ width: 0, height: 0 }} />;
                }

                // Handle special filter spacer item (invisible spacer to prevent overlap)
                if (item.type === 'filter-spacer') {
                  return <View style={{ width: 0, height: 0 }} />;
                }

                // Handle special brands section item
                 if (item.type === 'brands-section') {
                   const isRightColumn = index % 2 === 1;
                   const fullWidth = SCREEN_WIDTH - SIDEBAR_WIDTH; // Total content width
                   const columnWidth = (fullWidth - 16) / 2; // Width of one column including gap
                   
                   return (
                     <View style={[
                       styles.brandsWrapper,
                       { 
                         width: fullWidth,
                         marginLeft: isRightColumn ? -columnWidth - 8 : 0, // Pull back to start of left column
                       }
                     ]}>
                       <View style={[
                         styles.brandsSection,
                         styles.ayurvedicBackground,
                         { 
                           backgroundColor: isDark 
                             ? 'linear-gradient(135deg, #0a1a0a 0%, #152815 100%)' 
                             : 'linear-gradient(135deg, #b8d8b8 0%, #a0c8a0 100%)',
                           borderColor: isDark 
                             ? '#1a2e1a' 
                             : '#c0dcc0'
                         }
                       ]}>
                         {/* Decorative pattern overlay */}
                         <View style={styles.ayurvedicPattern} />
                        
                        <View style={styles.brandsSectionHeader}>
                          <Text 
                            variant="h4" 
                            weight="semibold"
                            style={{ 
                              color: isDark ? '#90EE90' : '#2d5016',
                              textShadowColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
                              textShadowOffset: { width: 0, height: 1 },
                              textShadowRadius: 2
                            }}
                          >
                            🌿 Shop by Ayurvedic Brands
                          </Text>
                        </View>
                        
                        <ScrollView 
                          horizontal 
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={styles.brandsScrollContent}
                          style={styles.brandsScrollView}
                        >
                          {isBrandsLoading ? (
                            // Brand skeleton loaders
                            <>
                              {[...Array(5)].map((_, index) => (
                                <View key={index} style={[styles.brandCardSkeleton, styles.ayurvedicBrandCard]}>
                                  <View style={[
                                    styles.brandImageSkeleton,
                                    { backgroundColor: isDark ? 'rgba(144, 238, 144, 0.1)' : 'rgba(45, 80, 22, 0.1)' }
                                  ]} />
                                  <View style={[
                                    styles.brandNameSkeleton,
                                    { backgroundColor: isDark ? 'rgba(144, 238, 144, 0.1)' : 'rgba(45, 80, 22, 0.1)' }
                                  ]} />
                                </View>
                              ))}
                            </>
                          ) : isBrandsError ? (
                            <View style={styles.brandsErrorContainer}>
                              <Text 
                                variant="body-sm" 
                                style={{ color: isDark ? '#90EE90' : '#2d5016' }}
                              >
                                Failed to load brands
                              </Text>
                            </View>
                          ) : (
                            brands?.slice(0, 8).map((brand) => (
                              <TouchableOpacity
                                key={brand.id}
                                style={[
                                  styles.brandCard,
                                  styles.ayurvedicBrandCard,
                                  { 
                                    backgroundColor: isDark 
                                      ? 'rgba(144, 238, 144, 0.15)' 
                                      : 'rgba(255, 255, 255, 0.9)',
                                    borderColor: isDark 
                                      ? 'rgba(144, 238, 144, 0.3)' 
                                      : 'rgba(45, 80, 22, 0.2)'
                                  }
                                ]}
                                onPress={() => handleBrandSelect(brand.slug)}
                              >
                                <View style={[
                                  styles.brandImageContainer,
                                  styles.ayurvedicImageContainer,
                                  { 
                                    backgroundColor: isDark 
                                      ? 'rgba(144, 238, 144, 0.2)' 
                                      : '#FFFFFF',
                                    borderColor: isDark 
                                      ? 'rgba(144, 238, 144, 0.4)' 
                                      : 'rgba(45, 80, 22, 0.3)'
                                  }
                                ]}>
                                  {brand.brand_logo ? (
                                    <Image
                                      source={{ uri: brand.brand_logo }}
                                      style={styles.brandImage}
                                      resizeMode="contain"
                                    />
                                  ) : (
                                    <View style={[
                                      styles.brandPlaceholder,
                                      { 
                                        backgroundColor: isDark 
                                          ? 'rgba(144, 238, 144, 0.3)' 
                                          : 'rgba(45, 80, 22, 0.1)'
                                      }
                                    ]}>
                                      <Text style={{
                                        ...styles.brandPlaceholderText,
                                        color: isDark ? '#90EE90' : '#2d5016'
                                      }}>
                                        {brand.name.charAt(0)}
                                      </Text>
                                    </View>
                                  )}
                                </View>
                                <Text 
                                  variant="body-sm" 
                                  weight="medium"
                                  style={{
                                    ...styles.brandName,
                                    color: isDark ? '#90EE90' : '#2d5016'
                                  }}
                                  numberOfLines={2}
                                >
                                  {brand.name.replace(/&amp;/g, '&')}
                                </Text>
                              </TouchableOpacity>
                            ))
                          )}
                        </ScrollView>
                      </View>
                    </View>
                  );
                }

                // Handle special filter section item
                if (item.type === 'filter-section') {
                  const isRightColumn = index % 2 === 1;
                  const fullWidth = SCREEN_WIDTH - SIDEBAR_WIDTH; // Total content width
                  const columnWidth = (fullWidth - 10) / 2; // Width of one column including gap
                  
                  // Get category-specific styling
                  const getCategoryStyle = (categoryId: string) => {
                    const categoryStyles = {
                      brand: {
                        backgroundColor: isDark ? '#0f1f0f' : '#b8d8b8',
                        borderColor: isDark ? '#1a2e1a' : '#a0c8a0',
                        headerColor: isDark ? '#90EE90' : '#2d5016',
                      },
                      type: {
                        backgroundColor: isDark ? '#0f0f1f' : '#b8b8d8',
                        borderColor: isDark ? '#1a1a2e' : '#a0a0c8',
                        headerColor: isDark ? '#a5b4fc' : '#4f46e5',
                      },
                      category: {
                        backgroundColor: isDark ? '#1f0f0f' : '#d8b8b8',
                        borderColor: isDark ? '#2e1a1a' : '#c8a0a0',
                        headerColor: isDark ? '#fca5a5' : '#dc2626',
                      },
                      properties: {
                        backgroundColor: isDark ? '#0f1f1f' : '#b8d8d8',
                        borderColor: isDark ? '#1a2e2e' : '#a0c8c8',
                        headerColor: isDark ? '#67e8f9' : '#0891b2',
                      },
                    };
                    return (categoryStyles as any)[categoryId] || categoryStyles.brand;
                  };
                  
                  const categoryStyle = getCategoryStyle(item.filterCategory.id);
                  
                  return (
                    <View style={[
                      styles.filterWrapper,
                      { 
                        width: fullWidth,
                        marginLeft: isRightColumn ? -columnWidth - 8 : 0, // Pull back to start of left column
                      }
                    ]}>
                      <View style={[
                        styles.filterSection,
                        styles.ayurvedicBackground,
                        { 
                          backgroundColor: categoryStyle.backgroundColor,
                          borderColor: categoryStyle.borderColor,
                        }
                      ]}>
                        {/* Decorative pattern overlay */}
                        <View style={styles.ayurvedicPattern} />
                        <View style={styles.filterSectionHeader}>
                          <Text 
                            variant="h4" 
                            weight="semibold"
                            style={{ 
                              color: categoryStyle.headerColor,
                              textShadowColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
                              textShadowOffset: { width: 0, height: 1 },
                              textShadowRadius: 2
                            }}
                          >
                            🎯 {item.filterCategory.name}
                          </Text>
                        </View>
                        <ScrollView 
                          horizontal 
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={styles.filterScrollContent}
                          style={styles.filterScrollView}
                        >
                          {item.filterCategory.items.map((filterItem: { id: string; name: string; icon: string }) => {
                            const isSelected = (filters.selectedItems || []).includes(filterItem.id);
                            
                            // Define universal color scheme for filter items (back to white/neutral)
                            const getFilterColors = (categoryId: string, isSelected: boolean, isDark: boolean) => {
                              return {
                                background: isSelected
                                  ? (isDark ? colors.primary[800] : colors.primary[50])
                                  : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'),
                                border: isSelected
                                  ? colors.primary[600]
                                  : (isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'),
                                text: isSelected 
                                  ? colors.primary[600]
                                  : (isDark ? '#FFFFFF' : '#374151')
                              };
                            };
                            
                            const filterColors = getFilterColors(item.filterCategory.id, isSelected, isDark);
                            
                            return (
                              <TouchableOpacity
                                key={filterItem.id}
                                style={[
                                  styles.filterPill,
                                  { 
                                    backgroundColor: filterColors.background,
                                    borderColor: filterColors.border,
                                  }
                                ]}
                                onPress={() => handleFilterItemSelect(filterItem.id, item.filterCategory.id)}
                              >
                                <Text style={{
                                  ...styles.filterPillIcon,
                                  color: filterColors.text
                                }}>
                                  {filterItem.icon}
                                </Text>
                                <Text 
                                  variant="body-sm" 
                                  weight={isSelected ? "semibold" : "medium"}
                                  style={{
                                    color: filterColors.text
                                  }}
                                  numberOfLines={1}
                                >
                                  {filterItem.name}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                     </View>
                   </View>
                 );
               }
                
                // Regular product card
                return (
                  <ProductCard
                    product={item}
                    onPress={() => handleProductPress(item.id)}
                    onAddToCart={() => handleAddToCart(item)}
                  />
                );
               }}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
              numColumns={2}
              contentContainerStyle={styles.productsList}
              recycleItems={true}
              estimatedItemSize={280}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text variant="body" color="secondary" style={styles.emptyText}>
                    {searchQuery.length > 0
                      ? 'No products found. Try a different search term or category.'
                      : 'Search for products by name, category, or description.'}
                  </Text>
                </View>
              }
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={refetchProducts}
                  colors={[colors.primary[500]]}
                  tintColor={colors.primary[500]}
                />
              }
              onScroll={handleScroll}
              ListFooterComponent={() => (
                hasMoreProducts ? (
                  <View style={styles.loadingMoreContainer}>
                    <ActivityIndicator size="small" color={colors.primary[500]} />
                    <Text style={styles.loadingMoreText}>Loading more products...</Text>
                  </View>
                ) : null
              )}
            />
          )}
        </View>
      </View>

      <FilterModal
        visible={showFilterModal}
        filters={filters}
        onClose={() => setShowFilterModal(false)}
        onApply={applyFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: '#D32F2F', 
    textAlign: 'center', 
    marginTop: 20
  },
  noResultsText: {
    textAlign: 'center', 
    color: '#666', 
    marginTop: 20
  },
  // Loading more indicator styles for pagination
  loadingMoreContainer: {
    padding: 20,
    alignItems: 'center'
  },
  loadingMoreText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14
  },
  categoryImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 4,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginRight: 12,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  categoriesSidebar: {
    borderRightWidth: 1,
    height: '100%',
    position: 'relative',
  },
  selectionIndicator: {
    position: 'absolute',
    left: 0,
    width: 4,
    height: 60,
    borderRadius: 2,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryName: {
    textAlign: 'center',
    fontSize: 10,
  },

  productsContainer: {
    flex: 1,
  },
  productsBanner: {
    height: 150,
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bannerTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bannerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productsList: {
    // padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyText: {
    textAlign: 'center',
  },
  
  // Filter Header Styles
  filterHeader: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  filterOptionsContainer: {
    paddingHorizontal: 8,
    gap: 8,
    alignItems: 'center',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,  // Squircle shape - reduced from 20 to 12
    borderWidth: 1,
    minWidth: 70,
    justifyContent: 'center',
    gap: 4,
  },
  filterOptionSkeleton: {
    minWidth: 80,
    height: 36,
    borderRadius: 12,  // Squircle shape - reduced from 20 to 12
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonText: {
    width: 50,
    height: 14,
    borderRadius: 7,
  },
  filterOptionText: {
    fontSize: 14,
    textAlign: 'center',
  },
  dropdownIcon: {
    marginLeft: 2,
  },
  
  // Brands Section Styles
  brandsSection: {
    // marginBottom: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    // width: '100%',
  },
  brandsSectionHeader: {
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandsScrollView: {
    // marginHorizontal: -16,
    width: '100%',
  },
  brandsScrollContent: {
    paddingLeft: 0,
    paddingRight: 0,
    // paddingHorizontal: 10,
    gap: 12,
  },
  brandCard: {
    width: 80,
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
  },
  brandImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  brandImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  brandPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  brandName: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 14,
  },
  brandCardSkeleton: {
    width: 80,
    alignItems: 'center',
    padding: 8,
  },
  brandImageSkeleton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  brandNameSkeleton: {
    width: 60,
    height: 12,
    borderRadius: 6,
  },
  brandsErrorContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  
  // Ayurvedic Theme Styles
  brandsWrapper: {
    marginVertical: 8,
  },
  ayurvedicBackground: {
    position: 'relative',
    overflow: 'hidden',
    // borderRadius: 16,
    borderWidth: 0.2,
    // marginHorizontal: -8,
    marginVertical: 6,
    shadowColor: '#1a3a1a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
    width: '100%',
  },
  ayurvedicPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(45, 80, 22, 0.2)',
    borderRadius: 16,
  },
  ayurvedicSeeAllButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(45, 80, 22, 0.3)',
  },
  ayurvedicBrandCard: {
    borderWidth: 1,
    // shadowColor: '#1a3a1a',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  ayurvedicImageContainer: {
    borderWidth: 2,
    shadowColor: '#1a3a1a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },

  // Filter Section Styles
  filterWrapper: {
    marginVertical: 8,
  },
  filterSection: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  filterSectionHeader: {
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  filterScrollView: {
    width: '100%',
  },
  filterScrollContent: {
    paddingLeft: 0,
    paddingRight: 0,
    // gap: 5,
  },
  filterCard: {
    // width: 80,
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
    gap: 6,
  },
  filterPillIcon: {
    fontSize: 16,
  },
  filterIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterIcon: {
    fontSize: 24,
  },
  filterName: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 14,
  },
  ayurvedicFilterCard: {
    borderWidth: 1,
    shadowColor: '#1a3a1a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  ayurvedicFilterIconContainer: {
    borderWidth: 2,
    shadowColor: '#1a3a1a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
});