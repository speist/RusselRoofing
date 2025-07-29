"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { LazyImage } from "@/components/ui/LazyImage";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface InstagramPost {
  id: string;
  media_url: string;
  caption?: string;
  permalink: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  timestamp: string;
}

interface InstagramResponse {
  posts: InstagramPost[];
  error?: string;
}

// Fallback images when API is unavailable
const FALLBACK_IMAGES = [
  {
    id: 'fallback-1',
    media_url: '/images/fallback/roofing-1.jpg',
    caption: 'Expert roofing craftsmanship',
    permalink: 'https://instagram.com/russellroofingcompany',
    media_type: 'IMAGE' as const,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'fallback-2',
    media_url: '/images/fallback/roofing-2.jpg',
    caption: 'Quality materials and installation',
    permalink: 'https://instagram.com/russellroofingcompany',
    media_type: 'IMAGE' as const,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'fallback-3',
    media_url: '/images/fallback/roofing-3.jpg',
    caption: 'Professional roofing solutions',
    permalink: 'https://instagram.com/russellroofingcompany',
    media_type: 'IMAGE' as const,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'fallback-4',
    media_url: '/images/fallback/roofing-4.jpg',
    caption: 'Trusted by homeowners',
    permalink: 'https://instagram.com/russellroofingcompany',
    media_type: 'IMAGE' as const,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'fallback-5',
    media_url: '/images/fallback/roofing-5.jpg',
    caption: 'Excellence in every project',
    permalink: 'https://instagram.com/russellroofingcompany',
    media_type: 'IMAGE' as const,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'fallback-6',
    media_url: '/images/fallback/roofing-6.jpg',
    caption: 'Your roofing partner',
    permalink: 'https://instagram.com/russellroofingcompany',
    media_type: 'IMAGE' as const,
    timestamp: new Date().toISOString(),
  },
];

