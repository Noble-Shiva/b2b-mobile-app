import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { commonStyles } from '@/utils/theme';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';


interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export default function Card({ 
  children, 
  style, 
  variant = 'default',
  padding = 'medium'
}: CardProps) {
  const isDark = useSelector(selectIsDark);
  
  const getCardStyles = (): ViewStyle => {
    let baseStyle: ViewStyle = {
      backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
      borderRadius: commonStyles.borderRadius.large,
      overflow: 'hidden',
    };
    
    // Variant styles
    switch (variant) {
      case 'elevated':
        baseStyle = {
          ...baseStyle,
          ...commonStyles.shadows.medium,
          shadowColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
        };
        break;
      case 'outlined':
        baseStyle = {
          ...baseStyle,
          borderWidth: 1,
          borderColor: isDark ? '#333333' : '#EEEEEE',
        };
        break;
      case 'default':
      default:
        baseStyle = {
          ...baseStyle,
          ...commonStyles.shadows.small,
          shadowColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
        };
        break;
    }
    
    // Padding styles
    switch (padding) {
      case 'none':
        break;
      case 'small':
        baseStyle = {
          ...baseStyle,
          padding: commonStyles.spacing.sm,
        };
        break;
      case 'large':
        baseStyle = {
          ...baseStyle,
          padding: commonStyles.spacing.lg,
        };
        break;
      case 'medium':
      default:
        baseStyle = {
          ...baseStyle,
          padding: commonStyles.spacing.md,
        };
        break;
    }
    
    return baseStyle;
  };
  
  return (
    <View style={[getCardStyles(), style]}>
      {children}
    </View>
  );
}