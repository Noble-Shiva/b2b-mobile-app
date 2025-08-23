// Theme configuration for the QuickMart app
// This centralizes all color definitions for consistent styling

// Primary color palette - Blinkit-inspired green
export const colors = {
  // Brand colors - Blinkit green
  primary: {
    50: '#E6F9ED',
    100: '#C7F0D8',
    200: '#A3E6BE',
    300: '#7FDCA4',
    400: '#5BD28A',
    500: '#37C871', // Main primary color
    600: '#2EB062',
    700: '#259853', // Darker shade for contrast
    800: '#1C8045',
    900: '#136836',
  },
  
  // Secondary color - Yellow/Orange for promotions
  secondary: {
    50: '#FFF8E6',
    100: '#FFEFC0',
    200: '#FFE599',
    300: '#FFDB73',
    400: '#FFD14D',
    500: '#FFC726', // Main secondary color
    600: '#FFB800',
    700: '#E6A600',
    800: '#CC9300',
    900: '#B38000',
  },
  
  // Accent color - Purple for special features
  accent: {
    50: '#F5F0FF',
    100: '#E6D9FF',
    200: '#CCB3FF',
    300: '#B38CFF',
    400: '#9966FF',
    500: '#8040FF',
    600: '#6619FF',
    700: '#4D00FF',
    800: '#3D00CC',
    900: '#2E0099',
  },
  
  // Success color - Green
  success: {
    50: '#E6F9ED',
    100: '#C7F0D8',
    200: '#A3E6BE',
    300: '#7FDCA4',
    400: '#5BD28A',
    500: '#37C871',
    600: '#2EB062',
    700: '#259853',
    800: '#1C8045',
    900: '#136836',
  },
  
  // Warning color - Yellow/Orange
  warning: {
    50: '#FFFCF0',
    100: '#FFF8D9',
    200: '#FFF1B3',
    300: '#FFEA8C',
    400: '#FFE366',
    500: '#FFDC40',
    600: '#FFD119',
    700: '#F2C200',
    800: '#BF9900',
    900: '#8C7000',
  },
  
  // Error color - Red
  error: {
    50: '#FFF0F0',
    100: '#FFD9D9',
    200: '#FFB3B3',
    300: '#FF8C8C',
    400: '#FF6666',
    500: '#FF4040',
    600: '#FF1919',
    700: '#F20000',
    800: '#BF0000',
    900: '#8C0000',
  },
  
  // Neutral colors for text, backgrounds, etc.
  neutral: {
    50: '#F8F9FA',  // Light mode background
    100: '#F1F3F5',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#6C757D',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
    950: '#121212', // Dark mode background
  }
};

// Theme configuration for light mode
export const lightTheme = {
  // Text colors
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[700],
    tertiary: colors.neutral[600],
    inverse: colors.neutral[50],
    accent: colors.primary[700],
    error: colors.error[700],
    success: colors.success[700],
    warning: colors.warning[700],
  },
  
  // Background colors
  background: {
    primary: colors.neutral[50],
    secondary: '#FFFFFF',
    tertiary: colors.neutral[100],
    accent: colors.primary[50],
    card: '#FFFFFF',
    input: colors.neutral[100],
  },
  
  // Border colors
  border: {
    light: colors.neutral[200],
    medium: colors.neutral[300],
    dark: colors.neutral[400],
    accent: colors.primary[300],
  },
  
  // Button colors
  button: {
    primary: {
      background: colors.primary[600],
      text: '#FFFFFF',
      border: colors.primary[600],
    },
    secondary: {
      background: colors.primary[50],
      text: colors.primary[700],
      border: colors.primary[200],
    },
    success: {
      background: colors.success[600],
      text: '#FFFFFF',
      border: colors.success[600],
    },
    danger: {
      background: colors.error[600],
      text: '#FFFFFF',
      border: colors.error[600],
    },
    warning: {
      background: colors.warning[500],
      text: colors.neutral[800],
      border: colors.warning[500],
    },
    disabled: {
      background: colors.neutral[300],
      text: colors.neutral[500],
      border: colors.neutral[300],
    },
  },
  
  // Status colors
  status: {
    success: colors.success[600],
    error: colors.error[600],
    warning: colors.warning[500],
    info: colors.secondary[600],
  },
  
  // Icon colors
  icon: {
    primary: colors.neutral[800],
    secondary: colors.neutral[600],
    tertiary: colors.neutral[400],
    accent: colors.primary[700],
    inverse: '#FFFFFF',
  },
  
  // Shadow
  shadow: {
    color: 'rgba(0, 0, 0, 0.1)',
    colorStrong: 'rgba(0, 0, 0, 0.2)',
  },
};

// Theme configuration for dark mode
export const darkTheme = {
  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: colors.neutral[300],
    tertiary: colors.neutral[400],
    inverse: colors.neutral[800],
    accent: colors.primary[400],
    error: colors.error[400],
    success: colors.success[400],
    warning: colors.warning[400],
  },
  
  // Background colors
  background: {
    primary: colors.neutral[950],
    secondary: colors.neutral[900],
    tertiary: colors.neutral[800],
    accent: colors.primary[900],
    card: colors.neutral[900],
    input: colors.neutral[800],
  },
  
  // Border colors
  border: {
    light: colors.neutral[800],
    medium: colors.neutral[700],
    dark: colors.neutral[600],
    accent: colors.primary[700],
  },
  
  // Button colors
  button: {
    primary: {
      background: colors.primary[600],
      text: '#FFFFFF',
      border: colors.primary[600],
    },
    secondary: {
      background: colors.neutral[800],
      text: colors.primary[400],
      border: colors.primary[700],
    },
    success: {
      background: colors.success[700],
      text: '#FFFFFF',
      border: colors.success[700],
    },
    danger: {
      background: colors.error[700],
      text: '#FFFFFF',
      border: colors.error[700],
    },
    warning: {
      background: colors.warning[600],
      text: colors.neutral[900],
      border: colors.warning[600],
    },
    disabled: {
      background: colors.neutral[700],
      text: colors.neutral[500],
      border: colors.neutral[700],
    },
  },
  
  // Status colors
  status: {
    success: colors.success[500],
    error: colors.error[500],
    warning: colors.warning[400],
    info: colors.secondary[500],
  },
  
  // Icon colors
  icon: {
    primary: '#FFFFFF',
    secondary: colors.neutral[300],
    tertiary: colors.neutral[500],
    accent: colors.primary[400],
    inverse: colors.neutral[900],
  },
  
  // Shadow
  shadow: {
    color: 'rgba(0, 0, 0, 0.3)',
    colorStrong: 'rgba(0, 0, 0, 0.5)',
  },
};

// Helper function to get the current theme based on color scheme
export const getTheme = (isDark: boolean) => {
  return isDark ? darkTheme : lightTheme;
};

// Common styles that can be reused across components
export const commonStyles = {
  // Border radius
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    xl: 16,
    round: 9999,
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Typography
  typography: {
    fontFamily: {
      // Updated to DM Sans font family
      regular: 'DMSans-Regular',
      medium: 'DMSans-Medium',
      semiBold: 'DMSans-SemiBold',
      bold: 'DMSans-Bold',
    },
    fontSize: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 20,
      h1: 24,
      h2: 22,
      h3: 20,
      h4: 18,
    },
  },
  
  // Shadows
  shadows: {
    small: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    large: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};