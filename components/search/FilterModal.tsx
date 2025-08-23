import { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import { X, Search } from 'lucide-react-native';
import { Text, Button } from '@/components/ui';
import { colors } from '@/utils/theme';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.3; // 30% of screen width

interface FilterItem {
  id: string;
  name: string;
  count: number;
  icon: string;
}

interface FilterCategory {
  id: string;
  name: string;
  items: FilterItem[];
}

interface FilterModalProps {
  visible: boolean;
  filters: {
    priceRange: [number, number];
    sortBy: string;
    inStock: boolean;
    selectedItems?: string[];
  };
  onClose: () => void;
  onApply: (filters: any) => void;
}

const filterCategories: FilterCategory[] = [
  {
    id: 'brand',
    name: 'Brand',
    items: [
      { id: 'organic-india', name: 'Organic India', count: 45, icon: '🌿' },
      { id: 'patanjali', name: 'Patanjali', count: 32, icon: '🕉️' },
      { id: 'himalaya', name: 'Himalaya', count: 28, icon: '🏔️' },
      { id: 'baidyanath', name: 'Baidyanath', count: 22, icon: '⚕️' },
      { id: 'dabur', name: 'Dabur', count: 18, icon: '🌱' },
    ]
  },
  {
    id: 'type',
    name: 'Type',
    items: [
      { id: 'tablets', name: 'Tablets', count: 45, icon: '💊' },
      { id: 'powder', name: 'Powder', count: 32, icon: '🥄' },
      { id: 'oil', name: 'Oil', count: 28, icon: '🫒' },
      { id: 'syrup', name: 'Syrup', count: 15, icon: '🍯' },
      { id: 'capsules', name: 'Capsules', count: 12, icon: '💊' },
    ]
  },
  {
    id: 'category',
    name: 'Category',
    items: [
      { id: 'immunity', name: 'Immunity Booster', count: 35, icon: '🛡️' },
      { id: 'digestive', name: 'Digestive Health', count: 28, icon: '🫃' },
      { id: 'skin-care', name: 'Skin Care', count: 25, icon: '✨' },
      { id: 'hair-care', name: 'Hair Care', count: 20, icon: '💇' },
      { id: 'pain-relief', name: 'Pain Relief', count: 18, icon: '🩹' },
    ]
  },
  {
    id: 'properties',
    name: 'Properties',
    items: [
      { id: 'organic', name: 'Organic', count: 42, icon: '🌱' },
      { id: 'natural', name: 'Natural', count: 38, icon: '🍃' },
      { id: 'herbal', name: 'Herbal', count: 35, icon: '🌿' },
      { id: 'ayurvedic', name: 'Ayurvedic', count: 30, icon: '🕉️' },
      { id: 'vegan', name: 'Vegan', count: 25, icon: '🥬' },
    ]
  },
];

export default function FilterModal({ visible, filters, onClose, onApply }: FilterModalProps) {
  const isDark = useSelector(selectIsDark);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('brand');
  const [searchText, setSearchText] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    if (visible) {
      setSelectedCategory('brand');
      setSearchText('');
      // Initialize with existing selected items from filters
      const existingItems = filters.selectedItems || [];
      setSelectedItems(new Set(existingItems));
    }
  }, [visible, filters.selectedItems]);

  const currentCategory = filterCategories.find(cat => cat.id === selectedCategory);
  const filteredItems = currentCategory?.items.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

  // Calculate selected items count for each category
  const getSelectedCountForCategory = (categoryId: string) => {
    const category = filterCategories.find(cat => cat.id === categoryId);
    if (!category) return 0;
    
    const categoryItemIds = category.items.map(item => item.id);
    return categoryItemIds.filter(itemId => selectedItems.has(itemId)).length;
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchText('');
  };

  const handleItemToggle = (itemId: string) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(itemId)) {
      newSelectedItems.delete(itemId);
    } else {
      newSelectedItems.add(itemId);
    }
    setSelectedItems(newSelectedItems);
  };

  const handleClearFilters = () => {
    setSelectedItems(new Set());
    setSearchText('');
  };

  const handleApply = () => {
    // Here you can process the selected items and apply them to filters
    const appliedFilters = {
      ...filters,
      selectedItems: Array.from(selectedItems),
    };
    onApply(appliedFilters);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContainer, 
          { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
        ]}>
          {/* Header */}
          <View style={[
            styles.modalHeader, 
            { borderBottomColor: isDark ? '#333333' : '#EEEEEE' }
          ]}>
            <Text variant="h4" weight="semibold">Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={isDark ? '#FFFFFF' : '#333333'} />
            </TouchableOpacity>
          </View>
          
          {/* Content */}
          <View style={styles.contentContainer}>
            {/* Left Sidebar */}
            <View style={[
              styles.sidebar,
              { 
                backgroundColor: isDark ? '#2A2A2A' : '#F8F8F8',
                borderRightColor: isDark ? '#333333' : '#EEEEEE'
              }
            ]}>
              <ScrollView showsVerticalScrollIndicator={false}>
                                 {filterCategories.map((category) => {
                   const selectedCount = getSelectedCountForCategory(category.id);
                   const isActive = selectedCategory === category.id;
                   
                   return (
                     <TouchableOpacity
                       key={category.id}
                       style={[
                         styles.categoryItem,
                         isActive && {
                           backgroundColor: isDark ? colors.primary[800] : colors.primary[50],
                           borderLeftColor: colors.primary[600],
                           borderLeftWidth: 3,
                         }
                       ]}
                       onPress={() => handleCategorySelect(category.id)}
                     >
                       <View style={styles.categoryContent}>
                         <Text
                           variant="body"
                           weight={isActive ? "semibold" : "medium"}
                           style={{
                             color: isActive 
                               ? colors.primary[600]
                               : (isDark ? '#FFFFFF' : '#374151')
                           }}
                         >
                           {category.name}
                         </Text>
                         {selectedCount > 0 && (
                           <View style={[
                             styles.countBadge,
                             { backgroundColor: colors.primary[600] }
                           ]}>
                             <Text style={styles.countText}>
                               {selectedCount}
                             </Text>
                           </View>
                         )}
                       </View>
                     </TouchableOpacity>
                   );
                 })}
              </ScrollView>
            </View>

            {/* Right Content */}
            <View style={styles.rightContent}>
              {/* Search Bar */}
              <View style={[
                styles.searchContainer,
                { 
                  backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
                  borderColor: isDark ? '#404040' : '#E0E0E0'
                }
              ]}>
                <Search size={20} color={isDark ? '#BBBBBB' : '#6B7280'} />
                <TextInput
                  style={[
                    styles.searchInput,
                    { color: isDark ? '#FFFFFF' : '#374151' }
                  ]}
                  placeholder="Search"
                  placeholderTextColor={isDark ? '#888888' : '#9CA3AF'}
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>

              {/* Items List */}
              <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
                {filteredItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.itemRow,
                      { borderBottomColor: isDark ? '#333333' : '#F0F0F0' }
                    ]}
                    onPress={() => handleItemToggle(item.id)}
                  >
                    <View style={styles.itemIcon}>
                      <Text style={styles.iconText}>{item.icon}</Text>
                    </View>
                    
                    <View style={styles.itemInfo}>
                      <Text
                        variant="body"
                        weight="medium"
                        style={{ color: isDark ? '#FFFFFF' : '#374151' }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        variant="body-sm"
                        style={{ color: isDark ? '#BBBBBB' : '#6B7280' }}
                      >
                        ({item.count})
                      </Text>
                    </View>

                    <View style={[
                      styles.checkbox,
                      { 
                        borderColor: selectedItems.has(item.id) 
                          ? colors.primary[600] 
                          : (isDark ? '#555555' : '#D1D5DB'),
                        backgroundColor: selectedItems.has(item.id) 
                          ? colors.primary[600] 
                          : 'transparent'
                      }
                    ]}>
                      {selectedItems.has(item.id) && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          
          {/* Footer */}
          <View style={[
            styles.modalFooter, 
            { borderTopColor: isDark ? '#333333' : '#EEEEEE' }
          ]}>
            <TouchableOpacity
              style={[
                styles.clearButton,
                { 
                  backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
                  borderColor: isDark ? '#404040' : '#E0E0E0'
                }
              ]}
              onPress={handleClearFilters}
            >
              <Text
                variant="body"
                weight="medium"
                style={{ color: isDark ? '#FFFFFF' : '#374151' }}
              >
                Clear filters
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.applyButton,
                { backgroundColor: colors.primary[600] }
              ]}
              onPress={handleApply}
            >
              <Text
                variant="body"
                weight="semibold"
                style={{ color: '#FFFFFF' }}
              >
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    maxHeight: '85%',
    height: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    borderRightWidth: 1,
  },
  categoryItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  categoryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rightContent: {
    flex: 1,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  itemsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
});