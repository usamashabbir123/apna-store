import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-muted">
      <div className="text-center px-4">
        <h1 className="text-6xl font-light text-foreground mb-4">404</h1>
        <p className="text-muted-foreground text-sm mb-8">This page could not be found.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 bg-primary text-primary-foreground text-sm tracking-wide uppercase hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="px-6 py-2.5 border border-border text-foreground text-sm tracking-wide uppercase hover:bg-secondary transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
