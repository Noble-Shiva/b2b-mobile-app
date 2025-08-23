# E-Commerce Application Style Guide

---

## 1. Branding

### Logo Usage
- Use the primary logo on light backgrounds.
- Use the inverted logo on dark backgrounds.
- Maintain clear space around the logo (at least 16px).
- Minimum logo size: 32x32px.

### Brand Colors
- Use only approved brand colors (see Color Palette).

### Typography
- Use the designated font family for all text.

### Iconography
- Use outlined icons for actions, filled icons for status.
- Maintain consistent icon size (e.g., 24x24px).

---

## 2. Color Palette

| Name         | Hex      | Usage                |
|--------------|----------|----------------------|
| Primary      | #1A73E8  | Buttons, links       |
| Secondary    | #F9AB00  | Highlights, badges   |
| Accent       | #34A853  | Success, active      |
| Error        | #EA4335  | Errors, alerts       |
| Background   | #FFFFFF  | App background       |
| Surface      | #F5F5F5  | Cards, modals        |
| Text Primary | #222222  | Main text            |
| Text Muted   | #757575  | Secondary text       |
| Border       | #E0E0E0  | Dividers, outlines   |

**Usage Guidelines:**
- Use primary color for main actions.
- Use accent color for positive actions.
- Maintain sufficient contrast for accessibility.

---

## 3. Typography

| Style     | Font Family     | Weight | Size   | Usage           |
|-----------|-----------------|--------|--------|-----------------|
| Heading 1 | Poppins         | Bold   | 32px   | Page titles     |
| Heading 2 | Poppins         | Medium | 24px   | Section titles  |
| Heading 3 | Poppins         | Medium | 18px   | Subsections     |
| Body      | Poppins         | Normal | 16px   | Main content    |
| Caption   | Poppins         | Normal | 12px   | Hints, labels   |

**Example:**
```css
.heading1 {
  font-family: 'Poppins', sans-serif;
  font-size: 32px;
  font-weight: 700;
}
```

---

## 4. Spacing & Layout

- **Grid System:** 4/8/12 column grid for responsive layouts.
- **Spacing Scale:** 4, 8, 12, 16, 24, 32, 40, 48px.
- **Margins/Paddings:** Use multiples of 8px for consistency.
- **Breakpoints:**
  - Mobile: ≤600px
  - Tablet: 601–1024px
  - Desktop: >1024px

**Example:**
```css
.card {
  padding: 16px;
  margin-bottom: 24px;
}
```

---

## 5. Components

### Buttons
- **Primary:** Solid, uses primary color.
- **Secondary:** Outlined, uses border color.
- **Disabled:** Muted color, no shadow.

```jsx
<Button type="primary" disabled={false}>Add to Cart</Button>
<Button type="secondary">View Details</Button>
<Button disabled>Disabled</Button>
```

### Inputs & Forms
- Rounded corners (4px radius)
- Clear focus state (border color: primary)

```jsx
<Input placeholder="Search products..." />
```

### Cards
- Use for products, categories, orders.
- Shadow: subtle (e.g., box-shadow: 0 2px 8px #00000014)

### Badges/Tags
- Use secondary or accent color backgrounds.

### Navigation
- Bottom tab for mobile, sidebar for desktop.

### Modals/Sheets
- Rounded top corners, drop shadow, surface color.

---

## 6. Imagery

- **Product Images:** 1:1 aspect ratio, min 300x300px.
- **Banners:** 16:9 aspect ratio.
- **Icons:** SVG or PNG, 24x24px.

**Usage Guidelines:**
- Use high-resolution images.
- Avoid text in images.

---

## 7. Animations

- Use spring animations for transitions (e.g., category selection, modal open/close).
- Loading skeletons for data fetches.
- Button tap: scale down 95% then up.

**Example:**
```js
import Animated, { Easing } from 'react-native-reanimated';
// ...
<Animated.View entering={FadeIn.springify()} />
```

---

## 8. Accessibility

- Ensure color contrast ratio ≥ 4.5:1 for text.
- All interactive elements must be focusable.
- Use ARIA labels for icons and buttons.
- Provide alt text for all images.

---

## 9. Do’s and Don’ts

**Do:**
- Use consistent spacing and colors.
- Use semantic HTML/JSX elements.
- Test on multiple devices.

**Don’t:**
- Use unapproved colors or fonts.
- Overuse shadows or gradients.
- Place text over busy images.

---

## 10. Sample Screens

### Home
- Banner carousel, featured products, categories grid.

### Product
- Image gallery, price, add to cart, reviews.

### Cart
- List of items, quantity controls, total price.

### Checkout
- Address selection, payment method, order summary.

### Profile
- Order history, wishlist, account settings.

---

## Appendix

- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [Material Design Guidelines](https://m3.material.io/)
- [React Native Styling](https://reactnative.dev/docs/style) 