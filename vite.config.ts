import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ plugins: [react(), tailwindcss(), {
  name: 'offline-assets',
  generateBundle(_, bundle) {
    this.emitFile({ type: 'asset', fileName: 'offline-assets.json', source: JSON.stringify(Object.keys(bundle).filter(name => name.startsWith('assets/')).map(name => '/' + name)) });
  },
}], worker: { format: 'es' }, build: { target: 'es2022' } });
