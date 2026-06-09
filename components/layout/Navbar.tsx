'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const LINKS = [
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#cronograma',    label: '🇪🇨 La Tri' },
  { href: '#premios',       label: 'Premios' },
  { href: '#ranking',       label: 'Ranking' },
  { href: '#faq',           label: 'FAQ' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav id="main-nav" className="relative w-full z-50 bg-white border-b border-bio-100">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-6xl">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <Image
            src="https://www.bioalimentar.com/assets/images/icons/bioHuevos.webp"
            alt="BIOHUEVOS"
            width={40}
            height={48}
            className="object-contain group-hover:scale-110 transition"
            unoptimized
          />
          <div className="hidden sm:block leading-tight">
            <div className="text-bio-700 font-extrabold text-sm uppercase">Huevómetro</div>
            <div className="text-[10px] text-bio-500 font-bold uppercase tracking-widest">Mundialista</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-ink/80 text-sm font-semibold">
          {LINKS.map(l => (
            <a key={l.href} href={l.href} className="hover:text-bio-600 transition">{l.label}</a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button size="md">Jugar ⚽</Button>
          </Link>
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden text-ink p-2"
            aria-label="Menú"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-bio-100">
          <div className="flex flex-col p-4 space-y-3 text-ink">
            {LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="py-2 border-b border-bio-50 font-semibold"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
