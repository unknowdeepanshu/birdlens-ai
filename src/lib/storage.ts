import { openDB, type DBSchema } from 'idb';
import type { BirdInfo } from './birds';
import type { Prediction } from './predictions';
export interface Discovery { id: string; species: string; score: number; image: Blob; date: string; info: BirdInfo | null; alternatives: Prediction[] }
interface BirdDB extends DBSchema {
  discoveries: { key: string; value: Discovery };
  challenges: { key: string; value: { id: string; completed: boolean } };
  information: { key: string; value: BirdInfo };
}
const db = () => openDB<BirdDB>('birdlens', 1, { upgrade(database) {
  database.createObjectStore('discoveries', { keyPath: 'id' });
  database.createObjectStore('challenges', { keyPath: 'id' });
  database.createObjectStore('information');
} });
export async function listDiscoveries() { return (await (await db()).getAll('discoveries')).sort((a, b) => b.date.localeCompare(a.date)); }
export async function saveDiscovery(discovery: Discovery) { await (await db()).put('discoveries', discovery); }
export async function deleteDiscovery(id: string) { await (await db()).delete('discoveries', id); }
export async function getChallenges() { return (await (await db()).getAll('challenges')).filter(c => c.completed).map(c => c.id); }
export async function setChallenge(id: string, completed: boolean) { await (await db()).put('challenges', { id, completed }); }
export async function cachedInfo(label: string) { return (await db()).get('information', label); }
export async function cacheInfo(label: string, info: BirdInfo) { await (await db()).put('information', info, label); }
