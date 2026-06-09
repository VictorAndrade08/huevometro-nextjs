import { NextResponse } from 'next/server';
import { fetchOpenfootballFixtures } from '@/lib/api/openfootball';

export const runtime = 'edge';

/**
 * API Route que proxea openfootball desde el server.
 * Cache: 5 minutos (revalidate en lib/api/openfootball.ts via fetch options).
 * Best practice 2026: nunca exponer keys del API en el cliente.
 */
export async function GET() {
  try {
    const matches = await fetchOpenfootballFixtures();
    return NextResponse.json(matches, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (e) {
    const error = e instanceof Error ? e.message : 'unknown';
    return NextResponse.json({ error }, { status: 500 });
  }
}
