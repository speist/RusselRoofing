# Russell Roofing & Exteriors - Website Style Guide

## Color Palette

### Primary Colors
- **Primary Burgundy** - #8B1538 (Core brand color from logo, used for primary CTAs and brand elements)
- **Primary Charcoal** - #2D2D2D (Professional dark tone for text and headers)

### Secondary Colors
- **Warm Gray** - #6B6B6B (Secondary text and subtle elements)
- **Light Warm Gray** - #F5F3F0 (Background tones with warmth)
- **Cream White** - #FAFAF8 (Clean surfaces and content areas)

### Accent Colors
- **Trust Blue** - #1E5F8E (For trust badges and certifications)
- **Success Green** - #2D7A3E (For success states and positive actions)
- **Alert Gold** - #D4A017 (For warranties and guarantees)

### Functional Colors
- **Error Red** - #D32F2F (For error states and required fields)
- **Info Blue** - #0288D1 (For informational messages)
- **Warning Orange** - #F57C00 (For warnings and cautions)
- **Disabled Gray** - #BDBDBD (For inactive elements)

### Background Colors
- **Background White** - #FFFFFF (Pure white for cards and content)
- **Background Light** - #FBFBF9 (Subtle off-white for main background)
- **Background Dark** - #1A1A1A (For dark sections and footer)

## Typography

### Font Family
- **Primary Font**: Inter (Modern, professional, excellent readability)
- **Secondary Font**: Playfair Display (For select headlines, adds craftsmanship feel)
- **System Fallback**: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Text Styles

#### Headings
- **H1**: 48px/56px, Bold, Letter spacing -0.02em
  - Mobile: 36px/44px
  - Used for hero headlines and major page titles
  
- **H2**: 36px/44px, Semibold, Letter spacing -0.01em
  - Mobile: 28px/36px
  - Used for section headers
  
- **H3**: 28px/36px, Semibold, Letter spacing -0.01em
  - Mobile: 24px/32px
  - Used for subsection headers
  
- **H4**: 24px/32px, Medium, Letter spacing 0
  - Mobile: 20px/28px
  - Used for card titles and feature headers

#### Body Text
- **Body Large**: 18px/28px, Regular, Letter spacing 0
  - Primary content and important descriptions
  
- **Body**: 16px/24px, Regular, Letter spacing 0
  - Standard text throughout the site
  
- **Body Small**: 14px/20px, Regular, Letter spacing 0.01em
  - Supporting text and metadata

#### Special Text
- **Lead Text**: 20px/32px, Regular, Letter spacing 0
  - Used for introductory paragraphs
  
- **Button Text**: 16px/24px, Semibold, Letter spacing 0.02em
  - All buttons and CTAs
  
- **Label Text**: 12px/16px, Medium, Letter spacing 0.03em, Uppercase
  - Form labels and small headings
  
