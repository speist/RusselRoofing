import { NextRequest, NextResponse } from 'next/server';
import { CompanyCamClient } from '@/lib/companycam/client';

/**
 * DEBUG ENDPOINT - GET /api/companycam/debug
 *
 * Shows raw data from CompanyCam to help debug tag filtering issues
 * This endpoint bypasses all filtering to show exactly what's in CompanyCam
 */
export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.COMPANYCAM_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        error: 'COMPANYCAM_API_KEY not configured'
      }, { status: 500 });
    }

    const client = new CompanyCamClient(apiKey);

    // Fetch raw data from CompanyCam
    const projects = await client.get<any>('/projects?per_page=10');

    const debugInfo: any = {
      api_key_configured: true,
      projects_count: projects.data?.length || 0,
      projects: [],
    };

    // For each project, get photos and their tags
    if (projects.data && projects.data.length > 0) {
      for (const project of projects.data.slice(0, 3)) { // Limit to first 3 projects for debugging
        const projectInfo: any = {
          id: project.id,
          name: project.name,
          photos_count: 0,
          photos: [],
        };

        try {
          const photos = await client.get<any>(`/projects/${project.id}/photos?per_page=20`);
          projectInfo.photos_count = photos.data?.length || 0;

          if (photos.data && photos.data.length > 0) {
            // Get first 5 photos from this project
            for (const photo of photos.data.slice(0, 5)) {
              const photoInfo: any = {
                id: photo.id,
                uri: photo.uri,
                uris: photo.uris,
                captured_at: photo.captured_at,
                internal: photo.internal,
                tags: [],
              };

              // Fetch tags for this photo
              try {
                const tagsResponse = await client.get<any>(`/photos/${photo.id}/tags`);
                if (tagsResponse.data) {
                  photoInfo.tags = tagsResponse.data.map((tag: any) => ({
                    id: tag.id,
                    name: tag.name,
                    color: tag.color,
                  }));
                }
              } catch (error) {
                photoInfo.tags_error = error instanceof Error ? error.message : 'Failed to fetch tags';
              }

              projectInfo.photos.push(photoInfo);
            }
          }
        } catch (error) {
          projectInfo.photos_error = error instanceof Error ? error.message : 'Failed to fetch photos';
        }

        debugInfo.projects.push(projectInfo);
      }
    }

    // Add filtering requirements for reference
    debugInfo.filtering_requirements = {
      master_tag: 'RR Website',
      service_tags: [
        'Commercial',
        'Siding',
        'Gutters',
        'Roofing',
        'Churches',
        'Institutions',
        'Historical',
        'Restoration',
        'Masonry',
        'Windows',
        'Skylight',
      ],
      note: 'Photos must have the master tag AND at least one service tag (case-insensitive)',
    };

    return NextResponse.json(debugInfo, { status: 200 });

  } catch (error) {
    console.error('[CompanyCam Debug] Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
