# Gallery Image Organization

This directory contains organized project photos for Russell Roofing services.

## Folder Structure

Each service category has three subdirectories:

- **full/**: High-resolution images (max 1920x1280px, <800KB)
- **thumbnails/**: Thumbnail versions (400x267px, <100KB)  
- **before-after/**: Before/after transformation images

## Service Categories

- `roofing/` - Roof installations, repairs, replacements
- `siding/` - Exterior siding projects
- `gutters/` - Gutter installations and repairs
- `windows/` - Window replacements and installations
- `chimneys/` - Chimney repairs and restorations
- `commercial/` - Commercial projects

## Quick Usage

1. Place high-res images in appropriate `{service}/full/` directory
2. Generate thumbnails in `{service}/thumbnails/` 
3. Update `src/data/gallery.ts` with new image references
4. Use naming convention: `{service}-{project-type}-{location}-{date}.jpg`

For detailed instructions, see `docs/gallery-management.md`