import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export function CTAFinal() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-3xl text-center">
        <div className="bg-gradient-to-br from-bio-500 to-bio-700 rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 text-[300px] opacity-10 select-none">⚽</div>
          <div className="relative z-10">
            <Image
              src="https://www.bioalimentar.com/assets/images/icons/bioHuevos.webp"
              alt="BIOHUEVOS"
              width={80}
              height={96}
              className="w-20 h-24 object-contain mx-auto mb-4 drop-shadow-xl"
              style={{ filter: 'brightness(0) invert(1)' }}
              unoptimized
            />
            <h2 className="font-display text-4xl md:text-6xl font-bold uppercase mb-4 text-white">
              ¿Listo para jugar?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              El Mundial empieza pronto. Entra y empieza a pronosticar sin registrarte.
            </p>
            <Link href="/dashboard">
              <Button variant="white" size="xl">¡JUGAR AHORA! ⚽</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
