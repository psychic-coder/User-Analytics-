import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getSessions } from '../services/api';
import SessionTimeline from '../components/SessionTimeline';

export default function Sessions() {
  const [page, setPage] = useState(1);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['sessions', page],
    queryFn: () => getSessions(page, 20),
  });

  return (
    <div className="flex gap-6 h-full">
      {/* Sessions Table Area */}
      <div className={`flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all ${selectedSessionId ? 'w-2/3' : 'w-full'}`}>
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-semibold text-slate-800">Active Sessions</h3>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            Refresh
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500 animate-pulse">Loading sessions...</div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">Failed to load sessions.</div>
          ) : data?.data?.length === 0 ? (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center h-full">
              <span className="text-4xl mb-3">📭</span>
              <p>No active sessions found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                  <th className="py-4 px-6 font-medium">Session ID</th>
                  <th className="py-4 px-6 font-medium text-right">Total Events</th>
                  <th className="py-4 px-6 font-medium">First Event</th>
                  <th className="py-4 px-6 font-medium">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((session) => (
                  <tr 
                    key={session.sessionId} 
                    onClick={() => setSelectedSessionId(session.sessionId)}
                    className={`border-b border-slate-100 cursor-pointer transition-colors ${selectedSessionId === session.sessionId ? 'bg-indigo-50 hover:bg-indigo-50/80' : 'hover:bg-slate-50'}`}
                  >
                    <td className="py-4 px-6 font-mono text-xs text-slate-600">
                      {session.sessionId.split('-')[0]}...
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-slate-700">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                        {session.totalEvents}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500">
                      {format(new Date(session.firstEvent), 'MMM d, HH:mm:ss')}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500">
                      {format(new Date(session.lastEvent), 'MMM d, HH:mm:ss')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {data?.pagination && (
          <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50/50">
            <span className="text-sm text-slate-500">
              Page {data.pagination.page} of {data.pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 border border-slate-300 rounded text-sm disabled:opacity-50 font-medium bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                Previous
              </button>
              <button
                disabled={page >= data.pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 border border-slate-300 rounded text-sm disabled:opacity-50 font-medium bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Side Panel for Session Details */}
      {selectedSessionId && (
        <div className="w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="font-semibold text-slate-800">User Journey</h3>
              <p className="text-xs font-mono text-slate-500 mt-1">{selectedSessionId.split('-')[0]}...</p>
            </div>
            <button 
              onClick={() => setSelectedSessionId(null)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-auto p-6 bg-slate-50/30">
            <SessionTimeline sessionId={selectedSessionId} />
          </div>
        </div>
      )}
    </div>
  );
}
