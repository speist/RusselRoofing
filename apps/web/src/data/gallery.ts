import { ProjectImage } from "@/types/gallery";

// Gallery images data based on actual folder structure
export const sampleProjects: ProjectImage[] = [
  // Roofing Projects (5 images)
  {
    id: "roofing-01",
    src: "/images/gallery/roofing/full/roofing-01.jpg",
    alt: "Professional roofing installation",
    thumbnailSrc: "/images/gallery/roofing/thumbnails/roofing-01-thumb.jpg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Roofing"],
    projectTitle: "Residential Roofing Project",
    description: "Complete roof replacement with premium materials and expert installation.",
    location: "New Jersey",
    aspectRatio: 1.5
  },
  {
    id: "roofing-03",
    src: "/images/gallery/roofing/full/roofing-03.jpg",
    alt: "Quality roofing workmanship",
    thumbnailSrc: "/images/gallery/roofing/thumbnails/roofing-03-thumb.jpg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Roofing"],
    projectTitle: "Expert Roof Installation",
    description: "Professional roofing services with attention to detail and quality.",
    location: "New Jersey",
    aspectRatio: 1.5
  },
  {
    id: "roofing-04",
    src: "/images/gallery/roofing/full/roofing-04.jpg",
    alt: "Modern roofing solution",
    thumbnailSrc: "/images/gallery/roofing/thumbnails/roofing-04-thumb.jpg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Roofing"],
    projectTitle: "Modern Roofing Design",
    description: "Contemporary roofing solutions combining aesthetics and functionality.",
    location: "New Jersey",
    aspectRatio: 1.5
  },
  {
    id: "roofing-05",
    src: "/images/gallery/roofing/full/roofing-05.jpg",
    alt: "Durable roof installation",
    thumbnailSrc: "/images/gallery/roofing/thumbnails/roofing-05-thumb.jpg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Roofing"],
    projectTitle: "Reliable Roof System",
    description: "Long-lasting roofing systems built to withstand the elements.",
    location: "New Jersey",
    aspectRatio: 1.5
  },
  {
    id: "roofing-06",
    src: "/images/gallery/roofing/full/roofing-06.jpg",
    alt: "Premium roofing services",
    thumbnailSrc: "/images/gallery/roofing/thumbnails/roofing-06-thumb.jpg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Roofing"],
    projectTitle: "Premium Roofing Installation",
    description: "High-quality roofing materials installed by experienced professionals.",
    location: "New Jersey",
    aspectRatio: 1.5
  },

  // Siding Projects (6 images)
  {
    id: "siding-01",
    src: "/images/gallery/siding/full/siding01.jpg",
    alt: "Beautiful siding installation",
    thumbnailSrc: "/images/gallery/siding/thumbnails/siding01-thumb.jpg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Siding"],
    projectTitle: "Residential Siding Project",
    description: "Quality siding installation enhancing curb appeal and protection.",
    location: "New Jersey",
    aspectRatio: 1.3
  },
  {
    id: "siding-02",
    src: "/images/gallery/siding/full/siding02.jpg",
    alt: "Professional siding work",
    thumbnailSrc: "/images/gallery/siding/thumbnails/siding02-thumb.jpg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Siding"],
    projectTitle: "Expert Siding Installation",
    description: "Professional siding services with superior craftsmanship.",
    location: "New Jersey",
    aspectRatio: 1.3
  },
  {
    id: "siding-03",
    src: "/images/gallery/siding/full/siding03.jpeg",
    alt: "Modern siding solution",
    thumbnailSrc: "/images/gallery/siding/thumbnails/siding03-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Siding"],
    projectTitle: "Contemporary Siding Design",
    description: "Modern siding solutions for enhanced home protection.",
    location: "New Jersey",
    aspectRatio: 1.3
  },
  {
    id: "siding-04",
    src: "/images/gallery/siding/full/siding04.jpeg",
    alt: "Quality siding installation",
    thumbnailSrc: "/images/gallery/siding/thumbnails/siding04-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Siding"],
    projectTitle: "Durable Siding System",
    description: "Long-lasting siding materials installed with precision.",
    location: "New Jersey",
    aspectRatio: 1.3
  },
  {
    id: "siding-05",
    src: "/images/gallery/siding/full/siding05.jpeg",
    alt: "Premium siding services",
    thumbnailSrc: "/images/gallery/siding/thumbnails/siding05-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Siding"],
    projectTitle: "Premium Siding Installation",
    description: "High-quality siding for beauty and weather protection.",
    location: "New Jersey",
    aspectRatio: 1.3
  },
  {
    id: "siding-06",
    src: "/images/gallery/siding/full/siding06.jpeg",
    alt: "Expert siding craftsmanship",
    thumbnailSrc: "/images/gallery/siding/thumbnails/siding06-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Siding"],
    projectTitle: "Expert Siding Craftsmanship",
    description: "Skilled siding installation for lasting beauty and value.",
    location: "New Jersey",
    aspectRatio: 1.3
  },

  // Windows Projects (4 images)
  {
    id: "windows-01",
    src: "/images/gallery/windows/full/windows-01.jpeg",
    alt: "Professional window installation",
    thumbnailSrc: "/images/gallery/windows/thumbnails/windows-01-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Windows"],
    projectTitle: "Window Replacement Project",
    description: "Energy-efficient window installation for improved comfort.",
    location: "New Jersey",
    aspectRatio: 1.2
  },
  {
    id: "windows-02",
    src: "/images/gallery/windows/full/windows-02.jpeg",
    alt: "Quality window services",
    thumbnailSrc: "/images/gallery/windows/thumbnails/windows-02-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Windows"],
    projectTitle: "Expert Window Installation",
    description: "Professional window replacement with superior products.",
    location: "New Jersey",
    aspectRatio: 1.2
  },
  {
    id: "windows-03",
    src: "/images/gallery/windows/full/windows-03.jpeg",
    alt: "Modern window solutions",
    thumbnailSrc: "/images/gallery/windows/thumbnails/windows-03-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Windows"],
    projectTitle: "Modern Window Design",
    description: "Contemporary window solutions for style and efficiency.",
    location: "New Jersey",
    aspectRatio: 1.2
  },
  {
    id: "windows-04",
    src: "/images/gallery/windows/full/windows-04.jpeg",
    alt: "Premium window services",
    thumbnailSrc: "/images/gallery/windows/thumbnails/windows-04-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Windows"],
    projectTitle: "Premium Window Replacement",
    description: "High-quality windows installed by certified professionals.",
    location: "New Jersey",
    aspectRatio: 1.2
  },

  // Skylights Projects (6 images)
  {
    id: "skylights-01",
    src: "/images/gallery/skylights/full/windows-skylight-01.jpeg",
    alt: "Skylight installation",
    thumbnailSrc: "/images/gallery/skylights/thumbnails/windows-skylight-01-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Skylights"],
    projectTitle: "Skylight Installation",
    description: "Professional skylight installation for natural lighting.",
    location: "New Jersey",
    aspectRatio: 1.4
  },
  {
    id: "skylights-02",
    src: "/images/gallery/skylights/full/windows-skylight-02.jpeg",
    alt: "Quality skylight work",
    thumbnailSrc: "/images/gallery/skylights/thumbnails/windows-skylight-02-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Skylights"],
    projectTitle: "Expert Skylight Services",
    description: "Skylight installation and repair by experienced professionals.",
    location: "New Jersey",
    aspectRatio: 1.4
  },
  {
    id: "skylights-03",
    src: "/images/gallery/skylights/full/windows-skylight-03.jpeg",
    alt: "Modern skylight design",
    thumbnailSrc: "/images/gallery/skylights/thumbnails/windows-skylight-03-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Skylights"],
    projectTitle: "Modern Skylight Solutions",
    description: "Contemporary skylight design for enhanced natural light.",
    location: "New Jersey",
    aspectRatio: 1.4
  },
  {
    id: "skylights-04",
    src: "/images/gallery/skylights/full/windows-skylight-04.jpeg",
    alt: "Skylight replacement",
    thumbnailSrc: "/images/gallery/skylights/thumbnails/windows-skylight-04-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Skylights"],
    projectTitle: "Skylight Replacement",
    description: "Energy-efficient skylight replacement and installation.",
    location: "New Jersey",
    aspectRatio: 1.4
  },
  {
    id: "skylights-05",
    src: "/images/gallery/skylights/full/windows-skylight-05.jpeg",
    alt: "Premium skylight services",
    thumbnailSrc: "/images/gallery/skylights/thumbnails/windows-skylight-05-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Skylights"],
    projectTitle: "Premium Skylight Installation",
    description: "High-quality skylights for beautiful natural lighting.",
    location: "New Jersey",
    aspectRatio: 1.4
  },
  {
    id: "skylights-06",
    src: "/images/gallery/skylights/full/windows-skylight-06.jpeg",
    alt: "Expert skylight craftsmanship",
    thumbnailSrc: "/images/gallery/skylights/thumbnails/windows-skylight-06-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Skylights"],
    projectTitle: "Expert Skylight Craftsmanship",
    description: "Skilled skylight installation for optimal natural light.",
    location: "New Jersey",
    aspectRatio: 1.4
  },

  // Masonry Projects (6 images)
  {
    id: "masonry-01",
    src: "/images/gallery/masonry/full/masonry-01.jpeg",
    alt: "Professional masonry work",
    thumbnailSrc: "/images/gallery/masonry/thumbnails/masonry-01-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Masonry"],
    projectTitle: "Masonry Restoration",
    description: "Expert masonry repair and restoration services.",
    location: "New Jersey",
    aspectRatio: 1.5
  },
  {
    id: "masonry-02",
    src: "/images/gallery/masonry/full/masonry-02.jpeg",
    alt: "Quality masonry services",
    thumbnailSrc: "/images/gallery/masonry/thumbnails/masonry-02-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Masonry"],
    projectTitle: "Expert Masonry Services",
    description: "Professional masonry work with attention to detail.",
    location: "New Jersey",
    aspectRatio: 1.5
  },
  {
    id: "masonry-03",
    src: "/images/gallery/masonry/full/masonry-03.jpeg",
    alt: "Brick and stone work",
    thumbnailSrc: "/images/gallery/masonry/thumbnails/masonry-03-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Masonry"],
    projectTitle: "Brick and Stone Masonry",
    description: "Quality brick and stone work for residential properties.",
    location: "New Jersey",
    aspectRatio: 1.5
  },
  {
    id: "masonry-04",
    src: "/images/gallery/masonry/full/masonry-04.jpeg",
    alt: "Masonry repair work",
    thumbnailSrc: "/images/gallery/masonry/thumbnails/masonry-04-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Masonry"],
    projectTitle: "Masonry Repair Services",
    description: "Comprehensive masonry repair and maintenance.",
    location: "New Jersey",
    aspectRatio: 1.5
  },
  {
    id: "masonry-05",
    src: "/images/gallery/masonry/full/masonry-05.jpeg",
    alt: "Premium masonry work",
    thumbnailSrc: "/images/gallery/masonry/thumbnails/masonry-05-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Masonry"],
    projectTitle: "Premium Masonry Installation",
    description: "High-quality masonry for lasting beauty and durability.",
    location: "New Jersey",
    aspectRatio: 1.5
  },
  {
    id: "masonry-06",
    src: "/images/gallery/masonry/full/masonry-06.jpeg",
    alt: "Expert masonry craftsmanship",
    thumbnailSrc: "/images/gallery/masonry/thumbnails/masonry-06-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Masonry"],
    projectTitle: "Expert Masonry Craftsmanship",
    description: "Skilled masonry work with superior craftsmanship.",
    location: "New Jersey",
    aspectRatio: 1.5
  },

  // Commercial Projects (6 images)
  {
    id: "commercial-01",
    src: "/images/gallery/commercial/full/commercial01.jpeg",
    alt: "Commercial roofing project",
    thumbnailSrc: "/images/gallery/commercial/thumbnails/commercial01-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Commercial"],
    projectTitle: "Commercial Roofing Project",
    description: "Large-scale commercial roofing installation and repair.",
    location: "New Jersey",
    aspectRatio: 1.4
  },
  {
    id: "commercial-02",
    src: "/images/gallery/commercial/full/commercial02.jpeg",
    alt: "Commercial building services",
    thumbnailSrc: "/images/gallery/commercial/thumbnails/commercial02-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Commercial"],
    projectTitle: "Commercial Building Services",
    description: "Comprehensive commercial building exterior services.",
    location: "New Jersey",
    aspectRatio: 1.4
  },
  {
    id: "commercial-03",
    src: "/images/gallery/commercial/full/commercial03.jpeg",
    alt: "Commercial renovation",
    thumbnailSrc: "/images/gallery/commercial/thumbnails/commercial03-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Commercial"],
    projectTitle: "Commercial Renovation",
    description: "Commercial building renovation and restoration services.",
    location: "New Jersey",
    aspectRatio: 1.4
  },
  {
    id: "commercial-04",
    src: "/images/gallery/commercial/full/commercial04.jpeg",
    alt: "Commercial roof restoration",
    thumbnailSrc: "/images/gallery/commercial/thumbnails/commercial04-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Commercial"],
    projectTitle: "Commercial Roof Restoration",
    description: "Professional commercial roof restoration and repair.",
    location: "New Jersey",
    aspectRatio: 1.4
  },
  {
    id: "commercial-05",
    src: "/images/gallery/commercial/full/commercial05.jpeg",
    alt: "Commercial property services",
    thumbnailSrc: "/images/gallery/commercial/thumbnails/commercial05-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Commercial"],
    projectTitle: "Commercial Property Services",
    description: "Complete commercial property exterior solutions.",
    location: "New Jersey",
    aspectRatio: 1.4
  },
  {
    id: "commercial-06",
    src: "/images/gallery/commercial/full/commercial06.jpeg",
    alt: "Commercial building maintenance",
    thumbnailSrc: "/images/gallery/commercial/thumbnails/commercial06-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Commercial"],
    projectTitle: "Commercial Building Maintenance",
    description: "Ongoing commercial building maintenance and repairs.",
    location: "New Jersey",
    aspectRatio: 1.4
  },

  // Churches & Institutions (5 images)
  {
    id: "church-01",
    src: "/images/gallery/churches-and-institutions/full/church-institutions-01.jpeg",
    alt: "Church restoration project",
    thumbnailSrc: "/images/gallery/churches-and-institutions/thumbnails/church-institutions-01-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Churches & Institutions"],
    projectTitle: "Church Restoration",
    description: "Specialized church and institutional building restoration.",
    location: "New Jersey",
    aspectRatio: 1.6
  },
  {
    id: "church-02",
    src: "/images/gallery/churches-and-institutions/full/church-institutions-02.jpeg",
    alt: "Institutional building services",
    thumbnailSrc: "/images/gallery/churches-and-institutions/thumbnails/church-institutions-02-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Churches & Institutions"],
    projectTitle: "Institutional Building Services",
    description: "Professional services for churches and institutions.",
    location: "New Jersey",
    aspectRatio: 1.6
  },
  {
    id: "church-03",
    src: "/images/gallery/churches-and-institutions/full/church-institutions-03.jpeg",
    alt: "Church roof restoration",
    thumbnailSrc: "/images/gallery/churches-and-institutions/thumbnails/church-institutions-03-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Churches & Institutions"],
    projectTitle: "Church Roof Restoration",
    description: "Expert church roofing and exterior restoration.",
    location: "New Jersey",
    aspectRatio: 1.6
  },
  {
    id: "church-04",
    src: "/images/gallery/churches-and-institutions/full/church-institutions-04.jpeg",
    alt: "Historic church maintenance",
    thumbnailSrc: "/images/gallery/churches-and-institutions/thumbnails/church-institutions-04-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Churches & Institutions"],
    projectTitle: "Historic Church Maintenance",
    description: "Preservation and maintenance of historic church buildings.",
    location: "New Jersey",
    aspectRatio: 1.6
  },
  {
    id: "church-05",
    src: "/images/gallery/churches-and-institutions/full/church-institutions-05.jpeg",
    alt: "Institutional restoration",
    thumbnailSrc: "/images/gallery/churches-and-institutions/thumbnails/church-institutions-05-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Churches & Institutions"],
    projectTitle: "Institutional Restoration",
    description: "Complete restoration services for institutional buildings.",
    location: "New Jersey",
    aspectRatio: 1.6
  },

  // Historical Restoration (6 images)
  {
    id: "historical-01",
    src: "/images/gallery/historical-restoration/full/historical-restoration-01.jpeg",
    alt: "Historical building restoration",
    thumbnailSrc: "/images/gallery/historical-restoration/thumbnails/historical-restoration-01-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Historical Restoration"],
    projectTitle: "Historical Building Restoration",
    description: "Specialized restoration of historical structures.",
    location: "New Jersey",
    aspectRatio: 1.7
  },
  {
    id: "historical-02",
    src: "/images/gallery/historical-restoration/full/historical-restoration-02.jpeg",
    alt: "Heritage property restoration",
    thumbnailSrc: "/images/gallery/historical-restoration/thumbnails/historical-restoration-02-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Historical Restoration"],
    projectTitle: "Heritage Property Restoration",
    description: "Preservation of heritage and historical properties.",
    location: "New Jersey",
    aspectRatio: 1.7
  },
  {
    id: "historical-03",
    src: "/images/gallery/historical-restoration/full/historical-restoration-03.jpeg",
    alt: "Historic roof restoration",
    thumbnailSrc: "/images/gallery/historical-restoration/thumbnails/historical-restoration-03-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Historical Restoration"],
    projectTitle: "Historic Roof Restoration",
    description: "Expert restoration of historic roofing systems.",
    location: "New Jersey",
    aspectRatio: 1.7
  },
  {
    id: "historical-04",
    src: "/images/gallery/historical-restoration/full/historical-restoration-04.jpeg",
    alt: "Period architecture restoration",
    thumbnailSrc: "/images/gallery/historical-restoration/thumbnails/historical-restoration-04-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Historical Restoration"],
    projectTitle: "Period Architecture Restoration",
    description: "Authentic restoration of period architectural elements.",
    location: "New Jersey",
    aspectRatio: 1.7
  },
  {
    id: "historical-05",
    src: "/images/gallery/historical-restoration/full/historical-restoration-05.jpeg",
    alt: "Historic building preservation",
    thumbnailSrc: "/images/gallery/historical-restoration/thumbnails/historical-restoration-05-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Historical Restoration"],
    projectTitle: "Historic Building Preservation",
    description: "Comprehensive preservation of historic buildings.",
    location: "New Jersey",
    aspectRatio: 1.7
  },
  {
    id: "historical-06",
    src: "/images/gallery/historical-restoration/full/historical-restoration-06-v3.jpeg",
    alt: "Heritage conservation project",
    thumbnailSrc: "/images/gallery/historical-restoration/thumbnails/historical-restoration-06-v3-thumb.jpeg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Historical Restoration"],
    projectTitle: "Heritage Conservation Project",
    description: "Expert conservation of heritage structures.",
    location: "New Jersey",
    aspectRatio: 1.7
  },
];

// Generate extended projects for testing pagination/filtering
export const extendedProjects = [...sampleProjects];
