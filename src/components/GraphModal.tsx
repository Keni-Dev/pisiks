import { useRef } from 'react';
import { X, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import MotionChart from './MotionChart';
import type { GraphDataPoint } from '../lib/types';

interface GraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: GraphDataPoint[];
}

const GraphModal = ({ isOpen, onClose, data }: GraphModalProps) => {
  const chartsContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!chartsContainerRef.current) return;

    try {
      // Use html2canvas to capture the charts container
      const canvas = await html2canvas(chartsContainerRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality export
        logging: false,
        useCORS: true,
      });

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
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
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={18} />
              Download as PNG
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
