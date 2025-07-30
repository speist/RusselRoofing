# Videos Directory

This directory contains video assets for the website.

## Hero Video

Place your hero video here with the following naming convention:
- `hero-video.mp4` - Main hero video for homepage
- `hero-video-mobile.mp4` - Optional mobile-optimized version

## Video Requirements

### Format Recommendations:
- **Format**: MP4 (H.264)
- **Resolution**: 1920x1080 (Full HD) minimum
- **Aspect Ratio**: 16:9 
- **Duration**: 10-30 seconds for hero videos
- **File Size**: Under 10MB for web optimization

### Optimization Tips:
1. Use web-optimized compression settings
2. Consider providing multiple formats (MP4, WebM)
3. Include a poster image (JPG/PNG) as fallback
4. Test on mobile devices for performance

## Usage in Code

```jsx
<video
  autoPlay
  muted
  loop
  playsInline
  poster="/images/hero-poster.jpg"
  className="w-full h-full object-cover"
>
  <source src="/videos/hero-video.mp4" type="video/mp4" />
  <source src="/videos/hero-video.webm" type="video/webm" />
  Your browser does not support the video tag.
</video>
```