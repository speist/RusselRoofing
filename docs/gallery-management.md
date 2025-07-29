# Gallery Management Guide

Complete guide for managing project photos in the Russell Roofing gallery system.

## Overview

The gallery system is organized into service categories with structured folders for different image types. All project photos are stored in `/public/images/gallery/` with a consistent naming convention and folder structure.

## Folder Structure

```
public/images/gallery/
├── roofing/
│   ├── full/              # High-resolution images (1920x1280 max, <800KB)
│   ├── thumbnails/        # Thumbnail versions (400x267px, <100KB)
│   └── before-after/      # Before/after transformation images
├── siding/
│   ├── full/
│   ├── thumbnails/
│   └── before-after/
├── gutters/
│   ├── full/
│   ├── thumbnails/
│   └── before-after/
├── windows/
│   ├── full/
│   ├── thumbnails/
│   └── before-after/
├── chimneys/
│   ├── full/
│   ├── thumbnails/
│   └── before-after/
├── commercial/
│   ├── full/
│   ├── thumbnails/
│   └── before-after/
└── README.md              # Quick reference
```

## Service Categories

### Roofing
- Complete roof replacements
- Roof repairs and maintenance
- Slate roof restorations
- Commercial roofing projects

### Siding
- Siding replacements and installations
- Mixed-material siding projects
- Historical restoration siding
- Modern contemporary siding

### Gutters
- Seamless gutter installations
- Gutter repairs and maintenance
- Leaf protection systems
- Decorative downspout installations

### Windows
- Window replacements
- Historic window restorations
- Energy-efficient upgrades
- Custom window installations

### Chimneys
- Chimney repairs and restoration
- Brick repointing
- Crown replacements
- Liner installations

### Commercial
- Large-scale commercial projects
- Office building restorations
- Industrial roofing
- Commercial maintenance

## Image Naming Conventions

### Standard Format
```
{service}-{project-type}-{location}-{date}.jpg
```

### Examples
- `roofing-complete-replacement-westfield-2024-01-15.jpg`
- `siding-colonial-renovation-princeton-2023-12-08.jpg`
- `gutters-seamless-installation-summit-2024-01-22.jpg`
- `windows-replacement-victorian-morristown-2024-01-05.jpg`
- `chimneys-restoration-repair-madison-2023-12-15.jpg`
- `commercial-roof-restoration-newark-2023-11-30.jpg`

### Variations
- **Thumbnails**: Add `-thumb` suffix before extension
  - `roofing-complete-replacement-westfield-2024-01-15-thumb.jpg`
- **Before/After**: Add `-before` or `-after` suffix
  - `siding-colonial-renovation-princeton-2023-12-08-before.jpg`
  - `siding-colonial-renovation-princeton-2023-12-08-after.jpg`

## Image Requirements and Standards

### Technical Specifications

#### Full-Size Images
- **Dimensions**: Maximum 1920x1280px
- **Aspect Ratio**: Maintain 3:2 ratio for consistency
- **Format**: JPEG for photographs
- **Quality**: 85% JPEG compression
- **File Size**: Maximum 800KB
- **Color Profile**: sRGB

#### Thumbnail Images
- **Dimensions**: 400x267px (3:2 aspect ratio)
- **Format**: JPEG
- **Quality**: 80% JPEG compression
- **File Size**: Maximum 100KB
- **Naming**: Original filename + `-thumb` suffix

#### Before/After Images
- **Same specifications as full-size images**
- **Consistent angles**: Use same vantage point for before/after pairs
- **Lighting**: Try to match lighting conditions when possible
- **Naming**: Original filename + `-before` or `-after` suffix

### Content Standards

#### Photography Guidelines
- **Resolution**: High-resolution source images preferred
- **Composition**: Follow rule of thirds, include context
- **Lighting**: Avoid harsh shadows, prefer overcast or golden hour
- **Angles**: Show work clearly, include multiple perspectives
- **Context**: Include surrounding property for scale and aesthetics

