import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { commonStyles } from '@/utils/theme';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { colors } from '@/utils/theme';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  count?: number;
  dot?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Badge({
  children,
  variant = 'primary',
  size = 'medium',
  count,
  dot = false,
  style,
  textStyle,
}: BadgeProps) {
  const isDark = useSelector(selectIsDark);
  
  const getBadgeStyles = (): ViewStyle => {
    let baseStyle: ViewStyle = {
      borderRadius: commonStyles.borderRadius.round,
      alignItems: 'center',
      justifyContent: 'center',
    };
    
    // Size styles
    if (dot) {
      switch (size) {
        case 'small':
          baseStyle = {
            ...baseStyle,
            width: 6,
            height: 6,
          };
          break;
        case 'large':
          baseStyle = {
            ...baseStyle,
            width: 12,
            height: 12,
          };
          break;
        case 'medium':
        default:
          baseStyle = {
            ...baseStyle,
            width: 8,
            height: 8,
          };
          break;
      }
    } else {
      switch (size) {
        case 'small':
          baseStyle = {
            ...baseStyle,
            paddingHorizontal: 6,
            paddingVertical: 2,
            minWidth: 16,
            height: 16,
          };
          break;
        case 'large':
          baseStyle = {
            ...baseStyle,
            paddingHorizontal: 10,
            paddingVertical: 4,
            minWidth: 24,
            height: 24,
          };
          break;
        case 'medium':
        default:
          baseStyle = {
            ...baseStyle,
            paddingHorizontal: 8,
            paddingVertical: 3,
            minWidth: 20,
            height: 20,
          };
          break;
      }
    }
    
    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle = {
          ...baseStyle,
          backgroundColor: colors.secondary[500],
        };
        break;
      case 'success':
        baseStyle = {
          ...baseStyle,
          backgroundColor: colors.success[500],
        };
        break;
      case 'error':
        baseStyle = {
          ...baseStyle,
          backgroundColor: colors.error[500],
        };
        break;
      case 'warning':
        baseStyle = {
          ...baseStyle,
          backgroundColor: colors.warning[500],
        };
        break;
      case 'info':
        baseStyle = {
          ...baseStyle,
          backgroundColor: colors.secondary[500],
        };
        break;
      case 'neutral':
        baseStyle = {
          ...baseStyle,
          backgroundColor: colors.neutral[500],
        };
        break;
      case 'primary':
      default:
        baseStyle = {
          ...baseStyle,
          backgroundColor: colors.primary[600],
        };
        break;
    }
    
    return baseStyle;
  };
  
  const getTextStyles = (): TextStyle => {
    let baseStyle: TextStyle = {
      color: '#FFFFFF',
      textAlign: 'center',
    };
    
    // Size styles
    switch (size) {
      case 'small':
        baseStyle = {
          ...baseStyle,
          fontSize: 10,
          fontFamily: commonStyles.typography.fontFamily.bold,
        };
        break;
      case 'large':
        baseStyle = {
          ...baseStyle,
          fontSize: 14,
          fontFamily: commonStyles.typography.fontFamily.bold,
        };
        break;
      case 'medium':
      default:
        baseStyle = {
          ...baseStyle,
          fontSize: 12,
          fontFamily: commonStyles.typography.fontFamily.bold,
        };
        break;
    }
    
    return baseStyle;
  };
  
  // If it's just a dot, render a simple view
  if (dot) {
    return <View style={[getBadgeStyles(), style]} />;
  }
  
  // If there's a count, render the count
  if (count !== undefined) {
    const displayCount = count > 99 ? '99+' : count.toString();
    return (
      <View style={[getBadgeStyles(), style]}>
        <Text style={[getTextStyles(), textStyle]}>{displayCount}</Text>
      </View>
    );
  }
  
  // Otherwise, render children
  return (
    <View style={[getBadgeStyles(), style]}>
      {typeof children === 'string' ? (
        <Text style={[getTextStyles(), textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}