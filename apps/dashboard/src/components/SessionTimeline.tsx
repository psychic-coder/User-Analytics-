import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getSessionDetails } from '../services/api';
import { MousePointerClick, Eye } from 'lucide-react';

export default function SessionTimeline({ sessionId }: { sessionId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['sessionDetails', sessionId],
    queryFn: () => getSessionDetails(sessionId),
  });

  if (isLoading) return <div className="flex flex-col items-center justify-center text-slate-400 gap-3 py-12"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>Loading journey...</div>;
  if (isError) return <div className="text-center text-red-500 p-8">Failed to load timeline.</div>;

  const events = data?.data.events || [];

  if (events.length === 0) {
    return <div className="text-center text-slate-500 p-8">No events found for this session.</div>;
  }

  return (
    <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-100 before:via-slate-200 before:to-transparent">
      {events.map((event, index) => (
        <div key={event._id || index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          {/* Icon */}
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 border-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 transition-transform group-hover:scale-110 ${
            event.eventType === 'page_view' ? 'bg-indigo-500 text-white' : 'bg-white text-slate-500 border-slate-200'
          }`}>
            {event.eventType === 'page_view' ? <Eye size={12} strokeWidth={3} /> : <MousePointerClick size={12} strokeWidth={2.5} />}
          </div>
          
          {/* Card */}
          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 group-hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                event.eventType === 'page_view' ? 'text-indigo-600' : 'text-slate-600'
              }`}>
                {event.eventType.replace('_', ' ')}
              </span>
              <time className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-md">
                {format(new Date(event.timestamp), 'HH:mm:ss')}
              </time>
            </div>
            
            <div className="text-sm font-medium text-slate-700 truncate mb-2" title={event.pageUrl}>
              {new URL(event.pageUrl).pathname || event.pageUrl}
            </div>

            {event.eventType === 'click' && event.coordinates && (
              <div className="inline-flex gap-3 text-xs font-mono bg-slate-50 border border-slate-100 text-slate-500 px-3 py-1.5 rounded-lg mt-1">
                <span className="flex items-center gap-1"><span className="text-slate-400">X:</span> {event.coordinates.x}</span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1"><span className="text-slate-400">Y:</span> {event.coordinates.y}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