#### Quality Requirements
- **Focus**: Sharp, well-focused images only
- **Exposure**: Properly exposed, avoid blown highlights or blocked shadows
- **Color**: Accurate color representation
- **Noise**: Minimal digital noise or grain
- **Artifacts**: No compression artifacts or processing halos

## Adding New Project Photos

### Step-by-Step Workflow

#### 1. Prepare Images
1. **Review and Select**: Choose best images from project photo set
2. **Edit if Needed**: Basic color correction, cropping, exposure adjustments
3. **Resize**: Ensure maximum dimensions don't exceed 1920x1280px
4. **Optimize**: Compress to target file sizes while maintaining quality

#### 2. Organize Files
1. **Determine Service Category**: Roofing, Siding, Gutters, Windows, Chimneys, or Commercial
2. **Create Filename**: Follow naming convention `{service}-{project-type}-{location}-{date}.jpg`
3. **Generate Thumbnails**: Create 400x267px versions with `-thumb` suffix
4. **Handle Before/After**: If applicable, create before/after pairs with appropriate suffixes

#### 3. Upload to Folders
1. **Full Images**: Place in `/public/images/gallery/{service}/full/`
2. **Thumbnails**: Place in `/public/images/gallery/{service}/thumbnails/`
3. **Before/After**: Place in `/public/images/gallery/{service}/before-after/`

#### 4. Update Gallery Data
1. **Open**: `apps/web/src/data/gallery.ts`
2. **Add New Entry**: Create new ProjectImage object in sampleProjects array
3. **Required Fields**:
   - `id`: Unique identifier (string)
   - `src`: Path to full image
   - `alt`: Descriptive alt text for accessibility
   - `thumbnailSrc`: Path to thumbnail image
   - `blurDataUrl`: Base64 encoded blur placeholder
   - `serviceTypes`: Array of applicable service categories
   - `projectTitle`: Descriptive project title
   - `description`: Detailed project description
   - `location`: Project location (optional)
   - `completedDate`: Completion date in YYYY-MM-DD format (optional)
   - `aspectRatio`: Image aspect ratio (number)

#### 5. Generate Blur Data URL
Use the image utility script to generate the blur data URL:
```bash
# Future implementation - utility script
npm run generate-blur-data /path/to/image.jpg
```

#### 6. Test and Validate
1. **Run Development Server**: `npm run dev`
2. **Check Gallery Page**: Verify images load correctly
3. **Test Filtering**: Ensure service category filtering works
4. **Mobile Testing**: Check responsive behavior
5. **Accessibility**: Verify alt text and keyboard navigation

### Example Gallery Entry

```typescript
{
  id: "9",
  src: "/images/gallery/roofing/full/roofing-metal-installation-summit-2024-02-20.jpg",
  alt: "Metal roof installation on contemporary home with standing seam panels",
  thumbnailSrc: "/images/gallery/roofing/thumbnails/roofing-metal-installation-summit-2024-02-20-thumb.jpg",
  blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
  serviceTypes: ["Roofing"],
  projectTitle: "Standing Seam Metal Roof Installation",
  description: "Complete metal roof installation with standing seam panels, featuring superior weather protection and modern aesthetic appeal.",
  location: "Summit, NJ",
  completedDate: "2024-02-20",
  aspectRatio: 1.5
}
```

## Image Management Utilities

### Planned Utilities (Future Implementation)

#### Thumbnail Generation Script
```bash
npm run generate-thumbnails [source-directory]
```
- Automatically generates 400x267px thumbnails
- Maintains aspect ratio with smart cropping
- Optimizes file sizes for web performance

#### Blur Data URL Generator
```bash
npm run generate-blur-data [image-path]
```
- Creates base64 encoded blur placeholders
- Improves perceived performance during image loading
- Provides smooth loading transitions

#### Image Validation Script
```bash
npm run validate-gallery
```
- Checks that all referenced images exist
- Validates image dimensions and file sizes
- Reports missing thumbnails or incorrect paths
- Suggests optimization opportunities