- **Link Text**: Inherit size, Medium, Primary Burgundy (#8B1538)
  - Underline on hover

## Component Styling

### Buttons

#### Primary Button
- Background: Primary Burgundy (#8B1538)
- Text: White (#FFFFFF)
- Height: 52px
- Corner Radius: 6px
- Padding: 16px 32px
- Hover: Darken 10%, Shadow Y-offset 4px, Blur 12px, Opacity 15%
- Transition: All 200ms ease-out

#### Secondary Button
- Background: Transparent
- Border: 2px solid Primary Burgundy (#8B1538)
- Text: Primary Burgundy (#8B1538)
- Height: 52px
- Corner Radius: 6px
- Padding: 16px 32px
- Hover: Background Primary Burgundy, Text White

#### Ghost Button
- Background: Transparent
- Text: Primary Charcoal (#2D2D2D)
- Height: 48px
- Padding: 12px 24px
- Hover: Background Light Warm Gray (#F5F3F0)

### Cards

- Background: White (#FFFFFF)
- Shadow: Y-offset 4px, Blur 16px, Opacity 10%
- Corner Radius: 8px
- Padding: 24px
- Border: 1px solid rgba(0,0,0,0.05)
- Hover Shadow: Y-offset 8px, Blur 24px, Opacity 15%
- Transition: Shadow 200ms ease-out

### Input Fields

- Height: 48px
- Corner Radius: 6px
- Border: 1px solid #E0E0E0
- Background: White (#FFFFFF)
- Padding: 12px 16px
- Font Size: 16px
- Focus Border: 2px solid Primary Burgundy (#8B1538)
- Focus Shadow: 0 0 0 3px rgba(139, 21, 56, 0.1)
- Error Border: 2px solid Error Red (#D32F2F)
- Placeholder Color: Warm Gray (#6B6B6B)

### Icons

- Primary Icons: 24px × 24px
- Small Icons: 20px × 20px
- Large Icons: 32px × 32px
- Navigation Icons: 28px × 28px
- Interactive Icon Color: Primary Burgundy (#8B1538)
- Decorative Icon Color: Warm Gray (#6B6B6B)
- Icon Style: Outlined, 2px stroke weight

## Spacing System

- 4px - Micro spacing (icon to text)
- 8px - Tight spacing (within components)
- 16px - Small spacing (component padding)
- 24px - Default spacing (between related elements)
- 32px - Medium spacing (between sections)
- 48px - Large spacing (major section breaks)
- 64px - Extra large spacing (hero sections)
- 96px - Maximum spacing (page sections on desktop)

## Motion & Animation

### Transitions
- **Micro**: 150ms, ease-in-out (hover states, small interactions)
- **Standard**: 250ms, ease-out (most transitions)
- **Emphasis**: 350ms, cubic-bezier(0.4, 0, 0.2, 1) (page elements, modals)
- **Smooth**: 500ms, cubic-bezier(0.4, 0, 0.2, 1) (large reveals, parallax)

### Hover Effects
- Buttons: Scale(1.02) + shadow enhancement
- Cards: TranslateY(-2px) + shadow enhancement
- Images: Scale(1.05) with overflow hidden on container
- Links: Color transition + underline reveal

### Loading States
- Skeleton screens with pulse animation
- Circular progress indicators for actions
- Linear progress for multi-step processes

## Additional Design Elements

### Image Treatment
- Corner Radius: 8px for standalone images
- Aspect Ratios: 16:9 for hero, 4:3 for galleries, 1:1 for testimonials
- Overlay Gradient: Linear gradient (transparent to rgba(0,0,0,0.4)) for text overlays
- Hover: Subtle zoom (scale 1.05) with 350ms transition

### Forms
- Group related fields with 24px spacing
- Clear error messaging below fields
- Success states with Success Green (#2D7A3E)
- Progress indicators for multi-step forms
- Auto-save indication for estimate forms

### Trust Elements
- GAF Master Elite badge prominently displayed
- Star ratings in Alert Gold (#D4A017)
- Review cards with subtle drop shadows
- Certification badges with Trust Blue (#1E5F8E) accents

### Mobile Adaptations
- Touch targets minimum 44px × 44px
- Increased padding on mobile (minimum 16px)
- Sticky CTA bar for instant estimates
- Hamburger menu with slide-out navigation
- Thumb-friendly button placement in bottom 25% of screen

### Dark Mode Variants
- Dark Background: #1A1A1A (primary dark background)
- Dark Surface: #2D2D2D (card backgrounds)
- Dark Burgundy: #A03050 (adjusted for contrast)
- Dark Text Primary: #F5F5F5
- Dark Text Secondary: #B0B0B0
- Dark Border: rgba(255,255,255,0.1)

## Hero Video Specifications

### Video Treatment
- **Aspect Ratio**: 16:9 (responsive scaling)
- **Overlay**: Linear gradient rgba(0,0,0,0.3) to rgba(0,0,0,0.5) from top to bottom
- **Text Contrast**: Ensure WCAG AA compliance with overlay
- **Fallback**: Static image for mobile/reduced motion preferences
- **Loading**: Blur-up technique with low-quality placeholder

### Video Controls
- Autoplay: Yes (muted, as per browser requirements)
- Loop: Yes
- Controls: Hidden (ambient video)
- Play/Pause Toggle: Optional icon button, bottom right
- Icon Style: 48px circle, rgba(255,255,255,0.2) background
- Icon Hover: rgba(255,255,255,0.3) background

### Performance Guidelines
- Max file size: 8MB for hero video
- Format: MP4 (H.264) with WebM fallback
- Resolution: 1920×1080 max, with responsive variants
- Mobile: Static image or 3-second video loop
- Loading priority: Lazy load after initial content paint

### Content Overlay Styling
- Text Shadow: 0 2px 4px rgba(0,0,0,0.3)
- CTA Buttons: Primary style with subtle shadow for depth
- Headline: H1 style in White (#FFFFFF)
- Subheadline: Body Large in Cream White (#FAFAF8)