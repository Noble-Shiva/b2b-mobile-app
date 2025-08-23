import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { Text } from '@/components/ui';
import CategoryCard from '@/components/home/CategoryCard';
import CategorySkeleton from '@/components/skeletons/CategorySkeleton';
import SectionHeaderSkeleton from '@/components/skeletons/SectionHeaderSkeleton';
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/models/category';

interface CategoryListProps {
  onCategoryPress: (categoryId: string) => void;
  useLocalData?: boolean;
}

export default function CategoryList({ onCategoryPress, useLocalData = false }: CategoryListProps) {
  const isDark = useSelector(selectIsDark);
  const { data: categories, isLoading, isError, error, refetch } = useCategories();
  
  // Show loading skeleton when fetching data
  if (isLoading) {
    return (
      <View style={styles.categoriesSection}>
        <SectionHeaderSkeleton />
        <CategorySkeleton />
      </View>
    );
  }
  
  // Handle error state
  if (isError) {
    return (
      <View style={styles.categoriesSection}>
        <View style={styles.sectionHeader}>
          <Text variant="h4" weight="semibold">Categories</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text variant="body" color="error">Failed to load categories</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text variant="body-sm" weight="medium" color="accent">Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Ensure we have data
  if (!categories || categories.length === 0) {
    return (
      <View style={styles.categoriesSection}>
        <View style={styles.sectionHeader}>
          <Text variant="h4" weight="semibold">Categories</Text>
        </View>
        <Text variant="body" style={styles.noDataText}>No categories available</Text>
      </View>
    );
  }

  return (
    <View style={styles.categoriesSection}>
      <View style={styles.sectionHeader}>
        <Text variant="h4" weight="semibold">Categories</Text>
        <TouchableOpacity onPress={() => onCategoryPress('')}>
          <Text variant="body-sm" weight="medium" color="accent">See All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CategoryCard 
            category={item} 
            onPress={() => onCategoryPress(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={refetch} 
            tintColor={isDark ? '#FFFFFF' : '#000000'}
          />
        }
        contentContainerStyle={styles.categoriesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesSection: {
    marginTop: 5,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoriesList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  retryButton: {
    marginLeft: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFF0EB',
    borderRadius: 4,
  },
  noDataText: {
    textAlign: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
});