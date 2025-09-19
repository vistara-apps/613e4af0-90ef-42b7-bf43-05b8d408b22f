'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-4">
          Something went wrong!
        </h2>
        <p className="text-white/80 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={reset}
          className="btn-primary"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
