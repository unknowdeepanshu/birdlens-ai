import { cachedInfo, cacheInfo } from './storage';
import { fieldGuide } from '../data/field-guide';
export interface BirdInfo { commonName: string; scientificName: string | null; summary: string; habitat?: string; distribution?: string; diet?: string; features?: string; fact?: string; sourceUrl: string; attribution: string }
export const displayName = (label: string) => label.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
// Resolve only explicit label aliases: some model labels are misspelled or ambiguous.
const aliases: Record<string, string> = { 'ABBOTTS BABBLER': "Abbott's babbler", 'ABBOTTS BOOBY': "Abbott's booby", 'PARUS MAJOR': 'Great tit', 'MALLARD DUCK': 'Mallard', 'MANDRIN DUCK': 'Mandarin duck', 'ANNAS HUMMINGBIRD': "Anna's hummingbird", 'BLACKBURNIAM WARBLER': 'Blackburnian warbler', 'RED WISKERED BULBUL': 'Red-whiskered bulbul' };
const ambiguous = new Set(['CROW', 'ALBATROSS', 'BIRD OF PARADISE', 'COCKATOO', 'FRIGATE', 'LOONEY BIRDS', 'MYNA', 'PUFFIN', 'QUETZAL', 'TOUCHAN', 'TIT MOUSE']);
export async function getBirdInfo(label: string): Promise<BirdInfo | null> {
  if (fieldGuide[label]) return fieldGuide[label];
  try { const cached = await cachedInfo(label); if (cached) return cached; } catch { /* Information remains available without local storage. */ }
  if (ambiguous.has(label)) return null;
  const title = aliases[label] ?? displayName(label);
  try {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replaceAll(' ', '_'))}`, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return null;
    const data = await response.json();
    if (data.type === 'disambiguation' || !data.extract || !data.content_urls?.desktop?.page || !/bird|duck|owl|eagle|sparrow|warbler|pigeon|parrot|heron|falcon|penguin|finch|woodpecker|passerine|species of/i.test(data.description ?? '')) return null;
    const match = data.extract.match(/\(([A-Z][a-z]+ [a-z]+)\)/);
    const info: BirdInfo = { commonName: data.title, scientificName: match?.[1] ?? null, summary: data.extract, sourceUrl: data.content_urls.desktop.page, attribution: 'Wikipedia contributors · CC BY-SA 4.0. Summary, not a verified field identification.' };
    try { await cacheInfo(label, info); } catch { /* The discovery can still save its own information snapshot. */ }
    return info;
  } catch { return null; }
}
