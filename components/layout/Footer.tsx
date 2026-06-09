import Image from 'next/image';
import { Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-cream text-ink/70 py-12 px-4 border-t border-bio-100">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="https://www.bioalimentar.com/assets/images/icons/bioHuevos.webp"
                alt="BIOHUEVOS"
                width={48}
                height={56}
                className="object-contain"
                unoptimized
              />
              <div>
                <div className="font-display text-xl text-ink font-bold uppercase">El Huevómetro Mundialista</div>
                <div className="text-xs text-bio-600 font-semibold">Una campaña de BIOHUEVOS</div>
              </div>
            </div>
            <p className="text-sm max-w-md text-ink/60">
              Con los huevos en la cancha. Pronostica, suma puntos y gana premios reales durante todo el Mundial.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-ink uppercase text-sm tracking-widest mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#como-funciona" className="hover:text-bio-600 transition">Cómo funciona</a></li>
              <li><a href="#premios"       className="hover:text-bio-600 transition">Premios</a></li>
              <li><a href="#ranking"       className="hover:text-bio-600 transition">Ranking</a></li>
              <li><a href="#faq"           className="hover:text-bio-600 transition">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-ink uppercase text-sm tracking-widest mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-bio-600 transition">Términos y condiciones</a></li>
              <li><a href="#" className="hover:text-bio-600 transition">Política de privacidad</a></li>
              <li><a href="#" className="hover:text-bio-600 transition">Bases del concurso</a></li>
              <li><a href="#" className="hover:text-bio-600 transition">Contacto</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-bio-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink/50">© 2026 BIOHUEVOS · BioAlimentar. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram" className="text-ink/50 hover:text-bio-600 transition">
              <Instagram className="size-5" />
            </a>
            <a href="#" aria-label="Facebook" className="text-ink/50 hover:text-bio-600 transition">
              <Facebook className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
