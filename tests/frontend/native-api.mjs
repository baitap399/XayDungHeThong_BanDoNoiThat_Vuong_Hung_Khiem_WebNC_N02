// file dùng chung cho test frontend: biên dịch frontend-native/src/api.ts thật với react-native và expo-secure-store giả (nền tảng Web).
import { after } from 'node:test';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../../frontend-native');
// Dùng TypeScript có sẵn trong frontend-native để không phụ thuộc thư mục frontend/ đã xóa.
const ts = createRequire(resolve(root, 'package.json'))('typescript');

const stubs = {
  'react-native': { Platform: { OS: 'web' }, Alert: { alert() {} }, Linking: { openURL() {} } },
  'expo-secure-store': Object.fromEntries(['getItemAsync', 'setItemAsync', 'deleteItemAsync']
    .map(name => [name, async () => { throw new Error('SecureStore không dùng trên Web'); }])),
};

export async function loadNativeApi() {
  const file = resolve(root, 'src/api.ts');
  const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  });
  const module = { exports: {} };
  const load = name => {
    if (name in stubs) return stubs[name];
    throw new Error(`native-api: chưa giả lập module "${name}"`);
  };
  new Function('exports', 'require', 'module', outputText)(module.exports, load, module);

  const storage = new Map();
  const sent = [];
  globalThis.localStorage = { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, String(v)), removeItem: k => storage.delete(k) };
  globalThis.fetch = async (url, init) => {
    sent.push({ url, method: init?.method ?? 'GET', headers: init?.headers ?? {}, body: init?.body });
    return new Response(JSON.stringify({ id: 5, name: 'Nồi chiên 6L' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
  after(() => { delete globalThis.localStorage; delete globalThis.fetch; });
  return { api: module.exports, storage, sent };
}
