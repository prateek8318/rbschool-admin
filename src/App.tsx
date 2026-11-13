import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import type { AxiosError } from 'axios';
import { router } from './router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Don't retry permission / validation errors; retry network hiccups once.
      retry: (failureCount, error) => {
        const status = (error as AxiosError)?.response?.status;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 1;
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontSize: '14px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 15px -3px rgb(15 23 42 / 0.08)',
            color: '#0f172a',
          },
          success: { iconTheme: { primary: '#059669', secondary: '#fff' } },
          error: { iconTheme: { primary: '#e11d48', secondary: '#fff' }, duration: 5000 },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
