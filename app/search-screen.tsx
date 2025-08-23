import { useState, useEffect, useCallback } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Animated } from 'react-native';
import { Search as SearchIcon, X, ArrowLeft, Clock, Trash2, AlertCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ProductCard from '@/components/search/ProductCard';
import { Text } from '@/components/ui';
import { colors } from '@/utils/theme';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { saveSearchHistory, getSearchHistory, clearSearchHistory } from '@/utils/searchHistory';
import { debounce } from '@/utils/helpers';

// Search API function
const searchProducts = async (query: string) => {
  console.log('query', query);
  try {
    const response = await axios.get(`https://b2b.ayurcentralonline.com/wp-json/b2b/v1/search`, {
      params: { query }
    });
    console.log('Search API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Search API error:', error);
    throw error;
  }
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const dispatch = useDispatch();

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce((text: string) => {
      if (text.length > 3) {
        setIsSearching(true);
        // Save to search history after successful search
        saveSearchHistory(text).then(newHistory => {
          setSearchHistory(newHistory);
        }).catch(error => {
          console.error('Error saving search history:', error);
        });
      } else {
        setIsSearching(false);
      }
    }, 500),
    []
  );

  // Load search history on mount
  useEffect(() => {
    loadSearchHistory();
  }, []);

  // Animate content when switching between history and results
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isSearching]);

  const loadSearchHistory = async () => {
    try {
      setIsHistoryLoading(true);
      setHistoryError(null);
      const history = await getSearchHistory();
      setSearchHistory(history);
    } catch (error) {
      setHistoryError('Failed to load search history');
      console.error('Error loading search history:', error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // Search products query with debouncing
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['searchProducts', searchQuery],
    queryFn: () => searchProducts(searchQuery),
    enabled: searchQuery.length > 3,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
    
    if (text.length <= 3) {
      setIsSearching(false);
    }
  };

  const handleHistoryItemPress = async (item: string) => {
    setSearchQuery(item);
    // Always trigger search for history items, regardless of length
    if (item.length > 3) {
      setIsSearching(true);
    }
    try {
      const newHistory = await saveSearchHistory(item);
      setSearchHistory(newHistory);
    } catch (error) {
      console.error('Error updating search history:', error);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearSearchHistory();
      setSearchHistory([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
      setHistoryError('Failed to clear search history');
    }
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleAddToCart = (product: any) => {
    dispatch(addToCart(product));
  };

  const renderSearchHistory = () => (
    <Animated.View 
      style={[
        styles.historyContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Recent Searches</Text>
        {searchHistory.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory}>
            <Trash2 size={20} color={colors.primary[600]} />
          </TouchableOpacity>
        )}
      </View>

      {isHistoryLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      ) : historyError ? (
        <View style={styles.errorContainer}>
          <AlertCircle size={24} color={colors.error[500]} />
          <Text style={styles.errorText}>{historyError}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadSearchHistory}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : searchHistory.length === 0 ? (
        <Text style={styles.emptyHistoryText}>
          No recent searches
        </Text>
      ) : (
        searchHistory.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.historyItem}
            onPress={() => handleHistoryItemPress(item)}
          >
            <Clock size={20} color={colors.primary[600]} />
            <Text style={styles.historyItemText}>{item}</Text>
          </TouchableOpacity>
        ))
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header with back button and search bar */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.primary[600]} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <SearchIcon size={20} color={colors.primary[600]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={colors.primary[400]}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => handleSearch('')}
              style={styles.clearButton}
            >
              <X size={20} color={colors.primary[600]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {!isSearching ? (
          renderSearchHistory()
        ) : (
          <Animated.View 
            style={[
              styles.resultsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[600]} />
                <Text style={styles.loadingText}>Searching products...</Text>
              </View>
            ) : products.length > 0 ? (
              <FlatList
                data={products}
                renderItem={({ item }) => (
                  <ProductCard
                    product={item}
                    onPress={() => handleProductPress(item.id)}
                    onAddToCart={() => handleAddToCart(item)}
                  />
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.productList}
              />
            ) : (
              <Text style={styles.noResults}>No products found</Text>
            )}
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginLeft: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  historyContainer: {
    padding: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyItemText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  resultsContainer: {
    flex: 1,
  },
  productList: {
    padding: 8,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 24,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    marginTop: 8,
    color: colors.error[500],
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary[50],
    borderRadius: 8,
  },
  retryText: {
    color: colors.primary[600],
    fontFamily: 'Poppins-Medium',
  },
  emptyHistoryText: {
    textAlign: 'center',
    color: '#666',
    fontFamily: 'Poppins-Regular',
    marginTop: 24,
  },
}); 