#### Batch Processing Tool
```bash
npm run process-images [source-directory] [service-category]
```
- Processes entire directories of project photos
- Applies consistent naming conventions
- Generates thumbnails automatically
- Creates gallery data entries template

## Maintenance and Best Practices

### Regular Maintenance Tasks

#### Monthly Review
- **Audit Image Links**: Run validation scripts to check for broken links
- **Performance Review**: Monitor gallery loading times and optimize large images
- **Storage Management**: Archive old projects if storage becomes an issue
- **Backup Verification**: Ensure all images are properly backed up

#### Quality Control
- **Image Standards**: Regularly review uploaded images for quality consistency
- **Naming Compliance**: Audit filenames for naming convention adherence
- **Alt Text Review**: Check accessibility compliance of alt text descriptions
- **Mobile Performance**: Test gallery performance on mobile devices

### Performance Optimization

#### Image Optimization
- **WebP Conversion**: Consider implementing WebP format for modern browsers
- **Lazy Loading**: Ensure proper lazy loading implementation
- **CDN Integration**: Consider CDN for improved global performance
- **Caching Strategy**: Implement appropriate browser caching headers

#### Code Optimization
- **Bundle Analysis**: Monitor JavaScript bundle size impact
- **Component Performance**: Profile gallery component rendering performance
- **Memory Usage**: Monitor memory usage during gallery browsing
- **Progressive Loading**: Implement progressive image enhancement

### SEO and Accessibility

#### SEO Best Practices
- **Descriptive Filenames**: Use SEO-friendly filenames with relevant keywords
- **Alt Text**: Write descriptive, keyword-rich alt text
- **Image Sitemaps**: Consider implementing image sitemaps
- **Structured Data**: Add schema.org markup for images
- **Page Speed**: Maintain fast loading times for better SEO rankings

#### Accessibility Guidelines
- **Alt Text**: Provide meaningful descriptions for screen readers
- **Color Contrast**: Ensure sufficient contrast in overlay text
- **Keyboard Navigation**: Test gallery navigation with keyboard only
- **Focus Management**: Implement proper focus management in lightbox
- **Screen Reader Testing**: Regular testing with screen reader software

### Troubleshooting Common Issues

#### Missing Images
- **Check File Paths**: Verify paths in gallery.ts match actual file locations
- **Case Sensitivity**: Ensure filename cases match exactly
- **File Extensions**: Confirm extensions are lowercase (.jpg, not .JPG)
- **Permissions**: Check file permissions allow web server access

#### Performance Issues
- **Large File Sizes**: Compress images that exceed recommended file sizes
- **Too Many Images**: Consider pagination for large galleries
- **Slow Loading**: Optimize images and implement progressive loading
- **Memory Leaks**: Monitor for memory leaks in gallery components

#### Display Issues
- **Aspect Ratio Problems**: Verify aspectRatio values in gallery data
- **Thumbnail Mismatches**: Ensure thumbnails are generated from same source
- **Mobile Responsiveness**: Test on various screen sizes and devices
- **Browser Compatibility**: Test across different browsers and versions

## Future Enhancements

### Planned Features
- **CMS Integration**: Content management system for easier photo uploads
- **Automatic Processing**: Automated image processing pipeline
- **Admin Dashboard**: Web interface for gallery management
- **Analytics Integration**: Track gallery engagement and popular projects
- **Social Sharing**: Enable sharing of individual projects
- **Customer Reviews**: Link gallery items to customer testimonials

### Technical Improvements
- **Next.js Image Optimization**: Full integration with Next.js Image component
- **Progressive Web App**: PWA features for offline gallery browsing
- **Advanced Filtering**: Multi-criteria filtering and search functionality
- **Image Comparison**: Side-by-side before/after comparison tools
- **Virtual Tours**: 360° photography integration possibilities

---

For technical implementation details, see the story documentation in `docs/stories/5.5.create-project-photo-gallery-structure.md`.

For immediate help, check the quick reference in `/public/images/gallery/README.md`.