import 'fake-indexeddb/auto';
import { afterEach, expect, it, vi } from 'vitest';
import { getBirdInfo } from './birds';
afterEach(() => vi.unstubAllGlobals());
it('provides a referenced bundled guide without internet', async () => {
  const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
  const info = await getBirdInfo('AMERICAN ROBIN');
  expect(info?.scientificName).toBe('Turdus migratorius');
  expect(info?.sourceUrl).toContain('allaboutbirds.org');
  expect(info?.habitat).toBeTruthy();
  expect(fetch).not.toHaveBeenCalled();
});
it('does not invent information for ambiguous labels', async () => {
  expect(await getBirdInfo('ALBATROSS')).toBeNull();
});
it('handles failed external reference lookup without made-up details', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
  expect(await getBirdInfo('ABBOTTS BOOBY')).toBeNull();
});
