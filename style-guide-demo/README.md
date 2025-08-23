# React Native Style Guide Demo

A comprehensive HTML/CSS/JavaScript demo showcasing all the components and styles from the React Native Mobile Application Style Guide.

## Features

### 🎨 Visual Components
- **Typography**: All heading levels, body text, and captions
- **Color Palette**: Light and dark mode color swatches
- **Buttons**: Primary, secondary, and disabled states
- **Inputs & Forms**: Text inputs, email inputs, and textareas
- **Cards**: Product cards and order cards with images
- **Badges & Tags**: Status indicators and notification badges
- **Navigation**: Tab navigation and bottom navigation
- **Modals**: Interactive modal with proper accessibility
- **Spacing**: Visual demonstration of the spacing scale

### 🌙 Dark Mode Support
- Toggle between light and dark themes
- Automatic theme persistence in localStorage
- Smooth transitions between themes
- All components adapt to theme changes

### 📱 Mobile-First Design
- Centered mobile frame (375x812px) on desktop
- Responsive design that works on actual mobile devices
- Touch gestures support (swipe to close modal)
- Native-like status bar and navigation

### ♿ Accessibility Features
- Keyboard navigation support
- Focus indicators for all interactive elements
- ARIA labels and roles
- Screen reader friendly
- High contrast mode support
- Reduced motion support

### 🎯 Interactive Elements
- Ripple effects on buttons and navigation items
- Loading states simulation
- Form validation with visual feedback
- Modal with backdrop and escape key support
- Smooth scrolling navigation

## Usage

1. **Open the demo**: Simply open `index.html` in your web browser
2. **Toggle theme**: Click the moon/sun icon in the top-right corner
3. **Test interactions**: Click buttons, navigate tabs, fill forms
4. **Open modal**: Click "Show Modal" button to see modal implementation
5. **Keyboard navigation**: Use Tab, Enter, and Escape keys to navigate

## File Structure

```
style-guide-demo/
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS implementation
├── script.js           # Interactive functionality
└── README.md          # This file
```

## Technical Implementation

### CSS Features
- CSS Custom Properties (CSS Variables) for theming
- Flexbox and Grid layouts
- Smooth transitions and animations
- Media queries for responsive design
- Accessibility-focused styling

### JavaScript Features
- Theme management with localStorage
- Modal control with proper focus management
- Touch gesture recognition
- Form validation
- Performance monitoring
- Accessibility enhancements

### Design System
- **Spacing Scale**: 4, 8, 12, 16, 24, 32, 40, 48px
- **Typography**: Poppins font family with proper hierarchy
- **Colors**: Comprehensive light/dark mode palette
- **Shadows**: Subtle elevation system
- **Border Radius**: Consistent rounded corners

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

## Development Notes

This demo translates React Native concepts to web technologies:
- `dp` units become `px` in CSS
- React Native components become semantic HTML elements
- Platform-specific styling is handled through CSS
- Touch interactions are implemented with JavaScript

## Customization

To customize the demo:
1. Edit CSS variables in `:root` for light mode colors
2. Edit `[data-theme="dark"]` for dark mode colors
3. Modify spacing scale variables
4. Update typography variables
5. Add new components following the existing patterns

## Performance

The demo is optimized for performance:
- Minimal JavaScript footprint
- CSS animations use hardware acceleration
- Efficient event handling
- Progressive enhancement approach

---

**Note**: This is a demonstration of the React Native Style Guide translated to web technologies. For actual React Native development, use the original style guide components and patterns. 