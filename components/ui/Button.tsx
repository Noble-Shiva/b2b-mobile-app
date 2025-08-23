import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle, 
  TouchableOpacityProps,
  View
} from 'react-native';
import { commonStyles } from '@/utils/theme';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { colors } from '@/utils/theme';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  ...props
}: ButtonProps) {
  const isDark = useSelector(selectIsDark);
  
  // Determine button styles based on variant and size
  const getButtonStyles = (): ViewStyle => {
    let baseStyle: ViewStyle = {
      borderRadius: commonStyles.borderRadius.medium,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    };
    
    // Size styles
    switch (size) {
      case 'small':
        baseStyle = {
          ...baseStyle,
          paddingVertical: 8,
          paddingHorizontal: 12,
        };
        break;
      case 'large':
        baseStyle = {
          ...baseStyle,
          paddingVertical: 16,
          paddingHorizontal: 24,
        };
        break;
      case 'medium':
      default:
        baseStyle = {
          ...baseStyle,
          paddingVertical: 12,
          paddingHorizontal: 16,
        };
        break;
    }
    
    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle = {
          ...baseStyle,
          backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
          borderWidth: 1,
          borderColor: isDark ? '#444444' : '#E0E0E0',
        };
        break;
      case 'success':
        baseStyle = {
          ...baseStyle,
          backgroundColor: colors.success[600],
        };
        break;
      case 'danger':
        baseStyle = {
          ...baseStyle,
          backgroundColor: colors.error[600],
        };
        break;
      case 'warning':
        baseStyle = {
          ...baseStyle,
          backgroundColor: colors.warning[500],
        };
        break;
      case 'outline':
        baseStyle = {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primary[600],
        };
        break;
      case 'ghost':
        baseStyle = {
          ...baseStyle,
          backgroundColor: 'transparent',
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
    
    // Disabled state
    if (disabled || isLoading) {
      baseStyle = {
        ...baseStyle,
        backgroundColor: isDark ? '#444444' : '#CCCCCC',
        borderColor: isDark ? '#555555' : '#DDDDDD',
      };
    }
    
    // Full width
    if (fullWidth) {
      baseStyle = {
        ...baseStyle,
        width: '100%',
      };
    }
    
    return baseStyle;
  };
  
  // Determine text styles based on variant and size
  const getTextStyles = (): TextStyle => {
    let baseStyle: TextStyle = {
      fontFamily: commonStyles.typography.fontFamily.semiBold,
    };
    
    // Size styles
    switch (size) {
      case 'small':
        baseStyle = {
          ...baseStyle,
          fontSize: commonStyles.typography.fontSize.sm,
        };
        break;
      case 'large':
        baseStyle = {
          ...baseStyle,
          fontSize: commonStyles.typography.fontSize.lg,
        };
        break;
      case 'medium':
      default:
        baseStyle = {
          ...baseStyle,
          fontSize: commonStyles.typography.fontSize.md,
        };
        break;
    }
    
    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle = {
          ...baseStyle,
          color: isDark ? '#FFFFFF' : '#333333',
        };
        break;
      case 'success':
      case 'danger':
      case 'warning':
      case 'primary':
        baseStyle = {
          ...baseStyle,
          color: '#FFFFFF',
        };
        break;
      case 'outline':
      case 'ghost':
        baseStyle = {
          ...baseStyle,
          color: colors.primary[600],
        };
        break;
      default:
        baseStyle = {
          ...baseStyle,
          color: '#FFFFFF',
        };
        break;
    }
    
    // Disabled state
    if (disabled || isLoading) {
      baseStyle = {
        ...baseStyle,
        color: isDark ? '#999999' : '#888888',
      };
    }
    
    return baseStyle;
  };
  
  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={getTextStyles().color as string} 
          style={styles.loader} 
        />
      ) : (
        <>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={[getTextStyles(), textStyle]}>
            {children}
          </Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  loader: {
    marginRight: 8,
  },
});