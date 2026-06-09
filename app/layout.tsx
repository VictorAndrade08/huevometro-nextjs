import type { Metadata, Viewport } from 'next';
import { Inter, Fredoka } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
// Fredoka: tipografía redondeada chunky, idéntica al branding de Bio Huevos.
const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'El Huevómetro Mundialista — BIOHUEVOS',
  description: 'Pronostica el Mundial 2026 con huevos y gana premios reales. El que sabe de fútbol, sabe de huevos.',
  keywords: ['Mundial 2026', 'Polla', 'Pronósticos', 'Ecuador', 'BioHuevos', 'FIFA'],
  openGraph: {
    title: 'El Huevómetro Mundialista — BIOHUEVOS',
    description: 'Pronostica el Mundial 2026 con huevos y gana premios reales.',
    type: 'website',
    locale: 'es_EC',
  },
  icons: {
    icon: 'https://www.bioalimentar.com/assets/images/icons/bioHuevos.webp',
  },
};

export const viewport: Viewport = {
  themeColor: '#F08925',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${fredoka.variable}`}>
      <body className="overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
