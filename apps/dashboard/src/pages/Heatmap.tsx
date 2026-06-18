import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getHeatmapData } from '../services/api';
import HeatmapCanvas from '../components/HeatmapCanvas';

export default function Heatmap() {
  const [pageUrl, setPageUrl] = useState('http://localhost:3000/demo');
  const [inputUrl, setInputUrl] = useState('http://localhost:3000/demo');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['heatmap', pageUrl],
    queryFn: () => getHeatmapData(pageUrl),
    enabled: !!pageUrl,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPageUrl(inputUrl);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Click Heatmap</h3>
          <p className="text-sm text-slate-500 mt-1">Visualize user clicks across your pages</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-80 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            placeholder="Enter page URL..."
          />
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Load Heatmap
          </button>
        </form>
      </div>

      <div className="flex-1 bg-slate-100 relative overflow-auto flex items-center justify-center p-8">
        {isLoading ? (
          <div className="flex flex-col items-center text-slate-500 animate-pulse">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            Loading heatmap data...
          </div>
        ) : isError ? (
          <div className="text-red-500 font-medium">Failed to load heatmap data.</div>
        ) : (
          <div className="relative shadow-xl rounded-lg overflow-hidden border border-slate-200 bg-white">
             {/* If we have an actual website to load, we could use an iframe, but for demo we just show canvas */}
            <div className="absolute inset-0 bg-white/50 z-0"></div>
            <HeatmapCanvas points={data?.data || []} width={1024} height={768} />
          </div>
        )}
      </div>
    </div>
  );
}
