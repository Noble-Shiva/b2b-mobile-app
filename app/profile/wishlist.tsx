import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ShoppingCart, Trash2, Heart } from 'lucide-react-native';
import { formatPrice, calculateDiscountedPrice } from '@/utils/helpers';
import { Text, BackButton } from '@/components/ui';
import { colors } from '@/utils/theme';
import { useSelector, useDispatch } from 'react-redux';
import { selectWishlistItems, removeFromWishlist, clearWishlist } from '@/store/wishlistSlice';
import { addToCart } from '@/store/cartSlice';
import { selectIsDark } from '@/store/themeSlice';

export default function WishlistScreen() {
  const router = useRouter();
  const isDark = useSelector(selectIsDark);
  
  const dispatch = useDispatch();
  const items = useSelector(selectWishlistItems);
  
  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };
  
  const handleAddToCart = (product: any) => {
    dispatch(addToCart(product));
    Alert.alert('Added to Cart', `${product.name} has been added to your cart.`);
  };
  
  const handleClearWishlist = () => {
    Alert.alert(
      "Clear Wishlist",
      "Are you sure you want to remove all items from your wishlist?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Clear", 
          onPress: () => dispatch(clearWishlist()),
          style: "destructive"
        }
      ]
    );
  };
  
  const handleRemoveItem = (id: string, name: string) => {
    Alert.alert(
      "Remove Item",
      `Are you sure you want to remove ${name} from your wishlist?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Remove", 
          onPress: () => dispatch(removeFromWishlist(id)),
          style: "destructive"
        }
      ]
    );
  };
  
  const renderWishlistItem = ({ item }: { item: any }) => {
    const discountedPrice = calculateDiscountedPrice(item.price, item.discount || 0);
    
    return (
      <TouchableOpacity 
        style={[
          styles.productCard, 
          { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
        ]} 
        onPress={() => handleProductPress(item.id)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        
        {item.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}% OFF</Text>
          </View>
        )}
        
        <View style={styles.productDetails}>
          <Text 
            variant="body"
            weight="medium"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          
          <View style={styles.priceContainer}>
            <Text variant="body" weight="semibold" color="accent">
              {formatPrice(discountedPrice)}
            </Text>
            
            {item.discount > 0 && (
              <Text variant="body-sm" color="tertiary" style={styles.originalPrice}>
                {formatPrice(item.price)}
              </Text>
            )}
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.addToCartButton, { backgroundColor: colors.primary[600] }]}
              onPress={() => handleAddToCart(item)}
            >
              <ShoppingCart size={16} color="#FFFFFF" />
              <Text variant="body-sm" weight="medium" color="inverse" style={styles.addToCartText}>
                Add to Cart
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.removeButton,
                { backgroundColor: isDark ? '#2A2A2A' : '#FFF0EB' }
              ]}
              onPress={() => handleRemoveItem(item.id, item.name)}
            >
              <Trash2 size={16} color={colors.primary[600]} />
            </TouchableOpacity>
          </View>
        </View>
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
        <BackButton />
        <Text variant="h4" weight="semibold">My Wishlist</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearWishlist}>
            <Text variant="body-sm" weight="medium" color="accent">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Heart size={80} color={isDark ? '#333333' : '#EEEEEE'} />
          <Text variant="h3" weight="bold" style={styles.emptyTitle}>
            Your wishlist is empty
          </Text>
          <Text variant="body" color="secondary" style={styles.emptyText}>
            Save items you like by tapping the heart icon on product pages.
          </Text>
          <TouchableOpacity 
            style={[styles.shopButton, { backgroundColor: colors.primary[600] }]}
            onPress={() => router.push('/(tabs)')}
          >
            <Text variant="body" weight="semibold" color="inverse">
              Start Shopping
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  productsList: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  productImage: {
    width: 100,
    height: 100,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF4500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },
  productDetails: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  addToCartText: {
    marginLeft: 4,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 24,
  },
  shopButton: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});