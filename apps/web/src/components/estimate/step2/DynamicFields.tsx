import React from "react";
import { cn } from "@/lib/utils";

export interface DynamicFieldValues {
  squareFootage?: number;
  linearFeet?: number;
  chimneyCount?: number;
  windowCount?: number;
  windowSize?: 'standard' | 'large' | 'custom';
  sidingMaterial?: 'vinyl' | 'fiber-cement' | 'wood';
}

export interface DynamicFieldsProps {
  selectedServices: string[];
  values: DynamicFieldValues;
  onChange: (values: DynamicFieldValues) => void;
  className?: string;
}

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => (
  <div className="relative group">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
      <div className="bg-neutral-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-neutral-900"></div>
      </div>
    </div>
  </div>
);

const DynamicFields = React.forwardRef<HTMLDivElement, DynamicFieldsProps>(
  ({ selectedServices, values, onChange, className }, ref) => {
    const updateValue = (field: keyof DynamicFieldValues, value: any) => {
      onChange({ ...values, [field]: value });
    };

    const hasRoofing = selectedServices.includes('roofing') || selectedServices.includes('siding') || selectedServices.includes('insulation');
    const hasGutters = selectedServices.includes('gutters');
    const hasChimney = selectedServices.includes('chimney');
    const hasWindows = selectedServices.includes('windows');
    const hasSiding = selectedServices.includes('siding');

    if (selectedServices.length === 0) {
      return null;
    }

    return (
      <div 
        ref={ref} 
        className={cn(
          "space-y-6 animate-in slide-in-from-top-4 fade-in-0 duration-250",
          className
        )}
      >
        <div className="border-t border-neutral-200 pt-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Project Details
          </h3>
          <p className="text-sm text-neutral-600 mb-6">
            Provide additional details to get a more accurate estimate.
          </p>

          <div className="space-y-4">
            {/* Square Footage Slider */}
            {hasRoofing && (
              <div className="animate-in slide-in-from-left-4 fade-in-0 duration-250">
                <div className="flex items-center gap-2 mb-2">
                  <label htmlFor="squareFootage" className="text-sm font-medium text-neutral-700">
                    Square Footage
                  </label>
                  <Tooltip content="Approximate square footage of the area to be worked on">
                    <svg className="w-4 h-4 text-neutral-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </Tooltip>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    id="squareFootage"
                    min="500"
                    max="5000"
                    step="100"
                    value={values.squareFootage || 1500}
                    onChange={(e) => updateValue('squareFootage', parseInt(e.target.value))}
                    className="w-full h-2 bg-neutral-200 rounded-lg cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgb(139, 21, 56) 0%, rgb(139, 21, 56) ${((values.squareFootage || 1500) - 500) / 4500 * 100}%, #e5e7eb ${((values.squareFootage || 1500) - 500) / 4500 * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>500 sq ft</span>
                    <span className="font-medium text-primary-burgundy">
                      {(values.squareFootage || 1500).toLocaleString()} sq ft
                    </span>
                    <span>5,000 sq ft</span>
                  </div>
                </div>
              </div>
            )}

            {/* Linear Feet Input */}
            {hasGutters && (
              <div className="animate-in slide-in-from-left-4 fade-in-0 duration-250 delay-100">
                <div className="flex items-center gap-2 mb-2">
                  <label htmlFor="linearFeet" className="text-sm font-medium text-neutral-700">
                    Linear Feet of Gutters
                  </label>
                  <Tooltip content="Total linear feet of gutters around your home's perimeter">
                    <svg className="w-4 h-4 text-neutral-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </Tooltip>
                </div>
                <input
                  type="number"
                  id="linearFeet"
                  min="50"
                  max="500"
                  value={values.linearFeet || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (isNaN(value)) {
                      updateValue('linearFeet', undefined);
                    } else if (value >= 50 && value <= 500) {
                      updateValue('linearFeet', value);
                    }
                  }}
                  onBlur={(e) => {
                    // Ensure value is within bounds on blur
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value < 50) {
                      updateValue('linearFeet', 50);
                    } else if (!isNaN(value) && value > 500) {
                      updateValue('linearFeet', 500);
                    }
                  }}
                  placeholder="Enter linear feet (e.g., 120)"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-burgundy focus:border-primary-burgundy"
                  aria-label="Linear feet of gutters (between 50 and 500)"
                  aria-describedby="linearFeet-help"
                />
                <p id="linearFeet-help" className="text-xs text-neutral-500 mt-1">
                  Enter a value between 50 and 500 linear feet
                </p>
              </div>
            )}

            {/* Chimney Count */}
            {hasChimney && (
              <div className="animate-in slide-in-from-left-4 fade-in-0 duration-250 delay-200">
                <div className="flex items-center gap-2 mb-2">
                  <label htmlFor="chimneyCount" className="text-sm font-medium text-neutral-700">
                    Number of Chimneys
                  </label>
                </div>
                <select
                  id="chimneyCount"
                  value={values.chimneyCount || ''}
                  onChange={(e) => updateValue('chimneyCount', parseInt(e.target.value) || undefined)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-burgundy focus:border-primary-burgundy"
                >
                  <option value="">Select number of chimneys</option>
                  <option value="1">1 Chimney</option>
                  <option value="2">2 Chimneys</option>
                  <option value="3">3 Chimneys</option>
                  <option value="4">4+ Chimneys</option>
                </select>
              </div>
            )}

            {/* Window Details */}
            {hasWindows && (
              <div className="animate-in slide-in-from-left-4 fade-in-0 duration-250 delay-300 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label htmlFor="windowCount" className="text-sm font-medium text-neutral-700">
                      Number of Windows
                    </label>
                  </div>
                  <input
                    type="number"
                    id="windowCount"
                    min="1"
                    max="50"
                    value={values.windowCount || ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (isNaN(value)) {
                        updateValue('windowCount', undefined);
                      } else if (value >= 1 && value <= 50) {
                        updateValue('windowCount', value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value < 1) {
                        updateValue('windowCount', 1);
                      } else if (!isNaN(value) && value > 50) {
                        updateValue('windowCount', 50);
                      }
                    }}
                    placeholder="Enter number of windows"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-burgundy focus:border-primary-burgundy"
                    aria-label="Number of windows to replace (between 1 and 50)"
                    aria-describedby="windowCount-help"
                  />
                  <p id="windowCount-help" className="text-xs text-neutral-500 mt-1">
                    Enter between 1 and 50 windows
                  </p>
                </div>
                <div>
                  <label htmlFor="windowSize" className="text-sm font-medium text-neutral-700 mb-2 block">
                    Window Size
                  </label>
                  <select
                    id="windowSize"
                    value={values.windowSize || ''}
                    onChange={(e) => updateValue('windowSize', e.target.value as DynamicFieldValues['windowSize'])}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-burgundy focus:border-primary-burgundy"
                  >
                    <option value="">Select window size</option>
                    <option value="standard">Standard (up to 3x4 ft)</option>
                    <option value="large">Large (4x6 ft or larger)</option>
                    <option value="custom">Custom sizes</option>
                  </select>
                </div>
              </div>
            )}

            {/* Siding Material */}
            {hasSiding && (
              <div className="animate-in slide-in-from-left-4 fade-in-0 duration-250 delay-400">
                <label htmlFor="sidingMaterial" className="text-sm font-medium text-neutral-700 mb-2 block">
                  Preferred Siding Material
                </label>
                <select
                  id="sidingMaterial"
                  value={values.sidingMaterial || ''}
                  onChange={(e) => updateValue('sidingMaterial', e.target.value as DynamicFieldValues['sidingMaterial'])}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-burgundy focus:border-primary-burgundy"
                >
                  <option value="">Select material preference</option>
                  <option value="vinyl">Vinyl Siding</option>
                  <option value="fiber-cement">Fiber Cement</option>
                  <option value="wood">Wood Siding</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

DynamicFields.displayName = "DynamicFields";

export { DynamicFields };