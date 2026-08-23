import { YarnBallIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from "./Icons";

export function Footer() {
  return (
    <footer className="relative mt-auto">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blush/20 to-transparent" />
      <div className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blush to-blush-dark flex items-center justify-center">
                  <YarnBallIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-base font-bold text-white block leading-tight">
                    Tejidos a <span className="text-blush-light">Crochet</span>
                  </span>
                </div>
              </div>
              <p className="text-white/30 text-sm leading-relaxed max-w-sm mb-6">
                Cada pieza es única, tejida a mano con dedicación y amor.
                Productos artesanales de calidad premium.
              </p>
              <div className="flex gap-3">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-blush-light hover:bg-white/10 transition-all duration-300">
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-blush-light hover:bg-white/10 transition-all duration-300">
                  <TikTokIcon className="w-5 h-5" />
                </a>
                <a href="https://wa.me/56936621284" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-whatsapp hover:bg-whatsapp/10 transition-all duration-300">
                  <WhatsAppIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-5">Navegación</h3>
              <ul className="space-y-3">
                <li><a href="/" className="text-white/30 hover:text-blush-light text-sm transition-colors duration-300">Catálogo</a></li>
                <li><a href="/admin" className="text-white/30 hover:text-blush-light text-sm transition-colors duration-300">Panel Admin</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-5">Contacto</h3>
              <ul className="space-y-3">
                <li>
                  <a href="https://wa.me/56936621284" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-whatsapp text-sm transition-colors duration-300 flex items-center gap-2">
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-blush-light text-sm transition-colors duration-300">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-blush-light text-sm transition-colors duration-300">
                    TikTok
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-xs">
              © 2026 Tejidos a Crochet. Todos los derechos reservados.
            </p>
            <p className="text-white/20 text-xs flex items-center gap-1.5">
              Hecho con <span className="text-blush"><svg className="w-3 h-3 inline" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg></span> y mucho crochet
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
