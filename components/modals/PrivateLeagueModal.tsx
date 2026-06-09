'use client';

import { useState } from 'react';
import { Copy, MessageCircle } from 'lucide-react';
import { Modal, ModalHeader } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface PrivateLeagueModalProps {
  open:    boolean;
  onClose: () => void;
  onToast: (msg: string, type?: 'ok' | 'warn') => void;
}

export function PrivateLeagueModal({ open, onClose, onToast }: PrivateLeagueModalProps) {
  const [name, setName] = useState('');
  const [size, setSize] = useState('10');
  const [code, setCode] = useState<string | null>(null);

  function createLeague() {
    if (!name.trim()) {
      onToast('⚠ Pon un nombre a tu liga', 'warn');
      return;
    }
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'HUEV-';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setCode(code);
  }

  function copyCode() {
    if (!code) return;
    navigator.clipboard?.writeText(code).then(() => onToast('🔗 Código copiado'));
  }

  function shareWhatsApp() {
    if (!code) return;
    const url = `${window.location.origin}${window.location.pathname}?liga=${code}`;
    const text = `🥚 ¡Únete a mi liga del Huevómetro Mundialista! Código: ${code}\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  }

  return (
    <Modal open={open} onClose={() => { setCode(null); onClose(); }}>
      <div className="p-6">
        <ModalHeader title="👥 Crear liga privada" onClose={() => { setCode(null); onClose(); }} />

        <p className="text-sm text-ink/60 mb-4 -mt-2">
          Crea tu liga, invita a tu familia/oficina/panas y compite entre ustedes con un ranking propio.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-ink uppercase">Nombre de la liga</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Los Huevones de la Oficina"
              className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-bio-100 focus:border-bio-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-ink uppercase">¿Cuántos miembros máximo?</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-bio-100 focus:border-bio-500 outline-none text-sm"
            >
              <option>5</option><option>10</option><option>20</option><option>50</option><option>Sin límite</option>
            </select>
          </div>
          <Button onClick={createLeague} size="md" block className="mt-2">
            🚀 Crear liga y obtener código
          </Button>
        </div>

        {code && (
          <div className="mt-5 pt-5 border-t border-bio-100">
            <p className="text-xs text-ink/60 mb-2">Tu liga está lista. Comparte este código:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-bio-50 border-2 border-bio-200 px-4 py-3 rounded-lg font-mono font-bold text-lg text-bio-700 text-center tracking-widest">
                {code}
              </code>
              <Button onClick={copyCode} size="md">
                <Copy className="size-4" /> Copiar
              </Button>
            </div>
            <button
              onClick={shareWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white font-bold w-full py-3 rounded-xl mt-3 text-sm flex items-center justify-center gap-2"
            >
              <MessageCircle className="size-4" /> Compartir por WhatsApp
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
