'use client';

import React, { useEffect, useRef, useState } from 'react';

interface InteractiveServiceAreaMapProps {
  className?: string;
}

export function InteractiveServiceAreaMap({ className }: InteractiveServiceAreaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait for Google Maps to be fully loaded
    const initializeMap = () => {
      if (typeof window === 'undefined' || !window.google?.maps) {
        return false;
      }

      if (!mapRef.current) return false;

      try {
        // Russell Roofing location (approximate center of service area in NJ)
        // Using Place ID: ChIJ-3HLW2e6xokRgQO_Kkkp9dQ
        const russellLocation = {
          lat: 40.7589, // Morristown, NJ (approximate)
          lng: -74.4793,
        };

        // Create map centered on Russell Roofing location
        const map = new window.google.maps.Map(mapRef.current, {
          center: russellLocation,
          zoom: 9, // Show wider area to display 50-mile radius
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }], // Hide POI labels for cleaner look
            },
          ],
        });

        // Add marker for Russell Roofing location
        const marker = new window.google.maps.Marker({
          position: russellLocation,
          map: map,
          title: 'Russell Roofing & Exteriors',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#960120',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; font-family: Inter, sans-serif;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #960120;">
                Russell Roofing & Exteriors
              </h3>
              <p style="margin: 0; font-size: 14px; color: #4a5568;">
                Serving New Jersey for over 100 years
              </p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        // Draw 50-mile service radius circle
        const serviceCircle = new window.google.maps.Circle({
          strokeColor: '#960120',
          strokeOpacity: 0.6,
          strokeWeight: 2,
          fillColor: '#960120',
          fillOpacity: 0.15,
          map: map,
          center: russellLocation,
          radius: 50 * 1609.34, // 50 miles in meters
        });

        setMapLoaded(true);
        return true;
      } catch (err) {
        console.error('[InteractiveServiceAreaMap] Error initializing map:', err);
        setError('Failed to initialize map');
        return false;
      }
    };

    // Try to initialize immediately
    if (initializeMap()) {
      return;
    }

    // If not ready, wait for Google Maps to load
    const checkInterval = setInterval(() => {
      if (initializeMap()) {
        clearInterval(checkInterval);
      }
    }, 100);

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      if (!mapLoaded) {
        setError('Google Maps failed to load');
      }
    }, 10000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, [mapLoaded]);

  if (error) {
    return (
      <div className={`h-96 bg-gray-100 relative flex items-center justify-center ${className || ''}`}>
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-600 mb-2">Map Unavailable</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className || ''}`}>
      <div
        ref={mapRef}
        className="w-full h-96 rounded-lg"
        style={{ minHeight: '384px' }}
      />

      {/* Service Area Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg border border-gray-200">
        <h4 className="font-semibold text-sm mb-2 text-gray-900">Service Area</h4>
        <div className="flex items-center text-xs text-gray-700">
          <div className="w-4 h-4 rounded-full bg-[#960120] opacity-20 border-2 border-[#960120] mr-2"></div>
          <span>50-mile radius</span>
        </div>
      </div>

      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#960120] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
