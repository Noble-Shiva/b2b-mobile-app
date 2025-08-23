# B2B App Mobile Style Guide

## 1. Color Palette

### Brand Colors
- **Primary (Green):**
  - 50: #E6F9ED
  - 100: #C7F0D8
  - 200: #A3E6BE
  - 300: #7FDCA4
  - 400: #5BD28A
  - 500: #37C871 (Main)
  - 600: #2EB062
  - 700: #259853
  - 800: #1C8045
  - 900: #136836
- **Secondary (Yellow/Orange):**
  - 50: #FFF8E6
  - 100: #FFEFC0
  - 200: #FFE599
  - 300: #FFDB73
  - 400: #FFD14D
  - 500: #FFC726 (Main)
  - 600: #FFB800
  - 700: #E6A600
  - 800: #CC9300
  - 900: #B38000
- **Accent (Purple):**
  - 50: #F5F0FF
  - 100: #E6D9FF
  - 200: #CCB3FF
  - 300: #B38CFF
  - 400: #9966FF
  - 500: #8040FF
  - 600: #6619FF
  - 700: #4D00FF
  - 800: #3D00CC
  - 900: #2E0099
- **Success:** #37C871
- **Warning:** #FFDC40
- **Error:** #FF4040
- **Neutral:**
  - 50: #F8F9FA (Light BG)
  - 100: #F1F3F5
  - 200: #E9ECEF
  - 300: #DEE2E6
  - 400: #CED4DA
  - 500: #ADB5BD
  - 600: #6C757D
  - 700: #495057
  - 800: #343A40
  - 900: #212529
  - 950: #121212 (Dark BG)

### Usage
- Use `primary` for main actions, highlights, and brand elements.
- Use `secondary` for promotions, highlights, and secondary actions.
- Use `accent` for special features or highlights.
- Use `neutral` for backgrounds, borders, and text.
- Use `success`, `warning`, `error` for status and feedback.

## 2. Typography

### Font Family
- **Poppins-Regular**
- **Poppins-Medium**
- **Poppins-SemiBold**
- **Poppins-Bold**

### Font Sizes
| Name   | Value (px) |
|--------|------------|
| xs     | 10         |
| sm     | 12         |
| md     | 14         |
| lg     | 16         |
| xl     | 18         |
| xxl    | 20         |
| h1     | 24         |
| h2     | 22         |
| h3     | 20         |
| h4     | 18         |

### Text Weights
- **regular**: Poppins-Regular
- **medium**: Poppins-Medium
- **semibold**: Poppins-SemiBold
- **bold**: Poppins-Bold

### Text Variants
- h1, h2, h3, h4
- body, body-sm, caption, label

### Text Colors
- primary, secondary, tertiary, accent, error, success, warning, inverse

## 3. Border Radius
| Name   | Value (px) |
|--------|------------|
| small  | 4          |
| medium | 8          |
| large  | 12         |
| xl     | 16         |
| round  | 9999       |

## 4. Spacing System
| Name   | Value (px) |
|--------|------------|
| xs     | 4          |
| sm     | 8          |
| md     | 16         |
| lg     | 24         |
| xl     | 32         |
| xxl    | 48         |

## 5. Button Styles
- **Primary:** Green background, white text, rounded corners (8px or 12px), bold/semibold font.
- **Secondary:** Light green or white background, green text, border.
- **Danger/Warning/Success:** Use respective color backgrounds.
- **Disabled:** Neutral background, muted text.
- **Sizes:** Small (12px), Medium (14px), Large (16px) font.
- **Padding:** Vertical 12-16px, Horizontal 24px (typical).

## 6. Badge Styles
- Font: Poppins-Bold
- Font size: 10 (small), 12 (medium), 14 (large)
- Colors: Use variant backgrounds (primary, secondary, success, error, warning, info, neutral)
- Border radius: 12px (pill)

## 7. Input Styles
- Font: Poppins-Regular
- Font size: 14-16px
- Border radius: 8px (medium)
- Padding: 12-16px
- Background: #F9F9F9 (light), #2A2A2A (dark)
- Border: 1px solid neutral

## 8. Card & Surface Styles
- Background: #FFFFFF (light), #1E1E1E (dark)
- Border radius: 12px (large)
- Shadow: small/medium/large as per commonStyles.shadows
- Padding: 16px (typical)

## 9. Layout & Container
- Use flex layouts for responsiveness.
- Padding: 16px or 24px for main containers.
- Section spacing: 16px or 24px between sections.
- Use consistent margin and padding from spacing system.

## 10. Shadows
- Use commonStyles.shadows (small, medium, large) for elevation.

## 11. Iconography
- Use Lucide icons, size 20-24px for most UI elements.
- Icon color: inherit from text or use accent/primary.

## 12. Animation
- Use react-native-reanimated for transitions.
- Use spring or fade-in for card/list transitions.

## 13. Known Inconsistencies (To Fix)
- Font sizes and weights are sometimes inconsistent across screens (e.g., headings, captions).
- Border radius varies (8px, 12px, 16px) in some places—standardize to 12px for cards, 8px for buttons/inputs.
- Button padding and font size sometimes differ—use the system above.
- Some text uses system font instead of Poppins—ensure all use Poppins.
- Spacing between sections and elements is not always consistent—use spacing system.

## 14. Best Practices
- Always use theme and commonStyles for colors, spacing, radius, and typography.
- Never hardcode colors, font sizes, or font families in components—use the style guide.
- Use variants and weights for text as defined above.
- Use consistent padding and margin for all containers and cards.
- Prefer flex layouts for responsiveness.
- Use semantic naming for styles and variables.
- Document any new style or component in this guide.

---

**All new components, screens, and features must adhere to this style guide.**

If you find a discrepancy, update this document and refactor the codebase for consistency. 