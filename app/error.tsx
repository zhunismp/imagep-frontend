"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg border p-6 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Something went wrong
        </h2>

        <p className="mt-3 text-sm sm:text-base text-gray-600">
          An unexpected error occurred. Please try again.
        </p>

        {process.env.NODE_ENV !== "production" && (
          <pre className="mt-4 max-h-40 overflow-auto rounded-lg bg-gray-100 p-3 text-xs text-left text-gray-700">
            {error.message}
          </pre>
        )}

        <button
          onClick={() => reset()}
          className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
