'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';

export default function LoginPage() {
  const router = useRouter();
  const setIsGuest = useGameStore(s => s.setIsGuest);
  const [tab, setTab]               = useState<'login' | 'register'>('login');
  const [showPassword, setShowPwd]  = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsGuest(false);
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-md">
        <Link href="/" className="text-ink/70 hover:text-bio-600 mb-4 inline-flex items-center gap-2 font-semibold">
          <ArrowLeft className="size-5" /> Volver
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-bio-100 relative">
          <div className="bg-gradient-to-br from-bio-500 to-bio-600 p-8 text-center text-white rounded-b-[40px] shadow-md">
            <Image
              src="https://www.bioalimentar.com/assets/images/icons/bioHuevos.webp"
              alt="BIOHUEVOS"
              width={64}
              height={80}
              className="object-contain mx-auto mb-3 drop-shadow-lg"
              style={{ filter: 'brightness(0) invert(1)' }}
              unoptimized
            />
            <h1 className="font-display text-3xl font-extrabold uppercase">El Huevómetro</h1>
            <h2 className="text-lg font-bold text-white/90">Mundialista</h2>
          </div>

          <div className="flex border-b border-bio-100 mt-4 mx-8">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-3 font-bold transition ${tab === 'login' ? 'text-bio-600 border-b-2 border-bio-500' : 'text-ink/40'}`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-3 font-bold transition ${tab === 'register' ? 'text-bio-600 border-b-2 border-bio-500' : 'text-ink/40'}`}
            >
              Registrarme
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {tab === 'register' && (
              <FormField label="Nombre completo" type="text" placeholder="Tu nombre" required />
            )}
            <FormField label="Correo electrónico" type="email" placeholder="tu@correo.com" required />
            {tab === 'register' && (
              <FormField label="Código BIOHUEVOS" hint="(opcional)" type="text" placeholder="XXXX-XXXX" />
            )}
            <div>
              <label className="block text-sm font-bold text-ink mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl border-2 border-bio-100 focus:border-bio-500 focus:ring-2 focus:ring-bio-100 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-bio-500"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" size="md" block>
              {tab === 'login' ? 'Entrar a la cancha ⚽' : 'Crear mi cuenta 🥚'}
            </Button>

            {tab === 'login' && (
              <Link
                href="/dashboard"
                onClick={() => setIsGuest(true)}
                className="block text-center w-full text-bio-600 hover:text-bio-700 font-bold text-sm py-2 underline"
              >
                Quiero jugar sin registrarme →
              </Link>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, hint, type, placeholder, required }: { label: string; hint?: string; type: string; placeholder: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-bold text-ink mb-2">
        {label} {hint && <span className="text-ink/40 font-normal">{hint}</span>}
      </label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border-2 border-bio-100 focus:border-bio-500 focus:ring-2 focus:ring-bio-100 outline-none transition"
      />
    </div>
  );
}
