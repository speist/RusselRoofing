"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FloatingPageLayout from "@/components/layout/FloatingPageLayout";
import { ArrowLeft, Calendar } from "lucide-react";

interface CommunityActivity {
  id: string;
  properties: {
    name: string;
    description?: string;
    year?: number;
    impact?: string;
    image_url?: string;
    summary?: string;
    live: string;
  };
}

// Utility function to extract video ID from various video URL formats
const extractVideoId = (url: string): { platform: string; id: string } | null => {
  if (!url) return null;

  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match) {
      return { platform: 'youtube', id: match[1] };
    }
  }

  // Vimeo patterns
  const vimeoPatterns = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/
  ];

  for (const pattern of vimeoPatterns) {
    const match = url.match(pattern);
    if (match) {
      return { platform: 'vimeo', id: match[1] };
    }
  }

  return null;
};

// Component to render video embed
const VideoEmbed = ({ url }: { url: string }) => {
  const videoInfo = extractVideoId(url);

  if (!videoInfo) {
    // If not a recognized video platform, try to display as image
    return (
      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
        <Image
          src={url}
          alt="Activity media"
          width={1280}
          height={720}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (videoInfo.platform === 'youtube') {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoInfo.id}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  if (videoInfo.platform === 'vimeo') {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <iframe
          src={`https://player.vimeo.com/video/${videoInfo.id}`}
          title="Vimeo video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  return null;
};

export default function CommunityActivityPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [activity, setActivity] = useState<CommunityActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/hubspot/community?slug=${slug}`);
        const data = await response.json();

        if (data.success && data.data) {
          setActivity(data.data);
        } else {
          setError(data.error || 'Activity not found');
        }
      } catch (err) {
        console.error('Failed to fetch community activity:', err);
        setError('Failed to load community activity');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchActivity();
    }
  }, [slug]);

  if (loading) {
    return (
      <FloatingPageLayout>
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
              <div className="h-12 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-8"></div>
              <div className="w-full aspect-video bg-gray-300 rounded-lg mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </section>
      </FloatingPageLayout>
    );
  }

  if (error || !activity) {
    return (
      <FloatingPageLayout>
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
              {error || 'Activity not found'}
            </h1>
            <p className="font-body text-text-secondary mb-8">
              The community activity you&rsquo;re looking for doesn&rsquo;t exist or has been removed.
            </p>
            <Link
              href="/community"
              className="inline-flex items-center font-body text-primary-burgundy font-medium hover:text-primary-charcoal transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Community
            </Link>
          </div>
        </section>
      </FloatingPageLayout>
    );
  }

  return (
    <FloatingPageLayout>
      <article className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/community"
            className="inline-flex items-center font-body text-primary-burgundy font-medium hover:text-primary-charcoal transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Community
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-6">
              {activity.properties.name}
            </h1>

            {/* Activity Meta */}
            {activity.properties.year && (
              <div className="flex items-center gap-6 text-sm text-text-secondary border-t border-b border-gray-200 py-4 mb-8">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{activity.properties.year}</span>
                </div>
              </div>
            )}
          </header>

          {/* Video/Image Embed */}
          {activity.properties.image_url && (
            <div className="mb-8">
              <VideoEmbed url={activity.properties.image_url} />
            </div>
          )}

          {/* Summary Content */}
          {activity.properties.summary && (
            <div className="prose prose-lg max-w-none
              prose-headings:font-display prose-headings:text-text-primary prose-headings:font-bold
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:font-body prose-p:text-text-secondary prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-primary-burgundy prose-a:no-underline hover:prose-a:underline
              prose-strong:text-text-primary prose-strong:font-semibold
              prose-ul:font-body prose-ul:my-6 prose-ul:space-y-2
              prose-ol:font-body prose-ol:my-6 prose-ol:space-y-2
              prose-li:text-text-secondary
              mb-12"
              dangerouslySetInnerHTML={{ __html: activity.properties.summary }}
            />
          )}

          {/* Description Fallback */}
          {!activity.properties.summary && activity.properties.description && (
            <div className="prose prose-lg max-w-none
              prose-p:font-body prose-p:text-text-secondary prose-p:leading-relaxed prose-p:mb-6
              mb-12">
              <p>{activity.properties.description}</p>
            </div>
          )}

          {/* Impact Section */}
          {activity.properties.impact && (
            <div className="bg-[#F5F3F0] p-6 rounded-lg border-l-4 border-[#960120] mb-12">
              <h2 className="text-xl font-bold text-text-primary mb-3">Impact</h2>
              <p className="text-text-secondary leading-relaxed">
                {activity.properties.impact}
              </p>
            </div>
          )}

          {/* Article Footer */}
          <footer className="border-t border-gray-200 pt-8">
            <Link
              href="/community"
              className="inline-flex items-center font-body text-primary-burgundy font-medium hover:text-primary-charcoal transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Community
            </Link>
          </footer>
        </div>
      </article>
    </FloatingPageLayout>
  );
}
