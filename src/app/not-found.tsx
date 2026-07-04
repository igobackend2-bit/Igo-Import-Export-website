import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-paper px-4">
      <div className="text-center max-w-md">
        <div className="text-brand-amber font-serif font-bold text-7xl mb-4">404</div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-green-950 mb-3">
          Page Not Found
        </h1>
        <p className="text-brand-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-brand-green-950 text-white font-bold rounded-lg hover:bg-brand-green-850 transition"
          >
            Back to Home
          </Link>
          <Link
            href="/hub/agriculture"
            className="px-6 py-3 border border-brand-line text-brand-ink font-bold rounded-lg hover:bg-brand-sage transition"
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    </main>
  );
}
