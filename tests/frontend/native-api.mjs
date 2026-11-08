// file dùng chung cho test frontend: biên dịch mã thật của frontend-native (api.ts, component, màn hình) để chạy trong Node, giả lập các module chỉ có trên thiết bị.
import { after } from 'node:test';
import { createRequire } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../../frontend-native');
// Dùng TypeScript và thư viện có sẵn trong frontend-native để không phụ thuộc thư mục frontend/ đã xóa.
const nativeRequire = createRequire(resolve(root, 'package.json'));
const ts = nativeRequire('typescript');

const deviceStubs = {
  'react-native': { Platform: { OS: 'web' }, Alert: { alert() {} }, Linking: { openURL() {} } },
  'expo-secure-store': Object.fromEntries(['getItemAsync', 'setItemAsync', 'deleteItemAsync']
    .map(name => [name, async () => { throw new Error('SecureStore không dùng trên Web'); }])),
};

// Biên dịch file .ts/.tsx của frontend-native thành CommonJS; `mocks` thay module theo tên import (vd '../store', 'expo-router').
export function loadNativeModule(file, mocks = {}, cache = new Map()) {
  const path = resolve(root, file);
  if (cache.has(path)) return cache.get(path).exports;
  const module = { exports: {} };
  cache.set(path, module);
  const { outputText } = ts.transpileModule(readFileSync(path, 'utf8'), {
    fileName: path,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
  });
  const load = name => {
    if (name in mocks) return mocks[name];
    if (name.endsWith('.css')) return {};
    if (name in deviceStubs && name !== 'react-native') return deviceStubs[name];
    // Gói Expo (icon, font, status bar...) cần asset của thiết bị và không phải nội dung cần kiểm tra: render rỗng.
    if (/^@?expo/.test(name)) return new Proxy({}, { get: (_, key) => key === '__esModule' ? false : () => null });
    if (name === 'react-native') return nativeRequire('react-native-web');
    if (!name.startsWith('.')) return nativeRequire(name);
    const base = resolve(dirname(path), name);
    const found = ['.web.tsx', '.web.ts', '.tsx', '.ts', '.mjs', ''].map(ext => base + ext).find(existsSync);
    if (!found) throw new Error(`native-api: không tìm thấy ${name} (từ ${file})`);
    return found.endsWith('.mjs') ? nativeRequire(found) : loadNativeModule(found, mocks, cache);
  };
  new Function('exports', 'require', 'module', outputText)(module.exports, load, module);
  return module.exports;
}

// Render component frontend-native thành HTML (react-native-web) để kiểm tra nội dung hiển thị.
export function renderNative(element) {
  return nativeRequire('react-dom/server').renderToStaticMarkup(element);
}

export const h = (...args) => nativeRequire('react').createElement(...args);

export async function loadNativeApi() {
  const api = loadNativeModule('src/api.ts', deviceStubs);

  const storage = new Map();
  const sent = [];
  globalThis.localStorage = { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, String(v)), removeItem: k => storage.delete(k) };
  globalThis.fetch = async (url, init) => {
    sent.push({ url, method: init?.method ?? 'GET', headers: init?.headers ?? {}, body: init?.body });
    return new Response(JSON.stringify({ id: 5, name: 'Nồi chiên 6L' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
  after(() => { delete globalThis.localStorage; delete globalThis.fetch; });
  return { api, storage, sent };
}
