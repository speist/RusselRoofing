# Russell Roofing & Exteriors - Feature State Design Brief

## Lead Capture & Conversion System

### Instant Estimate Form
#### Initial Load State
* Hero section with video background (overlay: linear gradient rgba(0,0,0,0.3) to rgba(0,0,0,0.5))
* Floating CTA button "Get Instant Estimate" (#8B1538 background, white text, 52px height)
* Progress indicator showing 3 dots in Light Warm Gray (#F5F3F0) - unfilled state
* Trust badges (GAF Master Elite, BBB) positioned top right with subtle fade-in animation (350ms)
* Form container: white (#FFFFFF) card with shadow (Y-offset 4px, Blur 16px, Opacity 10%)
* Loading skeleton screens briefly visible (pulse animation) before content renders
* Auto-detection script running in background checking for returning visitor cookies

#### Step 1: Property Information State
* Progress dot 1 transitions to Primary Burgundy (#8B1538) with scale(1.2) animation
* Large visual cards for property type selection (Single Family, Multi-Family, Commercial)
* Each card: 200px height, 8px radius, hover state with translateY(-4px) and enhanced shadow
* Icons: 48px, Primary Burgundy stroke, animates to filled on selection
* Selected card: Primary Burgundy border (2px), subtle background tint (#8B1538 at 5% opacity)
* Address input field appears with smooth height animation (250ms ease-out)
* Google Places autocomplete with custom styling (dropdown shadow, 6px radius)
* "Continue" button disabled state (#BDBDBD) until selection made
* Mobile: Cards stack vertically with 16px spacing, full width minus 32px padding

#### Step 2: Project Details State
* Smooth slide transition from Step 1 (300ms cubic-bezier)
* Service selection grid: 3 columns desktop, 2 columns tablet, 1 column mobile
* Service cards with hover preview images (scale 1.05 on hover, 350ms transition)
* Checkboxes custom styled: Primary Burgundy when checked with checkmark animation
* Dynamic field reveal based on selections:
  - Roof selected → Square footage slider appears (custom styled with Burgundy handle)
  - Chimney selected → Number input fades in
  - Gutters selected → Linear feet calculator reveals
* Each reveal uses height auto animation with opacity fade (250ms)
* Real-time estimate range updates in sticky footer: "$X,XXX - $X,XXX"
* Tooltip icons (20px) next to complex options, hover reveals explanation cards
* "Back" button (ghost style) and "Continue" button (primary style) in footer

#### Step 3: Contact Information State
* HubSpot progressive profiling checks for existing email
* If returning visitor: "Welcome back!" message in Success Green (#2D7A3E) with fade-in
* Form fields with floating labels (transform and color transition on focus)
* Phone number input with format mask (XXX) XXX-XXXX
* Email validation indicator: checkmark appears inline when valid
* Preferred contact method toggle: Phone/Email/Text with custom radio styling
* Time preference dropdown with custom styling (no native select appearance)
* Emergency checkbox reveals priority banner when checked (Alert Gold background #D4A017)
* Privacy notice in Body Small (14px) with link to policy
* Submit button shows loading spinner on click (white spinner on Burgundy background)

#### Submission Processing State
* Full-screen overlay with slight blur on background (backdrop-filter: blur(4px))
* Centered loading animation: roof icon rotating with ease-in-out (1.5s loop)
* Contextual messages cycling every 2 seconds:
  - "Calculating your estimate..."
  - "Checking material availability..."
  - "Preparing your personalized quote..."
* Progress bar filling from 0-100% over 3 seconds (Primary Burgundy fill)
* If delay > 5 seconds: "This is taking longer than usual..." message appears

#### Success State
* Confetti animation (subtle, professional) using brand colors
* Estimate range displayed prominently in H2 (36px Semibold)
* "What's Next?" section with numbered timeline (vertical on mobile, horizontal desktop)
* Inline calendar widget slides down (Calendly embed with custom CSS)
* Secondary CTAs: "Download Estimate PDF" and "Share With Spouse"
* Trust reinforcement: "Join 2,847 satisfied customers in Philadelphia"
* Related content cards: "Financing Options" and "Our Process" with hover effects
* Mobile: All elements stack with 24px spacing, calendar takes full width

#### Error/Offline State
* Red banner (#D32F2F) slides down from top: "Connection issue - Don't worry, we saved your progress"
* Form data saved to IndexedDB with visual confirmation (checkmark icon)
* Queue indicator in corner: semi-transparent badge showing "Saved locally"
* Retry button with spinner when attempting to reconnect
* If online returns: "Back online! Submitting your request..." with progress bar

### Smart Lead Routing
#### High-Intent Visitor Detection State
* Behavior tracking: Time on site > 3 min, viewed 5+ pages
* Subtle notification slides in from bottom right after qualifying actions
* "Looks like you're doing research! Get expert advice?" message
* Quick-action buttons: "Chat Now" (Trust Blue #1E5F8E) and "Fast Quote" (Primary Burgundy)
* Dismiss option ('x') remembers preference for session
* Mobile: Full-width bottom sheet with swipe-to-dismiss gesture

#### Emergency Request Routing State
* When emergency checkbox selected, form styling changes:
  - Border color transitions to Alert Gold (#D4A017)
  - "PRIORITY" badge appears with pulse animation
  - Estimated response time shows: "Response within 45 minutes"
* After submission: Different success page with emergency instructions
* SMS option prominently displayed with phone icon animation
* Live countdown timer showing expected callback time
* Emergency preparation checklist with expandable items

## Trust Signal Integration

### Dynamic Social Proof Display
#### Initial Review Display State
* Review carousel container: 100% width, overflow hidden
* 3 review cards visible on desktop (370px each), 1.2 cards on mobile
* Each card: White background, subtle shadow, 8px radius
* 5-star rating: Alert Gold stars (#D4A017) with 0.2s stagger animation on load
* Reviewer info: Name in Body text, neighborhood in Body Small gray
* Review text: 3 lines truncated with "Read more" link in Primary Burgundy
* Auto-rotation paused on hover, resume after 5 seconds of no interaction
* Smooth scroll with momentum physics on mobile (using native scroll)
* Navigation dots below on mobile, arrow buttons on desktop (ghost style)

#### Expanded Review State
* Click "Read more" triggers smooth height animation to show full review
* Background overlay fades in (rgba(0,0,0,0.5)) with blur effect
* Modal slides up on mobile, fades in on desktop (350ms cubic-bezier)
* Full review in larger text (18px), better line height for readability
* Google logo and "Verified Review" badge for authenticity
* Response from Russell (if any) in indented gray box below
* "Helpful?" buttons with thumbs up/down (tracks engagement)
* Share buttons slide in from bottom: Copy Link, Facebook, Email
* Close button ('x') in top right, plus click-outside-to-close

#### Loading/Skeleton State
* Three skeleton cards with animated gradient sweep (shimmer effect)
* Maintains exact dimensions to prevent layout shift
* Skeleton elements for: rating stars, reviewer name, text lines
* Smooth fade transition to real content when loaded
* If API fails: Graceful fallback to cached testimonials

#### Trust Badge Integration State
* Sticky header transformation on scroll (after 100px):
  - Background transitions from transparent to white with shadow
  - Trust badges slide in from right (GAF, BBB, Google Reviews)
  - Each badge has subtle float animation (2s, different delays)
* Mobile: Horizontal scroll for badges with snap points
* Hover on badges shows tooltip with credibility info
* Click opens modal with full certification details

## Gallery Management System

### Public Gallery Display
#### Grid Layout State
* Masonry grid using CSS Grid with auto-flow dense
* Gap: 16px mobile, 24px desktop
* Each image container maintains aspect ratio with padding hack
* Loading placeholder: blurred low-res version (blur(20px)) fades to sharp
* Lazy loading triggered 200px before viewport entry
* Hover state desktop: 
  - Dark overlay (rgba(0,0,0,0.7)) fades in
  - Project details slide up from bottom
  - "View Project" button appears (Secondary style)
* Touch state mobile: First tap shows overlay, second opens lightbox

#### Filter Bar State
* Horizontal scroll container with pill-style filters
* Pills: 36px height, 16px horizontal padding, 18px radius
* Inactive: Light Warm Gray background (#F5F3F0), Charcoal text
* Active: Primary Burgundy background, white text, subtle shadow
* Smooth background color transition (200ms)
* Count badges on each filter (e.g., "Roofing (24)")
* "Clear All" link appears when filters active (ghost button style)
* Mobile: Pills centered with equal spacing, overflow scroll with no scrollbar

#### Lightbox Gallery State
* Smooth scale and fade entrance (350ms cubic-bezier)
* Image centered with max dimensions respecting viewport
* Swipe gestures on mobile with rubber-band edges effect
* Pinch-to-zoom with smooth transform transitions
* Bottom info bar:
  - Semi-transparent background (rgba(0,0,0,0.8))
  - Project type, location, and date in white text
  - "Request Similar Quote" CTA button (Primary style)
* Thumbnail strip below on desktop, dots on mobile
* Keyboard navigation: Arrow keys, Escape to close
* Preload adjacent images for smooth navigation

#### Before/After Comparison State
* Split view with draggable divider (Primary Burgundy handle)
* Handle has subtle pulse animation on first view (2s)
* Labels: "Before" and "After" in semi-transparent badges
* Smooth drag with requestAnimationFrame for 60fps
* Touch-friendly handle size on mobile (44px minimum)
* Comparison locks at 5% and 95% to prevent full hide
* "Reset" button returns divider to center (ghost style)

### Admin Upload Interface
#### Drag-Drop Zone State
* Dashed border (2px, Primary Burgundy) with rounded corners
* Background: Light Warm Gray (#F5F3F0) with subtle pattern
* Large upload icon (48px) with upward arrow animation loop
* Text: "Drag photos here or click to browse"
* Hover/drag-over state:
  - Border becomes solid
  - Background lightens
  - Scale(1.02) transform
  - "Drop photos to upload" text appears
* Accepted file types listed below in Body Small
* Mobile: Tap opens native file picker with camera option

#### Upload Progress State
* Each file appears as horizontal card (100% width, 80px height)
* Thumbnail on left (60px square, 4px radius)
* File name and size in middle
* Progress bar below: thin (4px) with Burgundy fill
* Percentage text updates in real-time
* Cancel button ('x') on right during upload
* Success state: Progress bar replaced with green checkmark
* Error state: Red bar with retry button
* Bulk action bar appears with 2+ files: "Cancel All", "Pause All"

#### Image Optimization Preview State
* Split view showing original vs. optimized
* File size reduction percentage in Success Green badge
* Quality slider (0-100) with real-time preview update
* Preset buttons: "Web", "Print", "Archive" with tooltips
* Image details sidebar:
  - Dimensions, file size, format
  - Alt text input (required)
  - Category dropdown
  - Location/project tags
* "Apply to All" checkbox for bulk processing
* Processing spinner with "Optimizing..." text

#### Categorization State
* AI-suggested categories appear as pills to approve/reject
* Confidence percentage shown (e.g., "Roofing 94% confident")
* Manual override dropdown with search
* Subcategory appears after main category selected
* Batch categorization mode:
  - Select multiple images with checkboxes
  - Floating action bar with category dropdown
  - "Apply to Selected" button (Primary style)
* Recently used categories shown for quick access

## Instant Estimate Calculator

### Interactive Pricing Tool
#### Initial Calculator State
* Hero section: "Get Your Estimate in 60 Seconds" with timer icon
* Main container: White card with generous padding (32px)
* Visual service selector:
  - Large illustrated cards (200px × 150px)
  - Hover reveals example photos in background
  - Selected state: Primary Burgundy border, checkmark badge
* Running total in sticky footer:
  - Blurred initially showing "$----"
  - Animates to real numbers as selections made
  - CountUp animation for smooth number transitions

#### Measurement Input State
* Visual area calculator for roof:
  - Interactive house diagram with draggable points
  - Dimensions update in real-time
  - "Not sure?" link reveals estimation helper
* Alternative: Simple slider input
  - Custom styled with Burgundy handle
  - Min/max labels, current value in tooltip
  - Snaps to common sizes (1000, 1500, 2000 sq ft)
* Smart suggestions: "Homes in [zip code] average 1,800 sq ft"
* Unit toggle: Square feet / Squares with instant conversion

#### Material Selection State
* Material cards in grid layout:
  - Photo of actual shingle/material
  - Name, warranty period, price indicator ($, $$, $$$)
  - "Most Popular" badge on recommended option
  - Hover shows larger preview with details
* Comparison mode toggle:
  - Enables selecting up to 3 materials
  - Side-by-side comparison table slides up
  - Differences highlighted in cells
* Quality indicator: Good/Better/Best with tooltip explanations
* Impact on price shown as +$X,XXX when hovering options

#### Additional Options State
* Collapsible sections for add-ons:
  - Smooth height animation on expand/collapse
  - Each option has checkbox, description, price impact
  - Info icons with hover tooltips
  - Some options reveal sub-options when selected
* Common bundles highlighted:
  - "Complete Protection Package" with 10% savings badge
  - Items included shown with checkmarks
  - One-click to select all
* Running total updates with each selection
* "Reset Options" link if many selected

#### Results Display State
* Estimate range displayed prominently:
  - Large numbers with CountUp animation
  - "Based on similar projects" disclaimer below
  - Breakdown expandable section showing line items
* Visual price factors:
  - Pie chart showing cost distribution
  - Hover on segments for details
  - Smooth transitions between states
* Financing calculator appears below:
  - Monthly payment options
  - Slider for down payment
  - APR disclaimer in small text
* Action buttons:
  - "Get Official Quote" (Primary style)
  - "Save Estimate" (Secondary style)
  - "Email Results" (Ghost style)

#### Saved Configuration State
* Unique URL generated with hash
* "Saved!" confirmation slides down from top
* QR code option for mobile sharing
* Copy link button with success feedback
* Email form inline for sending to spouse/partner
* Social sharing buttons (Facebook, Text)
* Expiration notice: "Link valid for 30 days"

## HubSpot Pro Integration

### Seamless CRM Connection
#### Form Field Mapping State
* Visual connection lines between form fields and HubSpot properties
* Green checkmarks for successfully mapped fields
* Yellow warnings for recommended mappings
* Drag-and-drop to create custom mappings
* Test button sends sample data:
  - Loading state with spinner
  - Success: Green banner "Test contact created"
  - Error: Red banner with specific issue
* Sync status indicator: "Last synced 2 min ago"

#### Progressive Profiling State
* Returning visitor detection:
  - Soft fade-in of "Welcome back" message
  - Previously filled fields show as read-only with edit button
  - New questions highlighted with subtle glow
  - Progress bar shows profile completion (e.g., 70%)
* Smart field display:
  - Only show 3-4 new fields per visit
  - Priority based on sales team needs
  - Skip logic based on previous answers
* Data pills showing known information:
  - Each pill removable if incorrect
  - Hover shows data source and date

#### Lead Scoring Display State
* Score badge in admin view:
  - Circular progress indicator (0-100)
  - Color coding: Cold (blue) → Warm (yellow) → Hot (red)
  - Animated fill when score changes
* Behavior tracking indicators:
  - Page views counter with page names
  - Time on site with live timer
  - Download history with document names
  - Calculator usage count
* Score breakdown on hover:
  - Point values for each action
  - Total calculation visible
  - "Why this score?" expandable section

#### Webhook Status Monitor State
* Real-time event stream:
  - Each webhook shows as timeline entry
  - Success: Green dot with checkmark
  - Failed: Red dot with retry button
  - Pending: Yellow dot with spinner
* Payload inspector:
  - JSON viewer with syntax highlighting
  - Collapsible nested objects
  - Copy button for debugging
* Retry mechanism:
  - Manual retry button per event
  - Bulk retry for failures
  - Auto-retry indicator with countdown

## Location-Based Suburb Pages

### Local SEO Landing Pages
#### Dynamic Location Header State
* Hero with suburb-specific image (lazy loaded)
* Suburb name in H1 with county qualifier
* Weather widget integration:
  - Current conditions with icon
  - "Perfect roofing weather" or "Schedule for spring" message
  - Subtle animation on weather icon
* Distance badge: "Serving [Suburb] - Only X miles away"
* Local phone number with click-to-call on mobile

#### Local Projects Gallery State
* Map view toggle:
  - Pins for completed projects
  - Cluster markers for dense areas
  - Click pin for project preview card
* Grid view:
  - Projects sorted by distance
  - "0.3 miles from you" badges
  - Before/after previews on hover
* "No projects yet?" fallback:
  - Shows nearest suburb projects
  - "Be the first in [Suburb]" CTA

#### Local Reviews Section State
* Reviews filtered by location:
  - "[Suburb] Resident" badges
  - Map showing reviewer locations (anonymized)
  - Sort by: Newest, Highest Rated, Nearest
* Review highlights:
  - AI-extracted themes in pills
  - "Fast response", "Clean work", etc.
  - Click pill to filter reviews
* Suburb-specific testimonial request:
  - "Are you from [Suburb]? Share your experience"
  - Incentive mention for leaving review

#### Service Area Confirmation State
* Interactive service map:
  - Suburb boundary highlighted
  - Surrounding areas in lighter shade
  - "Yes, we service this area!" banner
* Response time indicator:
  - "Typical response: 45 minutes"
  - Based on actual crew location data
  - Updates based on day/time
* Local crew information:
  - "Your local team" section
  - Crew member photos (optional)
  - Years serving the area

#### Schema Markup Indicators State
* Admin view shows SEO elements:
  - Green checkmarks for valid schema
  - Preview of rich snippet
  - Local business markup status
  - Service area definitions
* Missing data warnings:
  - Yellow alerts for optimization opportunities
  - One-click fixes where possible
  - Priority indicators for impact

## Admin Interface

### Centralized Management Dashboard
#### Dashboard Overview State
* Metrics cards with real-time updates:
  - Leads today with sparkline chart
  - Conversion rate with trend arrow
  - Active quotes with status breakdown
  - Each card: White background, hover shows details
* Activity feed:
  - Real-time updates with fade-in animation
  - User avatars or initials in circles
  - Relative timestamps ("2 min ago")
  - Click for detailed view
* Quick actions floating button:
  - Plus icon, Primary Burgundy
  - Expands to show action menu
  - Upload Photo, Update Price, Add Review

#### Gallery Management State
* Thumbnail grid with multi-select:
  - Checkbox overlay on hover
  - Selected state: Burgundy border
  - Batch actions bar slides up when items selected
* Drag-to-reorder mode:
  - Toggle button activates
  - Grab handles appear
  - Ghost image while dragging
  - Drop zones highlighted
* Quick edit popover:
  - Click image info icon
  - Edit title, alt text, category
  - Save/Cancel buttons
  - Changes save via AJAX

#### Pricing Update Interface State
* Service pricing table:
  - Editable cells with inline editing
  - Tab/Enter navigation between cells
  - Changed cells highlighted yellow
  - Save all changes button appears
* Price history:
  - Timeline view of changes
  - User who made change
  - Revert option for each
* Competitor comparison:
  - Side-by-side price display
  - Percentage differences shown
  - "Match" or "Beat by X%" quick actions

#### Lead Management View State
* Kanban board layout:
  - Columns: New, Contacted, Quoted, Won, Lost
  - Drag leads between stages
  - Lead cards show key info
  - Color coding by priority
* Lead detail modal:
  - Full contact history timeline
  - Internal notes section
  - Quick actions: Call, Email, Quote
  - HubSpot sync status
* Filters and search:
  - Date range picker
  - Service type filters
  - Search by name/address
  - Save filter combinations

#### Security & Session States
#### Login Screen State
* Clean, centered design:
  - Logo at top
  - Email/password fields
  - "Remember me" checkbox
  - Forgot password link
* Two-factor authentication:
  - Code input appears after password
  - 6 digit input with auto-advance
  - Resend code option
  - Countdown timer
* Error states:
  - Shake animation on wrong password
  - Clear error messages
  - Password strength indicator

#### Active Session State
* Session timer in header:
  - Countdown last 5 minutes
  - Warning modal at 2 minutes
  - "Extend Session" button
  - Auto-save before timeout
* Activity indicators:
  - "Saving..." when making changes
  - "All changes saved" confirmation
  - Offline indicator if connection lost
* User menu:
  - Avatar/initials in circle
  - Dropdown with settings, logout
  - Last login information
  - Active sessions list

#### Permission-Based UI State
* Role-based element visibility:
  - Admin sees all features
  - Manager sees reports, gallery
  - Staff sees limited actions
  - Disabled elements grayed out
* Permission tooltips:
  - Hover disabled items
  - "Requires admin access" message
  - "Request access" link
* Audit trail visibility:
  - Admins see who changed what
  - Timestamps and IP addresses
  - Revert capabilities

## Global State Patterns

### Loading States
* Initial: Skeleton screens with shimmer
* Actions: Button spinners with disabled state
* Lazy: Progressive image loading with blur-up
* Routes: Top progress bar for page transitions

### Error States
* Inline: Below fields with red text and icon
* Toast: Slide in from top-right, auto-dismiss
* Modal: For critical errors requiring action
* Offline: Persistent banner with retry option

### Success States
* Form: Green checkmark with success message
* Actions: Brief toast notification
* Saves: "Saved" indicator with timestamp
* Completion: Confetti or checkmark animation

### Empty States
* Helpful illustrations (not generic)
* Clear explanation of what's missing
* Primary CTA to take action
* Secondary help link if needed

### Responsive Breakpoints
* Mobile: 0-767px (touch-first)
* Tablet: 768-1023px (hybrid)
* Desktop: 1024px+ (hover states)
* Wide: 1400px+ (max content width)