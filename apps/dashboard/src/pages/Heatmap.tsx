import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getHeatmapData } from '../services/api';
import HeatmapCanvas from '../components/HeatmapCanvas';

const KNOWN_PAGES = [
  'http://localhost:3000/',
  'http://localhost:3000/products',
  'http://localhost:3000/about',
  'http://localhost:3000/contact',
  'http://localhost:3000/cart',
  'http://localhost:3000/checkout',
];

export default function Heatmap() {
  const [pageUrl, setPageUrl] = useState(KNOWN_PAGES[0]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['heatmap', pageUrl],
    queryFn: () => getHeatmapData(pageUrl),
    enabled: !!pageUrl,
  });

  const points = data?.data || [];

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Click Heatmap</h3>
          <p className="text-sm text-slate-500 mt-1">Visualize user clicks across your pages</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-500 font-medium">Page:</label>
          <select
            value={pageUrl}
            onChange={(e) => setPageUrl(e.target.value)}
            className="w-72 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
          >
            {KNOWN_PAGES.map((url) => (
              <option key={url} value={url}>
                {url.replace('http://localhost:3000', '') || '/'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 bg-slate-100 relative overflow-auto flex flex-col items-center justify-center p-8 gap-4">
        {/* Stats bar */}
        {!isLoading && !isError && (
          <div className="flex gap-4 self-stretch justify-end">
            <div className="bg-white rounded-lg px-4 py-2 border border-slate-200 text-sm shadow-sm">
              <span className="text-slate-500">Clicks on this page: </span>
              <span className="font-semibold text-slate-800">{points.length}</span>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center text-slate-500 animate-pulse gap-3">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            Loading heatmap...
          </div>
        ) : isError ? (
          <div className="text-red-500 font-medium">Failed to load heatmap data.</div>
        ) : points.length === 0 ? (
          <div className="flex flex-col items-center text-slate-400 gap-2">
            <span className="text-5xl">🖱️</span>
            <p className="font-medium text-slate-500">No click data for this page yet</p>
            <p className="text-sm">Try selecting a different page from the dropdown above</p>
          </div>
        ) : (
          <div className="relative shadow-xl rounded-lg overflow-hidden border border-slate-200 bg-white">
            <HeatmapCanvas points={points} width={1024} height={768} />
          </div>
        )}
      </div>
    </div>
  );
}
