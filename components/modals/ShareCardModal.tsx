'use client';

import { useRef, useState, useEffect } from 'react';
import { Download, Instagram, MessageCircle, Copy, User, Pencil } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';
import { flagUrl } from '@/lib/teams';
import type { Match } from '@/types';

interface ShareCardModalProps {
  open:     boolean;
  onClose:  () => void;
  matches:  Match[] | null;
  title:    string;
  onShared: (msg: string, type?: 'ok' | 'warn') => void;
}

/**
 * Cartilla de toda una jornada — una sola imagen para subir a historias.
 * Lista de partidos con bandera + marcador pronosticado + firma del usuario.
 */
export function ShareCardModal({ open, onClose, matches, title, onShared }: ShareCardModalProps) {
  const cardRef       = useRef<HTMLDivElement>(null);
  const userProfile   = useGameStore(s => s.userProfile);
  const predictions   = useGameStore(s => s.predictions);
  const setProfile    = useGameStore(s => s.setProfile);
  const incrementShared = useGameStore(s => s.incrementShared);

  const [editing, setEditing]   = useState(false);
  const [draftName, setDraftName] = useState(userProfile.name || '');
  const [draftIg,   setDraftIg]   = useState(userProfile.ig   || '');

  useEffect(() => {
    if (open) {
      setDraftName(userProfile.name || '');
      setDraftIg(userProfile.ig || '');
      setEditing(false);
    }
  }, [open, userProfile.name, userProfile.ig]);

  function saveEdit() {
    setProfile({
      name: draftName.trim(),
      ig:   draftIg.trim().replace(/^@/, ''),
    });
    setEditing(false);
  }

  if (!matches || matches.length === 0) return null;

  async function downloadPNG() {
    if (!matches) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      if (!cardRef.current) return;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null, scale: 2, useCORS: true,
      });
      const safeName = (userProfile.name || 'huevometro').toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const slug = title.toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const link = document.createElement('a');
      link.download = `huevometro-${safeName}-${slug}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      incrementShared();
      onShared('Cartilla descargada — subila a tu historia y etiquetá @biohuevos_ec');
    } catch (e) {
      console.error(e);
      onShared('No se pudo generar la imagen', 'warn');
    }
  }

  function shareTo(platform: 'whatsapp' | 'instagram' | 'copy') {
    const text = `Mi cartilla del Huevómetro: ${title} · #HuevómetroMundialista @biohuevos_ec`;
    const url  = typeof window !== 'undefined' ? window.location.origin : '';
    const enc  = encodeURIComponent;
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${enc(text + ' ' + url)}`, '_blank', 'noopener');
      incrementShared();
    } else if (platform === 'instagram') {
      downloadPNG();
      setTimeout(() => onShared('Subila como historia y etiquetá @biohuevos_ec'), 800);
    } else if (platform === 'copy') {
      navigator.clipboard?.writeText(text + '\n' + url).then(() => onShared('Texto copiado'));
    }
  }

  // Decide layout density según cantidad de partidos
  const rowCount = matches.length;
  const compact = rowCount > 6;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="font-display text-lg font-bold text-white">Tu cartilla</h3>
          <button onClick={onClose} className="text-ink/40 hover:text-ink text-2xl leading-none">×</button>
        </div>

        {/* Firma editable */}
        <div className="mb-3 rounded-xl border p-3" style={{ background: 'var(--color-bg-3)', borderColor: 'var(--color-border)' }}>
          {!editing ? (
            <div className="flex items-center gap-2">
              <User className="size-4 text-bio-300 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-display font-semibold text-bio-300 uppercase tracking-wider">Firma de la cartilla</div>
                <div className="font-semibold text-sm text-white truncate">
                  {userProfile.name || 'Sin nombre'}
                  {userProfile.ig && <span className="text-bio-300 font-medium"> · @{userProfile.ig.replace(/^@/,'')}</span>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-bio-200 text-xs font-display font-semibold transition hover:brightness-125"
                style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
              >
                <Pencil className="size-3" /> Editar
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-display font-semibold text-bio-300 uppercase tracking-wider">Nombre</label>
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full mt-1 px-3 py-2 rounded-lg border outline-none text-sm text-white"
                  style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
                  autoFocus
                />
              </div>
              <div>
                <label className="text-[10px] font-display font-semibold text-bio-300 uppercase tracking-wider">Instagram</label>
                <input
                  type="text"
                  value={draftIg}
                  onChange={(e) => setDraftIg(e.target.value)}
                  placeholder="tuusuario"
                  className="w-full mt-1 px-3 py-2 rounded-lg border outline-none text-sm text-white"
                  style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setDraftName(userProfile.name || ''); setDraftIg(userProfile.ig || ''); setEditing(false); }}
                  className="flex-1 px-3 py-2 rounded-lg border text-bio-200 text-xs font-display font-semibold hover:brightness-125 transition"
                  style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveEdit}
                  className="flex-1 px-3 py-2 rounded-lg bg-bio-500 text-white text-xs font-display font-semibold hover:bg-bio-600 transition"
                >
                  Guardar firma
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cartilla — formato vertical historia (4:5) */}
        <div
          ref={cardRef}
          style={{
            width: '100%',
            aspectRatio: '4 / 5',
            background: '#FBF7EE',
            borderRadius: 20,
            position: 'relative',
            overflow: 'hidden',
            border: '2px solid #F08925',
            fontFamily: 'var(--font-sans)',
            color: '#2A1F12',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* HEADER */}
          <div style={{
            background: 'linear-gradient(90deg, #F08925 0%, #A85912 100%)',
            color: '#fff',
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            letterSpacing: '0.04em',
            fontSize: 13,
          }}>
            <span>EL HUEVÓMETRO</span>
            <span style={{ opacity: 0.85 }}>MUNDIAL 2026</span>
          </div>

          {/* Título de la jornada */}
          <div style={{ textAlign: 'center', padding: '14px 16px 6px' }}>
            <div style={{
              display: 'inline-block',
              background: '#FFFFFF',
              border: '1.5px solid #FFC684',
              color: '#A85912',
              padding: '4px 14px',
              borderRadius: 999,
              fontSize: 10,
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              letterSpacing: '0.12em',
            }}>
              MI CARTILLA
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 700,
              color: '#2A1F12',
              letterSpacing: '-0.01em',
              marginTop: 6,
              lineHeight: 1.1,
            }}>
              {title}
            </h2>
          </div>

          {/* Lista de partidos */}
          <div style={{
            flex: 1,
            padding: `8px ${compact ? 14 : 18}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: compact ? 5 : 8,
            justifyContent: matches.length <= 2 ? 'flex-start' : 'center',
          }}>
            {matches.map(m => {
              const p = predictions[m.id];
              const h = typeof p?.home === 'number' ? p.home : 0;
              const a = typeof p?.away === 'number' ? p.away : 0;
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#fff',
                    border: '1.5px solid #FFE0B5',
                    borderRadius: 12,
                    padding: compact ? '8px 10px' : '10px 12px',
                    minWidth: 0,
                  }}
                >
                  {/* Local */}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', minWidth: 0 }}>
                    <span style={{
                      flex: 1,
                      fontSize: compact ? 10 : 12,
                      fontWeight: 700,
                      color: '#2A1F12',
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em',
                      textAlign: 'right',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: 0,
                    }}>
                      {m.homeTeam}
                    </span>
                    {flagUrl(m.homeFlag, 80) && (
                      <img
                        src={flagUrl(m.homeFlag, 80)}
                        alt={m.homeTeam}
                        crossOrigin="anonymous"
                        style={{ width: compact ? 20 : 26, height: compact ? 14 : 18, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
                      />
                    )}
                  </div>
                  {/* Score */}
                  <div style={{
                    flexShrink: 0,
                    fontFamily: 'var(--font-display)',
                    fontSize: compact ? 16 : 22,
                    fontWeight: 700,
                    color: '#A85912',
                    background: '#FFF3E2',
                    borderRadius: 10,
                    padding: '4px 12px',
                    minWidth: 64,
                    textAlign: 'center',
                    lineHeight: 1,
                    border: '1.5px solid #FFC684',
                    margin: '0 8px',
                  }}>
                    {h}–{a}
                  </div>
                  {/* Visitante */}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-start', minWidth: 0 }}>
                    {flagUrl(m.awayFlag, 80) && (
                      <img
                        src={flagUrl(m.awayFlag, 80)}
                        alt={m.awayTeam}
                        crossOrigin="anonymous"
                        style={{ width: compact ? 20 : 26, height: compact ? 14 : 18, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
                      />
                    )}
                    <span style={{
                      flex: 1,
                      fontSize: compact ? 10 : 12,
                      fontWeight: 700,
                      color: '#2A1F12',
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: 0,
                    }}>
                      {m.awayTeam}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Firma */}
          <div style={{
            margin: '0 18px',
            padding: '10px 0 6px',
            borderTop: '1.5px dashed #FFC684',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 9, fontFamily: 'var(--font-display)', fontWeight: 600, color: '#A85912', letterSpacing: '0.14em', marginBottom: 2 }}>
              FIRMADO POR
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#2A1F12', lineHeight: 1.1 }}>
              {(userProfile.name || 'Tu nombre').toUpperCase()}
            </div>
            {userProfile.ig && (
              <div style={{ fontSize: 11, fontWeight: 600, color: '#A85912', marginTop: 2 }}>
                @{userProfile.ig.replace(/^@/, '')}
              </div>
            )}
          </div>

          {/* CTA strip */}
          <div style={{
            background: '#2A1F12',
            color: '#fff',
            padding: '10px 20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'baseline',
            gap: 6,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            letterSpacing: '0.08em',
            fontSize: 11,
          }}>
            <span>ETIQUETÁ</span>
            <span style={{ color: '#FFB458' }}>@biohuevos_ec</span>
            <span>Y GANÁ</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-4 space-y-2">
          <Button onClick={downloadPNG} size="md" block>
            <Download className="size-4" /> Descargar imagen
          </Button>
          <div className="grid grid-cols-3 gap-2">
            <ShareBtn onClick={() => shareTo('whatsapp')}  className="bg-green-500 hover:bg-green-600">
              <MessageCircle className="size-5" /> WhatsApp
            </ShareBtn>
            <ShareBtn onClick={() => shareTo('instagram')} className="bg-gradient-to-tr from-pink-500 to-purple-600">
              <Instagram className="size-5" /> Historia
            </ShareBtn>
            <ShareBtn onClick={() => shareTo('copy')}      className="bg-bio-500 hover:bg-bio-600">
              <Copy className="size-5" /> Copiar
            </ShareBtn>
          </div>
          <p className="text-[11px] text-bio-200/55 text-center mt-2 leading-relaxed">
            Subila a Instagram y etiquetá a <strong className="text-bio-300">@biohuevos_ec</strong> para participar.
          </p>
        </div>
      </div>
    </Modal>
  );
}

function ShareBtn({ onClick, className, children }: { onClick: () => void; className: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`text-white font-display font-semibold py-2.5 rounded-xl text-xs flex flex-col items-center gap-1 transition ${className}`}
    >
      {children}
    </button>
  );
}
