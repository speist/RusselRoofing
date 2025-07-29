import React from 'react';

export function ServiceAreaMap() {
  // TODO: Implement interactive map with Google Maps or Mapbox
  // This is a placeholder implementation showing service areas and completed projects
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
      {/* Map Header */}
      <div className="bg-[#960120] text-white p-4">
        <h3 className="text-xl font-semibold mb-2">Our Service Area</h3>
        <p className="text-sm opacity-90">
          Proudly serving homeowners throughout New Jersey
        </p>
      </div>

      {/* Map Placeholder */}
      <div className="h-96 bg-gray-100 relative flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-600 mb-2">Interactive Service Area Map</p>
          <p className="text-sm text-gray-500">
            Map integration coming soon - will show completed projects and service coverage
          </p>
        </div>
        
        {/* Service Area Overlay */}
        <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-md">
          <h4 className="font-semibold text-sm mb-2">Service Radius</h4>
          <p className="text-xs text-gray-600">50 miles from our location</p>
        </div>
      </div>

      {/* Service Area Details */}
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Primary Service Areas */}
          <div>
            <h4 className="font-semibold text-lg mb-3 text-[#960120]">Primary Service Areas</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Morris County
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Essex County
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Union County
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Somerset County
              </li>
            </ul>
          </div>

          {/* Recent Projects */}
          <div>
            <h4 className="font-semibold text-lg mb-3 text-[#960120]">Recent Project Locations</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Westfield - Complete Roof Replacement
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Chatham - Slate Restoration
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Princeton - Siding Installation
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Summit - Gutter Installation
              </li>
            </ul>
          </div>
        </div>

        {/* Service Area Note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h5 className="font-medium text-blue-800 mb-1">Extended Service Area Available</h5>
              <p className="text-sm text-blue-700">
                Don&apos;t see your location listed? We may still be able to help! Contact us to discuss service availability in your area.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}