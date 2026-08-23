import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-beige">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🧶</span>
          <span className="text-xl font-bold text-blush tracking-tight">
            Tejidos a Crochet
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/"
            className="text-charcoal/70 hover:text-blush transition-colors"
          >
            Catálogo
          </Link>
          <Link
            href="/admin"
            className="rounded-full bg-beige px-4 py-2 text-charcoal/80 hover:bg-blush hover:text-white transition-colors"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
