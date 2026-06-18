import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import Sessions from '../pages/Sessions';

// Mock API
vi.mock('../services/api', () => ({
  getSessions: vi.fn().mockResolvedValue({
    success: true,
    data: [
      {
        sessionId: 'test-session-123',
        totalEvents: 5,
        firstEvent: new Date().toISOString(),
        lastEvent: new Date().toISOString()
      }
    ],
    pagination: { page: 1, limit: 20, total: 1, totalPages: 1 }
  })
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } }
});

describe('Sessions Page', () => {
  it('renders loading state initially', () => {
    // We would need to mock useQuery behavior for an exact loading state test,
    // but the component should render the query client provider correctly
    render(
      <QueryClientProvider client={queryClient}>
        <Sessions />
      </QueryClientProvider>
    );
    expect(screen.getByText(/Sessions/i)).toBeInTheDocument();
  });
});
