import 'fake-indexeddb/auto';
import { expect, it } from 'vitest';
import { deleteDiscovery, getChallenges, listDiscoveries, saveDiscovery, setChallenge } from './storage';
it('persists an actual photograph and removes discoveries', async () => {
  await saveDiscovery({ id: 'test', species: 'AMERICAN ROBIN', date: '2026-10-10T12:00:00Z', image: new Blob(['photo'], { type: 'image/jpeg' }), score: .81, info: null, alternatives: [{ label: 'AMERICAN ROBIN', score: .81 }] });
  const saved = await listDiscoveries();
  expect(saved[0].species).toBe('AMERICAN ROBIN');
  expect(await saved[0].image.text()).toBe('photo');
  await deleteDiscovery('test');
  expect(await listDiscoveries()).toEqual([]);
});
it('persists and reverses self-reported challenge completion', async () => {
  await setChallenge('observe', true);
  expect(await getChallenges()).toContain('observe');
  await setChallenge('observe', false);
  expect(await getChallenges()).not.toContain('observe');
});
