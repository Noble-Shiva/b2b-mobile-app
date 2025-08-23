import React from 'react';
import { Text as RNText, StyleSheet, TextStyle, TextProps as RNTextProps } from 'react-native';
import { commonStyles } from '@/utils/theme';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';


type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-sm' | 'caption' | 'label';
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
type TextAlign = 'auto' | 'left' | 'right' | 'center' | 'justify';
type TextColor = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'error' | 'success' | 'warning' | 'inverse';

interface TextProps extends RNTextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  weight?: TextWeight;
  color?: TextColor;
  align?: TextAlign;
  style?: TextStyle;
  numberOfLines?: number;
}

export default function Text({
  children,
  variant = 'body',
  weight = 'regular',
  color = 'primary',
  align = 'auto',
  style,
  numberOfLines,
  ...props
}: TextProps) {
  const isDark = useSelector(selectIsDark);
  
  const getTextStyles = (): TextStyle => {
    let baseStyle: TextStyle = {
      textAlign: align,
    };
    
    // Variant styles
    switch (variant) {
      case 'h1':
        baseStyle = {
          ...baseStyle,
          fontSize: commonStyles.typography.fontSize.h1,
          lineHeight: commonStyles.typography.fontSize.h1 * 1.4,
        };
        break;
      case 'h2':
        baseStyle = {
          ...baseStyle,
          fontSize: commonStyles.typography.fontSize.h2,
          lineHeight: commonStyles.typography.fontSize.h2 * 1.4,
        };
        break;
      case 'h3':
        baseStyle = {
          ...baseStyle,
          fontSize: commonStyles.typography.fontSize.h3,
          lineHeight: commonStyles.typography.fontSize.h3 * 1.4,
        };
        break;
      case 'h4':
        baseStyle = {
          ...baseStyle,
          fontSize: commonStyles.typography.fontSize.h4,
          lineHeight: commonStyles.typography.fontSize.h4 * 1.4,
        };
        break;
      case 'body-sm':
        baseStyle = {
          ...baseStyle,
          fontSize: commonStyles.typography.fontSize.sm,
          lineHeight: commonStyles.typography.fontSize.sm * 1.5,
        };
        break;
      case 'caption':
        baseStyle = {
          ...baseStyle,
          fontSize: commonStyles.typography.fontSize.xs,
          lineHeight: commonStyles.typography.fontSize.xs * 1.5,
        };
        break;
      case 'label':
        baseStyle = {
          ...baseStyle,
          fontSize: commonStyles.typography.fontSize.sm,
          lineHeight: commonStyles.typography.fontSize.sm * 1.5,
        };
        break;
      case 'body':
      default:
        baseStyle = {
          ...baseStyle,
          fontSize: commonStyles.typography.fontSize.md,
          lineHeight: commonStyles.typography.fontSize.md * 1.5,
        };
        break;
    }
    
    // Weight styles
    switch (weight) {
      case 'medium':
        baseStyle = {
          ...baseStyle,
          fontFamily: commonStyles.typography.fontFamily.medium,
        };
        break;
      case 'semibold':
        baseStyle = {
          ...baseStyle,
          fontFamily: commonStyles.typography.fontFamily.semiBold,
        };
        break;
      case 'bold':
        baseStyle = {
          ...baseStyle,
          fontFamily: commonStyles.typography.fontFamily.bold,
        };
        break;
      case 'regular':
      default:
        baseStyle = {
          ...baseStyle,
          fontFamily: commonStyles.typography.fontFamily.regular,
        };
        break;
    }
    
    // Color styles
    switch (color) {
      case 'secondary':
        baseStyle = {
          ...baseStyle,
          color: isDark ? '#BBBBBB' : '#666666',
        };
        break;
      case 'tertiary':
        baseStyle = {
          ...baseStyle,
          color: isDark ? '#999999' : '#888888',
        };
        break;
      case 'accent':
        baseStyle = {
          ...baseStyle,
          color: '#37C871', // Using the primary color from Blinkit
        };
        break;
      case 'error':
        baseStyle = {
          ...baseStyle,
          color: '#FF3B30',
        };
        break;
      case 'success':
        baseStyle = {
          ...baseStyle,
          color: '#4CAF50',
        };
        break;
      case 'warning':
        baseStyle = {
          ...baseStyle,
          color: '#FF9500',
        };
        break;
      case 'inverse':
        baseStyle = {
          ...baseStyle,
          color: isDark ? '#333333' : '#FFFFFF',
        };
        break;
      case 'primary':
      default:
        baseStyle = {
          ...baseStyle,
          color: isDark ? '#FFFFFF' : '#333333',
        };
        break;
    }
    
    return baseStyle;
  };
  
  return (
    <RNText
      style={[getTextStyles(), style]}
      numberOfLines={numberOfLines}
      {...props}
    >
      {children}
    </RNText>
  );
}