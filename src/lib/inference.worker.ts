import * as ort from 'onnxruntime-web/wasm';
import labels from '../data/labels.json';
import { rankLogits } from './predictions';
import wasmUrl from 'onnxruntime-web/ort-wasm-simd-threaded.wasm?url';
import wasmModuleUrl from 'onnxruntime-web/ort-wasm-simd-threaded.mjs?url';

ort.env.wasm.numThreads = 1;
ort.env.wasm.wasmPaths = { wasm: wasmUrl, mjs: wasmModuleUrl };
let session: ort.InferenceSession | undefined;
const progress = (status: string) => self.postMessage({ type: 'progress', status });
async function loadModel() {
  const cache = await caches.open('birdlens-model-v1');
  const cached = await cache.match('/models/birds.onnx');
  if (cached) return cached.arrayBuffer();
  progress('Downloading the bird model · 32 MB. Your photo stays on this device.');
  const response = await fetch('/models/birds.onnx');
  if (!response.ok) throw new Error('Bird model is missing. Run npm run model:download before starting the app.');
  const bytes = await response.arrayBuffer();
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('');
  if (hash !== '09b950b371030de9003824baa66457f2e8fc4f96fe87a34cc4c3b242b2864d8b') throw new Error('Model integrity check failed. Download the pinned model again.');
  try { await cache.put('/models/birds.onnx', new Response(bytes)); } catch { progress('Storage is full; the model will work this session but may not be available offline.'); }
  return bytes;
}
self.onmessage = async ({ data }: MessageEvent<{ image: Blob }>) => {
  try {
    if (!session) {
      const model = await loadModel();
      progress('Preparing local AI. This can take a moment on your first visit.');
      session = await ort.InferenceSession.create(model, { executionProviders: ['wasm'] });
    }
    progress('Looking at plumage, shape, and markings…');
    const bitmap = await createImageBitmap(data.image);
    const canvas = new OffscreenCanvas(260, 260);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) { bitmap.close(); throw new Error('This browser cannot prepare photos for local AI.'); }
    // Match the published EfficientNet processor: direct resize, nearest sampling,
    // rescale 1/255, normalize twice (include_top=true).
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(bitmap, 0, 0, 260, 260); bitmap.close();
    const pixels = ctx.getImageData(0, 0, 260, 260).data;
    const mean = [0.485, 0.456, 0.406];
    const std = [0.47853944, 0.4732864, 0.47434163];
    const values = new Float32Array(3 * 260 * 260);
    for (let i = 0; i < 260 * 260; i++) for (let c = 0; c < 3; c++) values[c * 260 * 260 + i] = ((pixels[i * 4 + c] / 255 - mean[c]) / std[c]) / std[c];
    const output = await session.run({ [session.inputNames[0]]: new ort.Tensor('float32', values, [1, 3, 260, 260]) });
    const logits = output[session.outputNames[0]].data as Float32Array;
    self.postMessage({ type: 'result', predictions: rankLogits(logits, labels) });
  } catch (error) { self.postMessage({ type: 'error', message: error instanceof Error ? error.message : 'Local identification failed.' }); }
};
