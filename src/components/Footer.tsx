export function Footer() {
  return (
    <footer className="border-t border-beige bg-beige/50 mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-charcoal/60">
        <div className="flex items-center gap-2">
          <span>🧶</span>
          <span>Tejidos a Crochet — Hecho con amor y dedicación</span>
        </div>
        <div className="flex gap-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blush transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blush transition-colors"
          >
            TikTok
          </a>
        </div>
      </div>
    </footer>
  );
}
