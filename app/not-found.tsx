import Link from "next/link";
export default function NotFound(){ return <div className="mx-auto max-w-7xl px-4 py-16 text-center"><h1 className="text-3xl font-bold text-primary">Page not found</h1><p className="text-text-muted mt-2">The page you’re looking for doesn’t exist.</p><Link href="/" className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-xl">Go to Home</Link></div>; }
