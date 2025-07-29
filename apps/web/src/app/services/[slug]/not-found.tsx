import Link from "next/link";

export default function ServiceNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="font-display text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="font-display text-2xl font-bold text-gray-700 mb-4">
            Service Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The service you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/services"
            className="w-full bg-primary-burgundy text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-burgundy/90 transition-colors duration-200 inline-flex items-center justify-center"
          >
            View All Services
          </Link>
          <Link
            href="/"
            className="w-full border-2 border-primary-burgundy text-primary-burgundy px-8 py-3 rounded-lg font-semibold hover:bg-primary-burgundy hover:text-white transition-colors duration-200 inline-flex items-center justify-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}