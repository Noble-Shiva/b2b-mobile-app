import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  TextInputProps,
  TouchableOpacity
} from 'react-native';
import { commonStyles } from '@/utils/theme';

import { Eye, EyeOff } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  helperStyle?: TextStyle;
  errorStyle?: TextStyle;
  secureTextEntry?: boolean;
}

export default function Input({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  containerStyle,
  labelStyle,
  inputStyle,
  helperStyle,
  errorStyle,
  secureTextEntry,
  ...props
}: InputProps) {
  const isDark = useSelector(selectIsDark);
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  // Determine if we should show the password toggle
  const showPasswordToggle = secureTextEntry;
  
  // Determine the right icon based on password visibility
  const renderRightIcon = () => {
    if (showPasswordToggle) {
      return (
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
          {isPasswordVisible ? (
            <EyeOff size={20} color={isDark ? '#999999' : '#666666'} />
          ) : (
            <Eye size={20} color={isDark ? '#999999' : '#666666'} />
          )}
        </TouchableOpacity>
      );
    }
    
    if (rightIcon) {
      return <View style={styles.iconContainer}>{rightIcon}</View>;
    }
    
    return null;
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[
          styles.label, 
          { color: isDark ? '#FFFFFF' : '#333333' }, 
          labelStyle
        ]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        { 
          backgroundColor: isDark ? '#2A2A2A' : '#F9F9F9',
          borderColor: error ? '#FF3B30' : isDark ? '#444444' : '#E0E0E0' 
        },
      ]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            { 
              color: isDark ? '#FFFFFF' : '#333333',
              flex: 1,
            },
            inputStyle
          ]}
          placeholderTextColor={isDark ? '#999999' : '#999999'}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />
        
        {renderRightIcon()}
      </View>
      
      {error ? (
        <Text style={[
          styles.error, 
          { color: '#FF3B30' }, 
          errorStyle
        ]}>
          {error}
        </Text>
      ) : helper ? (
        <Text style={[
          styles.helper, 
          { color: isDark ? '#999999' : '#666666' }, 
          helperStyle
        ]}>
          {helper}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: commonStyles.typography.fontFamily.medium,
    fontSize: commonStyles.typography.fontSize.sm,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: commonStyles.borderRadius.medium,
    height: 48,
    overflow: 'hidden',
  },
  input: {
    height: '100%',
    paddingHorizontal: 12,
    fontFamily: commonStyles.typography.fontFamily.regular,
    fontSize: commonStyles.typography.fontSize.md,
  },
  iconContainer: {
    paddingHorizontal: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helper: {
    fontFamily: commonStyles.typography.fontFamily.regular,
    fontSize: commonStyles.typography.fontSize.xs,
    marginTop: 4,
  },
  error: {
    fontFamily: commonStyles.typography.fontFamily.regular,
    fontSize: commonStyles.typography.fontSize.xs,
    marginTop: 4,
  },
});