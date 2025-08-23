import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, FlatList, Dimensions, Keyboard, Modal } from 'react-native';
import { Text, Button } from '@/components/ui';
import { Zap, Search, Plus, Minus, ShoppingCart, BarChart3, Package, X, ChevronDown } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { addToCart, selectCartItems } from '@/store/cartSlice';
import { colors } from '@/utils/theme';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, BounceIn, FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Product } from '@/api/products';

const { height: screenHeight } = Dimensions.get('window');

// Expanded B2B product catalog for better search testing
const allProducts: Product[] = [
  // Featured/Popular items
  { id: '1', name: 'Organic Bananas', description: 'Fresh organic bananas, 1kg', price: 89, image: 'https://images.pexels.com/photos/5946077/pexels-photo-5946077.jpeg', category: 'Fruits', rating: 4.5, ratingCount: 120, inStock: true, discount: 10, featured: true, weight: '1kg' },
  { id: '2', name: 'Whole Milk', description: 'Fresh dairy milk, 1L', price: 68, image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg', category: 'Dairy', rating: 4.7, ratingCount: 89, inStock: true, discount: 5, featured: true, volume: '1L' },
  { id: '3', name: 'Brown Bread', description: 'Whole wheat brown bread', price: 45, image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg', category: 'Bakery', rating: 4.3, ratingCount: 156, inStock: true, discount: 0, featured: true, weight: '400g' },
  { id: '4', name: 'Fresh Eggs', description: 'Farm fresh eggs, 12 pieces', price: 120, image: 'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg', category: 'Dairy', rating: 4.8, ratingCount: 203, inStock: true, discount: 15, featured: true, quantity: '12 pcs' },
  { id: '5', name: 'Basmati Rice', description: 'Premium basmati rice, 5kg', price: 899, image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg', category: 'Grains', rating: 4.6, ratingCount: 178, inStock: true, discount: 8, featured: true, weight: '5kg' },
  
  // Additional B2B Products
  { id: '6', name: 'Almonds Premium', description: 'Premium quality almonds', price: 1200, image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg', category: 'Nuts', rating: 4.8, ratingCount: 95, inStock: true, discount: 12, featured: false, weight: '1kg' },
  { id: '7', name: 'Cashews Roasted', description: 'Roasted cashew nuts', price: 1500, image: 'https://images.pexels.com/photos/161568/cashews-nuts-snack-161568.jpeg', category: 'Nuts', rating: 4.7, ratingCount: 67, inStock: true, discount: 8, featured: false, weight: '500g' },
  { id: '8', name: 'Green Tea Leaves', description: 'Organic green tea leaves', price: 450, image: 'https://images.pexels.com/photos/207962/pexels-photo-207962.jpeg', category: 'Beverages', rating: 4.4, ratingCount: 134, inStock: true, discount: 5, featured: false, weight: '250g' },
  { id: '9', name: 'Honey Pure', description: 'Pure natural honey', price: 320, image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg', category: 'Sweeteners', rating: 4.9, ratingCount: 210, inStock: true, discount: 0, featured: false, weight: '500g' },
  { id: '10', name: 'Olive Oil Extra Virgin', description: 'Extra virgin olive oil', price: 890, image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg', category: 'Oils', rating: 4.6, ratingCount: 156, inStock: true, discount: 15, featured: false, volume: '500ml' },
  { id: '11', name: 'Quinoa Seeds', description: 'Organic quinoa seeds', price: 650, image: 'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg', category: 'Grains', rating: 4.5, ratingCount: 89, inStock: true, discount: 10, featured: false, weight: '500g' },
  { id: '12', name: 'Chia Seeds', description: 'Premium chia seeds', price: 420, image: 'https://images.pexels.com/photos/6644303/pexels-photo-6644303.jpeg', category: 'Seeds', rating: 4.7, ratingCount: 112, inStock: true, discount: 0, featured: false, weight: '250g' },
  { id: '13', name: 'Coconut Oil', description: 'Cold pressed coconut oil', price: 380, image: 'https://images.pexels.com/photos/2587522/pexels-photo-2587522.jpeg', category: 'Oils', rating: 4.8, ratingCount: 178, inStock: true, discount: 12, featured: false, volume: '500ml' },
  { id: '14', name: 'Turmeric Powder', description: 'Pure turmeric powder', price: 180, image: 'https://images.pexels.com/photos/161556/turmeric-powder-161556.jpeg', category: 'Spices', rating: 4.6, ratingCount: 203, inStock: true, discount: 5, featured: false, weight: '200g' },
  { id: '15', name: 'Black Pepper Whole', description: 'Whole black pepper', price: 250, image: 'https://images.pexels.com/photos/315665/pexels-photo-315665.jpeg', category: 'Spices', rating: 4.7, ratingCount: 145, inStock: true, discount: 8, featured: false, weight: '100g' },
  { id: '16', name: 'Cinnamon Sticks', description: 'Premium cinnamon sticks', price: 320, image: 'https://images.pexels.com/photos/298663/pexels-photo-298663.jpeg', category: 'Spices', rating: 4.5, ratingCount: 87, inStock: true, discount: 0, featured: false, weight: '50g' },
  { id: '17', name: 'Greek Yogurt', description: 'Thick Greek yogurt', price: 150, image: 'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg', category: 'Dairy', rating: 4.8, ratingCount: 234, inStock: true, discount: 10, featured: false, weight: '400g' },
  { id: '18', name: 'Cheese Mozzarella', description: 'Fresh mozzarella cheese', price: 280, image: 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg', category: 'Dairy', rating: 4.6, ratingCount: 167, inStock: true, discount: 5, featured: false, weight: '200g' },
  { id: '19', name: 'Avocados Fresh', description: 'Fresh ripe avocados', price: 45, image: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg', category: 'Fruits', rating: 4.4, ratingCount: 198, inStock: true, discount: 0, featured: false, quantity: '1 pc' },
  { id: '20', name: 'Blueberries Organic', description: 'Organic fresh blueberries', price: 380, image: 'https://images.pexels.com/photos/132119/pexels-photo-132119.jpeg', category: 'Fruits', rating: 4.9, ratingCount: 145, inStock: true, discount: 15, featured: false, weight: '250g' },
  { id: '21', name: 'Spinach Fresh', description: 'Fresh green spinach', price: 35, image: 'https://images.pexels.com/photos/2106037/pexels-photo-2106037.jpeg', category: 'Vegetables', rating: 4.3, ratingCount: 123, inStock: true, discount: 0, featured: false, weight: '250g' },
  { id: '22', name: 'Broccoli Crown', description: 'Fresh broccoli crown', price: 65, image: 'https://images.pexels.com/photos/47347/broccoli-vegetable-food-healthy-47347.jpeg', category: 'Vegetables', rating: 4.5, ratingCount: 89, inStock: true, discount: 8, featured: false, quantity: '1 pc' },
  { id: '23', name: 'Sweet Potatoes', description: 'Organic sweet potatoes', price: 55, image: 'https://images.pexels.com/photos/89789/sweet-potatoes-vegetables-healthy-89789.jpeg', category: 'Vegetables', rating: 4.6, ratingCount: 156, inStock: true, discount: 5, featured: false, weight: '500g' },
  { id: '24', name: 'Bell Peppers Mixed', description: 'Mixed color bell peppers', price: 120, image: 'https://images.pexels.com/photos/128536/pexels-photo-128536.jpeg', category: 'Vegetables', rating: 4.4, ratingCount: 78, inStock: true, discount: 0, featured: false, weight: '500g' },
  { id: '25', name: 'Tomatoes Cherry', description: 'Fresh cherry tomatoes', price: 85, image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg', category: 'Vegetables', rating: 4.7, ratingCount: 167, inStock: true, discount: 10, featured: false, weight: '250g' },
];

// Quick order suggestions (featured items)
const quickOrderSuggestions: Product[] = allProducts.filter(product => product.featured);

interface QuickOrderItem {
  product: Product;
  quantity: number;
}

export default function QuickOrderScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isDark = useSelector(selectIsDark);
  const cartItems = useSelector(selectCartItems);
  const searchInputRef = useRef<TextInput>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [quickItems, setQuickItems] = useState<QuickOrderItem[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Handle search filtering with dropdown
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setHasSearched(true);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setShowDropdown(false);
      setFilteredSuggestions(quickOrderSuggestions);
    } else {
      // Search through all products for B2B catalog
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 20); // Limit to 20 results for performance
      
      setSearchResults(filtered);
      setShowDropdown(true); // Always show dropdown when searching, even if no results
    }
  }, []);

  // Handle search input focus
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (searchQuery.trim() !== '') {
      setShowDropdown(true); // Show dropdown if there's a search query, regardless of results
    }
  };

  // Handle search input blur
  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    // Delay hiding dropdown to allow for item selection
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  // Handle product selection from dropdown
  const handleProductSelect = (product: Product) => {
    console.log('product', product);
    addToQuickOrder(product);
    setSearchQuery('');
    setShowDropdown(false);
    setSearchResults([]);
    searchInputRef.current?.blur();
    Keyboard.dismiss();
    
    // Show success feedback
    // Alert.alert('Added!', `${product.name} added to your quick order`, [
    //   { text: 'OK', style: 'default' }
    // ]);
  };

  // Handle direct add to cart from dropdown
  const handleDirectAddToCart = (product: Product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      discount: product.discount,
      weight: product.weight,
      volume: product.volume,
      category: product.category,
    };
    dispatch(addToCart(cartItem));
    
    setSearchQuery('');
    setShowDropdown(false);
    setSearchResults([]);
    searchInputRef.current?.blur();
    Keyboard.dismiss();
    
    // Show success feedback
    Alert.alert('Added to Cart!', `${product.name} added to your cart`, [
      { text: 'Continue Shopping', style: 'cancel' },
      { text: 'View Cart', onPress: () => router.push('/(tabs)/cart') }
    ]);
  };

  // Add item to quick order list
  const addToQuickOrder = (product: Product) => {
    const existingItem = quickItems.find(item => item.product.id === product.id);
    if (existingItem) {
      setQuickItems(prev =>
        prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setQuickItems(prev => [...prev, { product, quantity: 1 }]);
    }
  };

  // Update quantity in quick order list
  const updateQuickOrderQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setQuickItems(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setQuickItems(prev =>
        prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  // Add all quick order items to cart
  const addAllToCart = () => {
    if (quickItems.length === 0) {
      Alert.alert('No Items', 'Please add some items to your quick order first.');
      return;
    }

    quickItems.forEach(({ product, quantity }) => {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        discount: product.discount,
        weight: product.weight,
        volume: product.volume,
        category: product.category,
      };
      dispatch(addToCart(cartItem));
    });

    Alert.alert('Success', `Added ${quickItems.length} items to cart!`, [
      { text: 'Continue Shopping', style: 'cancel' },
      { text: 'View Cart', onPress: () => router.push('/(tabs)/cart') }
    ]);

    // Clear quick order list
    setQuickItems([]);
  };

  const totalAmount = quickItems.reduce((sum, item) => {
    const discountedPrice = item.product.price * (1 - item.product.discount / 100);
    return sum + (discountedPrice * item.quantity);
  }, 0);

  const totalItems = quickItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}>
      {/* Header */}
      <Animated.View entering={FadeInUp} style={styles.header}>
        <View style={styles.headerContent}>
          {/* <Zap size={28} color={colors.primary[600]} /> */}
          {/* <Text variant="h3" weight="bold" style={{ marginLeft: 12 }}>Quick Order</Text> */}
          <View style={[styles.searchBar, { 
            backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
            borderColor: isSearchFocused ? colors.primary[600] : 'transparent',
            borderWidth: isSearchFocused ? 2 : 0,
          }]}>
            <Search size={20} color={isSearchFocused ? colors.primary[600] : (isDark ? '#888' : '#666')} />
            <TextInput
              ref={searchInputRef}
              style={[styles.searchInput, { color: isDark ? '#FFF' : '#333' }]}
              placeholder="Search from 10,000+ products..."
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              autoComplete="off"
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => {
                  setSearchQuery('');
                  setShowDropdown(false);
                  setSearchResults([]);
                }}
                style={styles.clearButton}
              >
                <X size={18} color={isDark ? '#888' : '#666'} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* <Text variant="body-sm" color="secondary" style={{ marginTop: 4 }}>
          Add frequently purchased items quickly
        </Text> */}
      </Animated.View>

      {/* Search Bar */}
      {/* <Animated.View entering={FadeInDown.delay(100)} style={styles.searchContainer}>
        <View style={[styles.searchBar, { 
          backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
          borderColor: isSearchFocused ? colors.primary[600] : 'transparent',
          borderWidth: isSearchFocused ? 2 : 0,
        }]}>
          <Search size={20} color={isSearchFocused ? colors.primary[600] : (isDark ? '#888' : '#666')} />
          <TextInput
            ref={searchInputRef}
            style={[styles.searchInput, { color: isDark ? '#FFF' : '#333' }]}
            placeholder="Search from 100+ products..."
            placeholderTextColor={isDark ? '#888' : '#666'}
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            autoComplete="off"
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => {
                setSearchQuery('');
                setShowDropdown(false);
                setSearchResults([]);
              }}
              style={styles.clearButton}
            >
              <X size={18} color={isDark ? '#888' : '#666'} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View> */}

      {/* Search Dropdown Overlay */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <TouchableOpacity 
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => {
              setShowDropdown(false);
              searchInputRef.current?.blur();
              Keyboard.dismiss();
            }}
          />
          
          {/* Dropdown */}
          <Animated.View 
            entering={SlideInDown.duration(200)} 
            exiting={SlideOutDown.duration(150)}
            style={[styles.dropdownOverlay, { 
              backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
              borderColor: isDark ? '#333' : '#E0E0E0',
            }]}
          >
            <View style={styles.dropdownHeader}>
              <Text variant="body-sm" weight="medium" color="secondary">
                {searchResults.length} products found
              </Text>
              <Text variant="caption" color="secondary">
                {searchResults.length > 0 ? 'Tap to add to quick order' : 'Try different keywords'}
              </Text>
            </View>
            {searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="always"
                style={styles.dropdownList}
                renderItem={({ item, index }) => (
                <Animated.View entering={FadeInDown.delay(index * 30)}>
                  <View
                    style={[styles.dropdownItem, { 
                      backgroundColor: isDark ? '#2A2A2A' : '#F9F9F9',
                      borderBottomColor: isDark ? '#333' : '#E5E5E5',
                    }]}
                  >
                    <View style={styles.dropdownItemRow}>
                      {/* Product Image */}
                      <View style={styles.productImageContainer}>
                        <Text style={styles.productImagePlaceholder}>📦</Text>
                      </View>
                      
                      {/* Product Info */}
                      <View style={styles.productDetails}>
                        <Text variant="body" weight="medium" numberOfLines={1} style={styles.productName}>
                          {item.name}
                        </Text>
                        <Text variant="caption" color="secondary" numberOfLines={1} style={styles.productBrand}>
                          {item.category} • {item.weight || item.volume || item.quantity}
                        </Text>
                      </View>
                      
                      {/* Price Section */}
                      <View style={styles.priceSection}>
                        {item.discount > 0 ? (
                          <>
                            <Text variant="body-sm" weight="semibold" color="accent" style={styles.currentPrice}>
                              ₹{(item.price * (1 - item.discount / 100)).toFixed(2)}
                            </Text>
                            <Text variant="caption" style={styles.originalPrice}>
                              ₹{item.price.toFixed(2)}
                            </Text>
                            <Text variant="caption" style={styles.discountText}>
                              ({item.discount}% off)
                            </Text>
                          </>
                        ) : (
                          <Text variant="body-sm" weight="semibold" style={styles.currentPrice}>
                            ₹{item.price.toFixed(2)}
                          </Text>
                        )}
                      </View>
                      
                      {/* Quick Add Button */}
                      <TouchableOpacity
                        style={styles.quickAddButton}
                        onPress={() => {
                          handleProductSelect(item);
                          console.log('item', item);
                        }}
                        activeOpacity={0.8}
                      >
                        <Plus size={12} color="#FFF" />
                        <Text variant="caption" style={styles.quickButtonText}>Add</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              )}
            />
            ) : (
              // Empty state when no products found
              <Animated.View entering={FadeInDown.delay(100)} style={styles.emptySearchState}>
                <Text style={styles.emptySearchIcon}>🔍</Text>
                <Text variant="body" weight="medium" style={styles.emptySearchTitle}>
                  Product not available
                </Text>
                <Text variant="body-sm" color="secondary" style={styles.emptySearchText}>
                  We couldn't find "{searchQuery}" in our catalog.{'\n'}
                  Try searching with different keywords.
                </Text>
              </Animated.View>
            )}
          </Animated.View>
        </>
      )}

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Quick Order List */}
        {quickItems.length > 0 && (
          <Animated.View entering={BounceIn} style={styles.quickOrderSection}>
            <View style={styles.sectionHeader}>
              <Text variant="h5" weight="semibold">Your Quick Order ({totalItems} items)</Text>
              <Text variant="body-sm" color="accent" weight="medium">₹{totalAmount.toFixed(2)}</Text>
            </View>
            {quickItems.map((item, index) => (
              <Animated.View key={item.product.id} entering={FadeInDown.delay(index * 50)} style={styles.quickOrderItem}>
                <View style={styles.itemInfo}>
                  <Text variant="body" weight="medium">{item.product.name}</Text>
                  <Text variant="body-sm" color="secondary">₹{(item.product.price * (1 - item.product.discount / 100)).toFixed(2)} each</Text>
                </View>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuickOrderQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Minus size={16} color={colors.primary[600]} />
                  </TouchableOpacity>
                  <Text variant="body" weight="medium" style={styles.quantityText}>
                    {item.quantity}
                  </Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuickOrderQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus size={16} color={colors.primary[600]} />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
            <Button 
              style={styles.addToCartButton} 
              onPress={addAllToCart}
              icon={<ShoppingCart size={18} color="#FFF" />}
            >
              Add All to Cart - ₹{totalAmount.toFixed(2)}
            </Button>
          </Animated.View>
        )}

        {/* Show suggestions only after user has searched or added items */}
        {(hasSearched || quickItems.length > 0) ? (
          <Animated.View entering={FadeInDown.delay(200)} style={styles.suggestionsSection}>
            <View style={styles.sectionHeader}>
              <Text variant="h4" weight="semibold">Quick Add Items</Text>
              <Package size={20} color={colors.primary[600]} />
            </View>
            <FlatList
              data={quickOrderSuggestions}
              keyExtractor={(item) => item.id}
              numColumns={3}
              columnWrapperStyle={styles.suggestionRow}
              renderItem={({ item, index }) => (
                <Animated.View entering={FadeInDown.delay(index * 80)} style={styles.suggestionCard}>
                  <TouchableOpacity
                    style={[styles.suggestionItem, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}
                    onPress={() => addToQuickOrder(item)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.productImage}>
                      {item.discount > 0 && (
                        <View style={styles.discountBadge}>
                          <Text variant="caption" style={styles.discountBadgeText}>{item.discount}% OFF</Text>
                        </View>
                      )}
                      <Text variant="body-lg" style={styles.placeholder}>📦</Text>
                    </View>
                    <View style={styles.productInfo}>
                      <Text variant="body-sm" weight="medium" numberOfLines={2}>{item.name}</Text>
                      <Text variant="caption" color="secondary" numberOfLines={1}>{item.weight || item.volume || item.quantity}</Text>
                      <View style={styles.priceRow}>
                        {item.discount > 0 ? (
                          <>
                            <Text variant="caption" style={styles.originalPrice}>
                              ₹{item.price.toFixed(2)}
                            </Text>
                            <Text variant="body-sm" weight="semibold" color="accent">
                              ₹{(item.price * (1 - item.discount / 100)).toFixed(2)}
                            </Text>
                          </>
                        ) : (
                          <Text variant="body-sm" weight="semibold">₹{item.price.toFixed(2)}</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.addButton}>
                      <Plus size={14} color="#FFF" />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              )}
              scrollEnabled={false}
            />
          </Animated.View>
        ) : (
          // Empty state for first-time users
          <Animated.View entering={FadeInDown.delay(200)} style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🛒</Text>
            <Text variant="h4" weight="bold" style={styles.emptyStateTitle}>
              Quick Order Made Easy
            </Text>
            <Text variant="body" color="secondary" style={styles.emptyStateText}>
              Search for products above to quickly add them to your order.{'\n'}
              Start typing product names to get instant results!
            </Text>
            <View style={styles.emptyStateFeatures}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>⚡</Text>
                <Text variant="body-sm" weight="medium">Lightning fast search</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📦</Text>
                <Text variant="body-sm" weight="medium">10,000+ products available</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🎯</Text>
                <Text variant="body-sm" weight="medium">One-tap ordering</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Quick Stats */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.statsSection}>
          <View style={[styles.statsCard, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
            <BarChart3 size={24} color={colors.primary[600]} />
            <View style={styles.statsContent}>
              <Text variant="body" weight="medium">Items in Cart: {cartItems.length}</Text>
              <Text variant="body-sm" color="secondary">Tap items above to add to quick order</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 999,
  },
  // Dropdown Overlay Styles
  dropdownOverlay: {
    position: 'absolute',
    top: 120, // Adjust based on header + search bar height
    left: 20,
    right: 20,
    height: screenHeight * 0.52, // Slightly reduced for better 3x3 layout
    borderRadius: 16,
    borderWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 1000,
  },
  dropdownHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownList: {
    flex: 1,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  dropdownItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productImagePlaceholder: {
    fontSize: 18,
  },
  productDetails: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    marginBottom: 2,
  },
  productBrand: {
    opacity: 0.8,
  },
  priceSection: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  currentPrice: {
    marginBottom: 2,
  },
  discountText: {
    color: colors.secondary[600],
    fontSize: 10,
    fontWeight: '600',
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[600],
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
    gap: 4,
  },
  quickButtonText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  // Empty states styles
  emptySearchState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptySearchIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.8,
    lineHeight: 56,
    textAlign: 'center',
    includeFontPadding: false,
  },
  emptySearchTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySearchText: {
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    marginHorizontal: 20,
    backgroundColor: colors.primary[50],
    borderRadius: 20,
    marginBottom: 20,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20,
    opacity: 0.9,
    lineHeight: 72,
    textAlign: 'center',
    includeFontPadding: false,
    height: 72,
  },
  emptyStateTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyStateFeatures: {
    alignItems: 'center',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 69, 0, 0.1)',
    borderRadius: 12,
    minWidth: 200,
  },
  featureIcon: {
    fontSize: 18,
    marginRight: 12,
    lineHeight: 22,
    textAlign: 'center',
    includeFontPadding: false,
    width: 22,
  },
  content: {
    flex: 1,
  },
  quickOrderSection: {
    backgroundColor: colors.primary[50],
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    fontFamily: "DMSans-Bold"
  },
  quickOrderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  itemInfo: {
    flex: 1,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  addToCartButton: {
    marginTop: 16,
  },
  suggestionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  suggestionRow: {
    justifyContent: 'space-between',
  },
  suggestionCard: {
    flex: 0.32,
    marginBottom: 16,
  },
  suggestionItem: {
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
  },
  productImage: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.secondary[600],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 1,
  },
  discountBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  placeholder: {
    fontSize: 32,
  },
  productInfo: {
    marginBottom: 0,
  },
  priceRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  addButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  statsContent: {
    marginLeft: 12,
    flex: 1,
  },
});