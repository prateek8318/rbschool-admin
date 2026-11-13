import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface State {
  error: Error | null;
}

/** Keeps one broken page from blanking the whole admin panel. */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('Page crashed:', error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Something went wrong on this page</h2>
          <p className="text-sm text-slate-500 mt-1">{this.state.error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 inline-flex h-9 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
