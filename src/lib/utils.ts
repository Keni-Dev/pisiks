import type { GraphDataPoint } from './types';

/**
 * Exports simulation data as a CSV file
 * @param data - Array of data points containing time, velocity, and displacement
 * @param filename - Name of the file to download
 */
export function exportDataAsCsv(data: GraphDataPoint[], filename: string): void {
  // Create CSV header
  const header = 'time,velocity,displacement';
  
  // Convert data to CSV rows
  const rows = data.map(point => 
    `${point.t.toFixed(3)},${point.v.toFixed(3)},${point.s.toFixed(3)}`
  );
  
  // Combine header and rows
  const csvContent = [header, ...rows].join('\n');
  
  // Create a Blob from the CSV string
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL
  URL.revokeObjectURL(url);
}