export function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/instagram', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data: InstagramResponse = await response.json();

        if (data.error || !response.ok) {
          console.warn('Instagram API error, using fallback content:', data.error);
          setPosts(FALLBACK_IMAGES);
          setError('Using demo content');
        } else {
          // If we have fewer than 6 posts, pad with fallback images
          const allPosts = [...data.posts];
          if (allPosts.length < 6) {
            const fallbacksNeeded = FALLBACK_IMAGES.slice(allPosts.length);
            allPosts.push(...fallbacksNeeded);
          }
          setPosts(allPosts.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to fetch Instagram posts:', err);
        setPosts(FALLBACK_IMAGES);
        setError('Using demo content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  const truncateCaption = (caption: string | undefined, maxLength: number = 80): string => {
    if (!caption) return '';
    return caption.length > maxLength ? `${caption.substring(0, maxLength)}...` : caption;
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-primary-charcoal mb-4">
            Follow Our Latest Work
          </h2>
          <p className="text-lg text-secondary-warm-gray max-w-2xl mx-auto mb-8">
            See our most recent projects and updates from the field. Follow us on Instagram to stay connected with our craftsmanship.
          </p>
          
          {error && (
            <div className="mb-6">
              <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg inline-block">
                {error === 'Using demo content' 
                  ? 'Currently showing demo content. Live Instagram feed will be available soon.' 
                  : error
                }
              </p>
            </div>
          )}
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-12">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="aspect-square">
                <Skeleton aspectRatio={1} className="w-full h-full rounded-lg" />
              </div>
            ))
          ) : (
            posts.map((post, index) => (
              <div
                key={post.id}
                className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                onMouseEnter={() => setHoveredPost(post.id)}
                onMouseLeave={() => setHoveredPost(null)}
                onClick={() => window.open(post.permalink, '_blank', 'noopener,noreferrer')}
              >
                <LazyImage
                  src={post.media_url}
                  alt={post.caption || `Instagram post ${index + 1}`}
                  className="w-full h-full"
                  aspectRatio={1}
                />
                
                {/* Hover Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 bg-black/60 flex items-center justify-center p-4 transition-opacity duration-300",
                    hoveredPost === post.id ? "opacity-100" : "opacity-0"
                  )}
                >
                  {/* Instagram Icon */}
                  <div className="text-center text-white">
                    <svg
                      className="w-8 h-8 mx-auto mb-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.017 0C8.396 0 7.929.016 6.706.084 5.481.153 4.677.39 3.967.735a5.84 5.84 0 0 0-2.109 1.374A5.862 5.862 0 0 0 .482 4.218c-.345.71-.582 1.514-.65 2.739C-.085 8.18-.1 8.647-.1 12.017c0 3.37.014 3.837.083 5.061.069 1.225.305 2.029.65 2.739.345.71.858 1.423 1.374 2.109.686.686 1.398 1.029 2.109 1.374.71.345 1.514.582 2.739.65 1.225.069 1.692.083 5.061.083 3.37 0 3.837-.014 5.061-.083 1.225-.069 2.029-.305 2.739-.65a5.84 5.84 0 0 0 2.109-1.374 5.862 5.862 0 0 0 1.374-2.109c.345-.71.582-1.514.65-2.739.069-1.224.083-1.691.083-5.061 0-3.37-.014-3.837-.083-5.061-.069-1.225-.305-2.029-.65-2.739a5.862 5.862 0 0 0-1.374-2.109A5.84 5.84 0 0 0 19.728.735c-.71-.345-1.514-.582-2.739-.65C15.765.016 15.298 0 11.927 0h.09zm-.09 1.982c3.317 0 3.708.014 5.018.081 1.212.055 1.871.256 2.31.425.58.225 1.014.497 1.459.942.445.445.717.879.942 1.459.169.439.37 1.098.425 2.31.067 1.31.081 1.701.081 5.018 0 3.317-.014 3.708-.081 5.018-.055 1.212-.256 1.871-.425 2.31a3.927 3.927 0 0 1-.942 1.459c-.445.445-.879.717-1.459.942-.439.169-1.098.37-2.31.425-1.31.067-1.701.081-5.018.081-3.317 0-3.708-.014-5.018-.081-1.212-.055-1.871-.256-2.31-.425a3.927 3.927 0 0 1-1.459-.942 3.927 3.927 0 0 1-.942-1.459c-.169-.439-.37-1.098-.425-2.31-.067-1.31-.081-1.701-.081-5.018 0-3.317.014-3.708.081-5.018.055-1.212.256-1.871.425-2.31.225-.58.497-1.014.942-1.459a3.927 3.927 0 0 1 1.459-.942c.439-.169 1.098-.37 2.31-.425 1.31-.067 1.701-.081 5.018-.081zM5.838 12.017a6.179 6.179 0 1 1 12.358 0 6.179 6.179 0 0 1-12.358 0zm2.27 0a3.909 3.909 0 1 0 7.818 0 3.909 3.909 0 0 0-7.818 0zm7.846-6.179a1.441 1.441 0 1 1 2.883 0 1.441 1.441 0 0 1-2.883 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {post.caption && (
                      <p className="text-sm font-medium leading-tight">
                        {truncateCaption(post.caption, 60)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Post Type Indicator */}
                {post.media_type === 'CAROUSEL_ALBUM' && (
                  <div className="absolute top-3 right-3">
                    <svg
                      className="w-5 h-5 text-white drop-shadow-md"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM16 19H8V5h8v14z" />
                      <path d="M10 7h4v2h-4zm0 4h4v2h-4zm0 4h4v2h-4z" />
                    </svg>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Follow Us CTA */}
        <div className="text-center">
          <Button
            variant="primary"
            size="lg"
            className="px-8 py-4"
            onClick={() => window.open('https://instagram.com/russellroofingcompany', '_blank', 'noopener,noreferrer')}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.017 0C8.396 0 7.929.016 6.706.084 5.481.153 4.677.39 3.967.735a5.84 5.84 0 0 0-2.109 1.374A5.862 5.862 0 0 0 .482 4.218c-.345.71-.582 1.514-.65 2.739C-.085 8.18-.1 8.647-.1 12.017c0 3.37.014 3.837.083 5.061.069 1.225.305 2.029.65 2.739.345.71.858 1.423 1.374 2.109.686.686 1.398 1.029 2.109 1.374.71.345 1.514.582 2.739.65 1.225.069 1.692.083 5.061.083 3.37 0 3.837-.014 5.061-.083 1.225-.069 2.029-.305 2.739-.65a5.84 5.84 0 0 0 2.109-1.374 5.862 5.862 0 0 0 1.374-2.109c.345-.71.582-1.514.65-2.739.069-1.224.083-1.691.083-5.061 0-3.37-.014-3.837-.083-5.061-.069-1.225-.305-2.029-.65-2.739a5.862 5.862 0 0 0-1.374-2.109A5.84 5.84 0 0 0 19.728.735c-.71-.345-1.514-.582-2.739-.65C15.765.016 15.298 0 11.927 0h.09zm-.09 1.982c3.317 0 3.708.014 5.018.081 1.212.055 1.871.256 2.31.425.58.225 1.014.497 1.459.942.445.445.717.879.942 1.459.169.439.37 1.098.425 2.31.067 1.31.081 1.701.081 5.018 0 3.317-.014 3.708-.081 5.018-.055 1.212-.256 1.871-.425 2.31a3.927 3.927 0 0 1-.942 1.459c-.445.445-.879.717-1.459.942-.439.169-1.098.37-2.31.425-1.31.067-1.701.081-5.018.081-3.317 0-3.708-.014-5.018-.081-1.212-.055-1.871-.256-2.31-.425a3.927 3.927 0 0 1-1.459-.942 3.927 3.927 0 0 1-.942-1.459c-.169-.439-.37-1.098-.425-2.31-.067-1.31-.081-1.701-.081-5.018 0-3.317.014-3.708.081-5.018.055-1.212.256-1.871.425-2.31.225-.58.497-1.014.942-1.459a3.927 3.927 0 0 1 1.459-.942c.439-.169 1.098-.37 2.31-.425 1.31-.067 1.701-.081 5.018-.081zM5.838 12.017a6.179 6.179 0 1 1 12.358 0 6.179 6.179 0 0 1-12.358 0zm2.27 0a3.909 3.909 0 1 0 7.818 0 3.909 3.909 0 0 0-7.818 0zm7.846-6.179a1.441 1.441 0 1 1 2.883 0 1.441 1.441 0 0 1-2.883 0z"
                clipRule="evenodd"
              />
            </svg>
            Follow Us on Instagram
          </Button>
        </div>
      </div>
    </section>
  );
}