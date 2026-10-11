import { isConfident, type Prediction } from './predictions';
export { isConfident };
export type { Prediction };
let worker: Worker | undefined;
let busy = false;
export async function isModelCached(): Promise<boolean> {
  try { return !!(await (await caches.open('birdlens-model-v1')).match('/models/birds.onnx')); } catch { return false; }
}
export async function identify(image: Blob, onProgress: (status: string) => void): Promise<Prediction[]> {
  if (busy) throw new Error('An identification is already running.');
  busy = true;
  try {
    worker ??= new Worker(new URL('./inference.worker.ts', import.meta.url), { type: 'module' });
    const active = worker;
    return await new Promise<Prediction[]>((resolve, reject) => {
      const timer = setTimeout(() => { active.terminate(); worker = undefined; finish(new Error('Identification timed out. Try a smaller photo or a more capable device.')); }, 180_000);
      function finish(error?: Error, predictions?: Prediction[]) {
        clearTimeout(timer); active.onmessage = null; active.onerror = null;
        if (error) reject(error); else resolve(predictions!);
      }
      active.onmessage = ({ data }) => {
        if (data.type === 'progress') onProgress(data.status);
        if (data.type === 'result') finish(undefined, data.predictions);
        if (data.type === 'error') finish(new Error(data.message));
      };
      active.onerror = () => { active.terminate(); worker = undefined; finish(new Error('The local AI worker failed. Reload and try again.')); };
      active.postMessage({ image });
    });
  } finally { busy = false; }
}
