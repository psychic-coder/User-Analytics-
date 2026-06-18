import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, formatDistanceStrict } from 'date-fns';
import { getSessions } from '../services/api';
import SessionTimeline from '../components/SessionTimeline';
import { Clock, MousePointerClick, RefreshCw, Activity, Search } from 'lucide-react';

export default function Sessions() {
  const [page, setPage] = useState(1);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['sessions', page],
    queryFn: () => getSessions(page, 20),
  });

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">User Sessions</h2>
          <p className="text-sm text-slate-500 mt-1">Real-time feed of user activity and journeys</p>
        </div>
        <button 
          onClick={() => refetch()}
          disabled={isRefetching}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={16} className={isRefetching ? 'animate-spin text-indigo-500' : 'text-slate-400'} />
          Refresh Feed
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex gap-6 flex-1 min-h-0 relative">
        {/* Sessions List Area */}
        <div className={`flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${selectedSessionId ? 'w-full lg:w-7/12' : 'w-full'}`}>
          
          {/* Table Header / Filters Mockup */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search sessions..." 
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow placeholder:text-slate-400"
                disabled
              />
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-500 px-4">
              <span className="w-24 text-right">Events</span>
              <span className="w-24 text-right">Duration</span>
              <span className="w-32 text-right">Activity</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-slate-50/30 p-3 space-y-2 relative">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Activity className="animate-pulse text-indigo-400" size={32} />
                <span className="text-sm font-medium animate-pulse">Loading live sessions...</span>
              </div>
            ) : isError ? (
              <div className="p-8 text-center text-red-500">Failed to load sessions.</div>
            ) : data?.data?.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <span className="text-4xl mb-4 opacity-50">📭</span>
                <p className="font-medium text-slate-600">No active sessions found.</p>
                <p className="text-sm mt-1">Waiting for users to visit the site...</p>
              </div>
            ) : (
              data?.data.map((session) => {
                const duration = formatDistanceStrict(new Date(session.firstEvent), new Date(session.lastEvent));
                const isSelected = selectedSessionId === session.sessionId;
                
                return (
                  <div 
                    key={session.sessionId} 
                    onClick={() => setSelectedSessionId(session.sessionId)}
                    className={`group flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                      isSelected 
                        ? 'bg-indigo-50/50 border-indigo-200 shadow-sm ring-1 ring-indigo-500/20' 
                        : 'bg-white border-slate-200/60 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
                      }`}>
                        <Activity size={18} />
                      </div>
                      <div>
                        <div className="font-mono text-sm font-medium text-slate-700 flex items-center gap-2">
                          {session.sessionId.split('-')[0]}
                          {isSelected && <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Started {format(new Date(session.firstEvent), 'MMM d, HH:mm')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="w-24 flex items-center justify-end gap-1.5 text-slate-600">
                        <MousePointerClick size={14} className="text-slate-400" />
                        <span className="font-medium">{session.totalEvents}</span>
                      </div>
                      <div className="w-24 flex items-center justify-end gap-1.5 text-slate-600">
                        <Clock size={14} className="text-slate-400" />
                        <span>{duration === '0 seconds' ? '< 1s' : duration}</span>
                      </div>
                      <div className="w-32 text-right text-slate-500 font-medium">
                        {formatDistanceStrict(new Date(session.lastEvent), new Date(), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {data?.pagination && (
            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-white">
              <span className="text-sm font-medium text-slate-500">
                Page <span className="text-slate-800">{data.pagination.page}</span> of {data.pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm disabled:opacity-50 font-medium bg-white hover:bg-slate-50 transition-colors shadow-sm text-slate-700"
                >
                  Previous
                </button>
                <button
                  disabled={page >= data.pagination.totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm disabled:opacity-50 font-medium bg-white hover:bg-slate-50 transition-colors shadow-sm text-slate-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel for Session Details */}
        {selectedSessionId && (
          <div className="hidden lg:flex w-5/12 bg-white rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-200/80 flex-col overflow-hidden animate-in slide-in-from-right-8 duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] relative z-10">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <Activity size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 leading-tight">User Journey</h3>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">{selectedSessionId}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSessionId(null)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-all active:scale-95"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-auto bg-slate-50/50 p-6">
              <SessionTimeline sessionId={selectedSessionId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

