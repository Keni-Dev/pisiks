import { useRef, useState } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import MotionChart from './MotionChart';
import type { GraphDataPoint } from '../lib/types';

interface GraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: GraphDataPoint[];
}

const GraphModal = ({ isOpen, onClose, data }: GraphModalProps) => {
  const chartsContainerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

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

      // Set canvas dimensions (adjust based on your needs)
      const width = 1200;
      const height = 800;
      mainCanvas.width = width;
      mainCanvas.height = height;

      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

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

      // Add title
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Motion Graphs', width / 2, 50);

      // Draw each chart
      let yOffset = 100;
      for (let i = 0; i < svgElements.length; i++) {
        const svg = svgElements[i] as SVGElement;
        const img = await svgToImage(svg);
        
        // Add chart title
        ctx.fillStyle = '#374151';
        ctx.font = '600 20px sans-serif';
        ctx.textAlign = 'left';
        const title = i === 0 ? 'Velocity vs Time' : 'Displacement vs Time';
        ctx.fillText(title, 60, yOffset);
        
        // Draw the chart
        ctx.drawImage(img, 50, yOffset + 10, width - 100, 300);
        yOffset += 350;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-2xl w-[95%] max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Motion Graphs</h2>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Download as PNG
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Charts Container */}
        <div className="flex-1 overflow-y-auto p-6">
          <div ref={chartsContainerRef} className="space-y-8 bg-white p-6 rounded-lg">
            {/* Velocity vs Time Chart */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
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
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
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
