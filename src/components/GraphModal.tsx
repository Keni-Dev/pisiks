import { useRef, useState } from 'react';
import { X, Download, Loader2, FileDown } from 'lucide-react';
import MotionChart from './MotionChart';
import type { GraphDataPoint } from '../lib/types';
import { exportDataAsCsv } from '../lib/utils';

interface GraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: GraphDataPoint[];
}

const GraphModal = ({ isOpen, onClose, data }: GraphModalProps) => {
  const chartsContainerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadCsv = () => {
    const timestamp = Date.now();
    const filename = `motion_data_${timestamp}.csv`;
    exportDataAsCsv(data, filename);
  };

  const handleDownload = async () => {
    if (!chartsContainerRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      // Create a new canvas to draw both charts
      const mainCanvas = document.createElement('canvas');
      const ctx = mainCanvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Get the actual container dimensions to match screen size
      const containerRect = chartsContainerRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 640;
      
      // Set canvas dimensions based on screen size and device pixel ratio for sharp images
      const pixelRatio = window.devicePixelRatio || 1;
      const width = Math.min(containerRect.width * pixelRatio, isMobile ? 800 : 1200);
      const height = isMobile ? 1000 : 800;
      
      mainCanvas.width = width;
      mainCanvas.height = height;
      
      // Scale context to match pixel ratio
      ctx.scale(pixelRatio, pixelRatio);
      
      // Use logical dimensions for drawing
      const logicalWidth = width / pixelRatio;
      const logicalHeight = height / pixelRatio;

      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);

      // Get all SVG elements (Recharts renders as SVG)
      const svgElements = chartsContainerRef.current.querySelectorAll('svg');
      
      if (svgElements.length === 0) {
        throw new Error('No charts found to export');
      }

      // Function to convert SVG to image
      const svgToImage = (svg: SVGElement): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          // Clone the SVG to avoid modifying the original
          const clonedSvg = svg.cloneNode(true) as SVGElement;
          
          // Helper function to convert computed styles to RGB
          const convertColors = (element: Element) => {
            const computedStyle = window.getComputedStyle(element);
            
            // Convert color properties that might use oklch
            ['fill', 'stroke', 'color'].forEach(prop => {
              const value = computedStyle.getPropertyValue(prop);
              if (value && value !== 'none' && value !== 'transparent') {
                (element as HTMLElement).style.setProperty(prop, value);
              }
            });
            
            // Recursively process children
            Array.from(element.children).forEach(child => convertColors(child));
          };
          
          // Convert all colors in the cloned SVG
          convertColors(clonedSvg);
          
          const svgData = new XMLSerializer().serializeToString(clonedSvg);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);
          
          const img = new Image();
          img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
          };
          img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load SVG as image'));
          };
          img.src = url;
        });
      };

      // Responsive sizing for title and charts
      const titleSize = isMobile ? 20 : 28;
      const subtitleSize = isMobile ? 14 : 20;
      const padding = isMobile ? 30 : 50;
      const chartHeight = isMobile ? 280 : 300;
      const chartSpacing = isMobile ? 280 : 350;

      // Add title
      ctx.fillStyle = '#1f2937';
      ctx.font = `bold ${titleSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('Motion Graphs', logicalWidth / 2, isMobile ? 30 : 50);

      // Draw each chart
      let yOffset = isMobile ? 60 : 100;
      for (let i = 0; i < svgElements.length; i++) {
        const svg = svgElements[i] as SVGElement;
        const img = await svgToImage(svg);
        
        // Add chart title
        ctx.fillStyle = '#374151';
        ctx.font = `600 ${subtitleSize}px sans-serif`;
        ctx.textAlign = 'left';
        const title = i === 0 ? 'Velocity vs Time' : 'Displacement vs Time';
        ctx.fillText(title, padding, yOffset);
        
        // Draw the chart with proper aspect ratio
        const chartWidth = logicalWidth - (padding * 2);
        ctx.drawImage(img, padding, yOffset + 10, chartWidth, chartHeight);
        yOffset += chartSpacing;
      }

      // Convert to blob and download
      mainCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `motion-graphs-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');

    } catch (error) {
      console.error('Error generating PNG:', error);
      alert(`Failed to download image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Motion Graphs</h2>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadCsv}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-1 sm:flex-initial"
            >
              <FileDown size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline">Download </span>CSV
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-initial"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={16} className="animate-spin sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden xs:inline">Downloading...</span>
                  <span className="xs:hidden">...</span>
                </>
              ) : (
                <>
                  <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden xs:inline">Download </span>PNG
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={20} className="sm:w-6 sm:h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Charts Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          <div ref={chartsContainerRef} className="space-y-4 sm:space-y-8 bg-white p-2 sm:p-6 rounded-lg">
            {/* Velocity vs Time Chart */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-4">
                Velocity vs Time
              </h3>
              <MotionChart
                data={data}
                xKey="t"
                yKey="v"
                yLabel="Velocity (m/s)"
                lineColor="#3B82F6"
              />
            </div>

            {/* Displacement vs Time Chart */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-4">
                Displacement vs Time
              </h3>
              <MotionChart
                data={data}
                xKey="t"
                yKey="s"
                yLabel="Displacement (m)"
                lineColor="#10B981"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphModal;
