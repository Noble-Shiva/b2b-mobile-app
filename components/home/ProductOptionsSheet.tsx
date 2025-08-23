import React from 'react';
import { 
  View, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import { X, Minus, Plus } from 'lucide-react-native';

import { Text } from '@/components/ui';
import { formatPrice } from '@/utils/helpers';
import { selectIsDark } from '@/store/themeSlice';
import { useSelector } from 'react-redux';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  discountedPrice: number;
  originalPrice: number;
  discount: number;
  quantity: string;
  inStock: boolean;
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface ProductOptionsSheetProps {
  visible: boolean;
  onClose: () => void;
  product: Product;
  variants: ProductVariant[];
  onSelectVariant: (variant: ProductVariant) => void;
  selectedVariantId?: string;
  itemQuantity?: number;
  onUpdateQuantity?: (variantId: string, quantity: number) => void;
}

export default function ProductOptionsSheet({
  visible,
  onClose,
  product,
  variants,
  onSelectVariant,
  selectedVariantId,
  itemQuantity = 0,
  onUpdateQuantity
}: ProductOptionsSheetProps) {
  const isDark = useSelector(selectIsDark);
  
  const handleQuantityChange = (variant: ProductVariant, change: number) => {
    if (onUpdateQuantity) {
      const newQuantity = Math.max(0, (itemQuantity || 0) + change);
      onUpdateQuantity(variant.id, newQuantity);
    }
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      
      <View 
        style={[
          styles.bottomSheet,
          { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
        ]}
      >
        <View style={styles.handle} />
        
        <View style={styles.header}>
          <Text variant="h4" weight="semibold">{product.name}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={isDark ? '#FFFFFF' : '#333333'} />
          </TouchableOpacity>
        </View>
        
        <Text variant="body" style={styles.selectText}>Select unit</Text>
        
        <ScrollView style={styles.variantsContainer}>
          {variants.map((variant) => {
            const isSelected = variant.id === selectedVariantId;
            const variantQuantity = isSelected ? itemQuantity : 0;
            
            return (
              <View 
                key={variant.id} 
                style={[
                  styles.variantItem,
                  { 
                    borderBottomColor: isDark ? '#333333' : '#F0F0F0',
                    backgroundColor: isSelected 
                      ? (isDark ? '#2A1A10' : '#FFF0EB') 
                      : 'transparent'
                  }
                ]}
              >
                <View style={styles.variantLeft}>
                  {variant.discount > 0 && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{variant.discount}% OFF</Text>
                    </View>
                  )}
                  
                  <Image 
                    source={{ uri: product.image }} 
                    style={styles.variantImage} 
                  />
                  
                  <View style={styles.variantInfo}>
                    <Text variant="body" weight="medium">{variant.name}</Text>
                    
                    <View style={styles.priceContainer}>
                      <Text variant="body" weight="semibold">
                        {formatPrice(variant.discountedPrice)}
                      </Text>
                      
                      {variant.discount > 0 && (
                        <Text 
                          variant="body-sm" 
                          color="tertiary" 
                          style={styles.originalPrice}
                        >
                          {formatPrice(variant.originalPrice)}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
                
                {variantQuantity > 0 ? (
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(variant, -1)}
                    >
                      <Minus size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                    
                    <Text variant="body-sm" weight="semibold" style={styles.quantityText}>
                      {variantQuantity}
                    </Text>
                    
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => handleQuantityChange(variant, 1)}
                    >
                      <Plus size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => onSelectVariant(variant)}
                  >
                    <Text variant="body-sm" weight="semibold" color="inverse">
                      ADD
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#CCCCCC',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectText: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  variantsContainer: {
    paddingHorizontal: 20,
  },
  variantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  variantLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#0066FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontFamily: 'Poppins-Bold',
  },
  variantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  variantInfo: {
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: '#37C871',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#37C871',
    borderRadius: 8,
    paddingHorizontal: 4,
    height: 36,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: '#FFFFFF',
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
});