import { ProjectImage } from "@/types/gallery";

// Sample project images data
export const sampleProjects: ProjectImage[] = [
  {
    id: "1",
    src: "/images/gallery/roofing/full/roofing-complete-replacement-westfield-2024-01-15.jpg",
    alt: "Modern home complete roof replacement with architectural shingles",
    thumbnailSrc: "/images/gallery/roofing/thumbnails/roofing-complete-replacement-westfield-2024-01-15-thumb.jpg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Roofing"],
    projectTitle: "Complete Roof Replacement - Modern Home",
    description: "Full roof replacement with premium architectural shingles, new gutters, and enhanced ventilation system for this beautiful modern home.",
    location: "Westfield, NJ",
    completedDate: "2024-01-15",
    aspectRatio: 1.5
  },
  {
    id: "2", 
    src: "/images/gallery/siding/full/siding-colonial-renovation-princeton-2023-12-08.jpg",
    alt: "Colonial home siding renovation with fiber cement siding",
    thumbnailSrc: "/images/gallery/siding/thumbnails/siding-colonial-renovation-princeton-2023-12-08-thumb.jpg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Siding"],
    projectTitle: "Siding Renovation - Colonial Style",
    description: "Complete siding replacement with premium fiber cement materials, matching historical colonial aesthetics with modern durability.",
    location: "Princeton, NJ", 
    completedDate: "2023-12-08",
    aspectRatio: 1.3
  },
  {
    id: "3",
    src: "/images/gallery/gutters/full/gutters-seamless-installation-summit-2024-01-22.jpg",
    alt: "Seamless gutter installation on contemporary home",
    thumbnailSrc: "/images/gallery/gutters/thumbnails/gutters-seamless-installation-summit-2024-01-22-thumb.jpg", 
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Gutters"],
    projectTitle: "Seamless Gutter System Installation",
    description: "Custom seamless gutters with leaf protection and decorative downspouts, perfectly matched to home's color scheme.",
    location: "Summit, NJ",
    completedDate: "2024-01-22", 
    aspectRatio: 1.7
  },
  {
    id: "4",
    src: "/images/gallery/commercial/full/commercial-roof-restoration-newark-2023-11-30.jpg",
    alt: "Commercial office building roof restoration",
    thumbnailSrc: "/images/gallery/commercial/thumbnails/commercial-roof-restoration-newark-2023-11-30-thumb.jpg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Commercial", "Roofing"],
    projectTitle: "Commercial Roof Restoration",
    description: "Large-scale commercial roof restoration with EPDM membrane, improved drainage, and energy-efficient insulation upgrade.",
    location: "Newark, NJ",
    completedDate: "2023-11-30",
    aspectRatio: 1.4
  },
  {
    id: "5",
    src: "/images/gallery/windows/full/windows-replacement-victorian-morristown-2024-01-05.jpg", 
    alt: "Window replacement project on Victorian home",
    thumbnailSrc: "/images/gallery/windows/thumbnails/windows-replacement-victorian-morristown-2024-01-05-thumb.jpg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Windows"],
    projectTitle: "Victorian Home Window Replacement",
    description: "Historic window replacement maintaining period authenticity while upgrading to modern energy-efficient double-pane glass.",
    location: "Morristown, NJ",
    completedDate: "2024-01-05",
    aspectRatio: 1.2
  },
  {
    id: "6",
    src: "/images/gallery/chimneys/full/chimneys-restoration-repair-madison-2023-12-15.jpg",
    alt: "Chimney repair and restoration on brick home",
    thumbnailSrc: "/images/gallery/chimneys/thumbnails/chimneys-restoration-repair-madison-2023-12-15-thumb.jpg", 
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Chimneys"],
    projectTitle: "Chimney Restoration & Repair",
    description: "Complete chimney restoration including brick repointing, crown replacement, and installation of new stainless steel liner.",
    location: "Madison, NJ",
    completedDate: "2023-12-15",
    aspectRatio: 1.6
  },
  {
    id: "7",
    src: "/images/gallery/roofing/full/roofing-slate-restoration-chatham-2023-10-28.jpg",
    alt: "Slate roof repair on historic mansion",
    thumbnailSrc: "/images/gallery/roofing/thumbnails/roofing-slate-restoration-chatham-2023-10-28-thumb.jpg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Roofing"],
    projectTitle: "Historic Slate Roof Restoration",
    description: "Meticulous restoration of 100-year-old slate roof, preserving original materials while ensuring structural integrity and weather protection.",
    location: "Chatham, NJ",
    completedDate: "2023-10-28",
    aspectRatio: 1.8
  },
  {
    id: "8",
    src: "/images/gallery/siding/full/siding-mixed-material-contemporary-short-hills-2024-01-10.jpg",
    alt: "Modern home siding installation with mixed materials",
    thumbnailSrc: "/images/gallery/siding/thumbnails/siding-mixed-material-contemporary-short-hills-2024-01-10-thumb.jpg",
    blurDataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFxqJslid7XWO5qLLVLqm2tVSFtKJuFAvbBr2JdOgSPpppJGlBEJPcaBZ",
    serviceTypes: ["Siding"],
    projectTitle: "Contemporary Mixed-Material Siding", 
    description: "Striking modern siding design combining wood accent panels with fiber cement board for contemporary aesthetic and low maintenance.",
    location: "Short Hills, NJ",
    completedDate: "2024-01-10",
    aspectRatio: 1.3
  }
];

// Generate additional projects for testing pagination/filtering
export const extendedProjects = [
  ...sampleProjects,
  // Add more projects by duplicating and modifying existing ones
  ...sampleProjects.map((project, index) => ({
    ...project,
    id: `${project.id}-${index + 10}`,
    projectTitle: `${project.projectTitle} - Additional Project`,
    location: project.location?.replace('NJ', 'NY') || 'New York, NY'
  }))
];