import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getSessionDetails } from '../services/api';
import { MousePointerClick, Eye } from 'lucide-react';

export default function SessionTimeline({ sessionId }: { sessionId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['sessionDetails', sessionId],
    queryFn: () => getSessionDetails(sessionId),
  });

  if (isLoading) return <div className="text-center text-slate-500 p-8 animate-pulse">Loading journey...</div>;
  if (isError) return <div className="text-center text-red-500 p-8">Failed to load timeline.</div>;

  const events = data?.data.events || [];

  if (events.length === 0) {
    return <div className="text-center text-slate-500 p-8">No events found for this session.</div>;
  }

  return (
    <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
      {events.map((event, index) => (
        <div key={event._id || index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          {/* Icon */}
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 ${
            event.eventType === 'page_view' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
          }`}>
            {event.eventType === 'page_view' ? <Eye size={14} /> : <MousePointerClick size={14} />}
          </div>
          
          {/* Card */}
          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${
                event.eventType === 'page_view' ? 'text-emerald-600' : 'text-blue-600'
              }`}>
                {event.eventType.replace('_', ' ')}
              </span>
              <time className="text-xs text-slate-400 font-medium">
                {format(new Date(event.timestamp), 'HH:mm:ss')}
              </time>
            </div>
            
            <div className="text-sm text-slate-600 truncate mb-2" title={event.pageUrl}>
              {new URL(event.pageUrl).pathname || event.pageUrl}
            </div>

            {event.eventType === 'click' && event.coordinates && (
              <div className="inline-flex gap-2 text-xs font-mono bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md">
                <span>X: {event.coordinates.x}</span>
                <span>Y: {event.coordinates.y}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
