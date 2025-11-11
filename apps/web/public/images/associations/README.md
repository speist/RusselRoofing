# Associations Logo Images

This directory contains logo images for the associations section on the home page.

## Required Logo Files

Please add the following logo files to this directory:

1. **nrca-logo.png** - NRCA (National Roofing Contractors Association)
   - Link: https://www.nrca.net/

2. **gaf-presidents-club-logo.png** - GAF President's Club
   - Link: https://www.gaf.com/

3. **certainteed-advisory-council-logo.png** - Certainteed Advisory Council
   - Link: https://www.certainteed.com/

4. **main-line-chamber-logo.png** - Main Line Chamber of Commerce
   - Link: https://www.mlcc.org/

5. **montgomery-county-chamber-logo.png** - Montgomery County Chamber of Commerce
   - Link: https://www.montgomerycountychamber.org/

6. **bni-logo.png** - BNI (Business Networking International)
   - Link: https://www.bni.com/

7. **philadelphia-historical-society-logo.png** - Philadelphia Historical Society
   - Link: https://www.philahistory.org/

8. **preservation-alliance-logo.png** - Preservation Alliance of Greater Philadelphia
   - Link: https://www.preservationalliance.com/

9. **rock-ministry-logo.png** - Rock Ministry
   - Link: https://www.rockministries.org/

## Image Specifications

- **Format**: PNG or SVG (PNG recommended for consistent display)
- **Size**: Approximately 200x200px (or higher resolution for retina displays)
- **Background**: Transparent or white background
- **Aspect Ratio**: Square (1:1) preferred for uniform display

## Usage

These logos are used in the `AssociationsSlider` component (`/src/components/home/AssociationsSlider.tsx`), which displays them in a responsive carousel on the home page below the "Our Services" section.

The slider features:
- Auto-scroll with pause on hover
- Navigation arrows
- Responsive grid (2-5 logos per row depending on screen size)
- Clickable logos linking to each association's website
- Hover effects for better interaction

## Fallback

If an image is not found, a placeholder will be displayed until the actual logo is added.
