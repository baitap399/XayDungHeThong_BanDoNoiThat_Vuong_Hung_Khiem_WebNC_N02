// file dùng chung cho test frontend: biên dịch frontend-native/src/api.ts thật với react-native và expo-secure-store giả (nền tảng Web).
import { after } from 'node:test';
import { createRequire } from 'node:module';
import { mkdtempSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';

const require = createRequire(new URL('../../frontend/package.json', import.meta.url));
const { build } = require('esbuild');

export async function loadNativeApi() {
  const root = resolve(import.meta.dirname, '../../frontend-native');
  const directory = mkdtempSync(join(resolve(import.meta.dirname, '../../frontend'), 'node_modules', '.qa-native-'));
  after(() => rmSync(directory, { recursive: true, force: true }));
  await build({ entryPoints: [join(root, 'src/api.ts')], bundle: true, platform: 'node', format: 'cjs', packages: 'external',
    outfile: join(directory, 'api.cjs'), plugins: [{ name: 'native-stubs', setup(builder) {
      builder.onResolve({ filter: /^(react-native|expo-secure-store)$/ }, args => ({ path: args.path, namespace: 'stub' }));
      builder.onLoad({ filter: /.*/, namespace: 'stub' }, args => ({ contents: args.path === 'react-native'
        ? "export const Platform = { OS: 'web' }; export const Alert = { alert() {} }; export const Linking = { openURL() {} };"
        : ['getItemAsync', 'setItemAsync', 'deleteItemAsync'].map(n => `export async function ${n}() { throw new Error('SecureStore không dùng trên Web'); }`).join('\n') }));
    } }] });

  const storage = new Map();
  const sent = [];
  globalThis.localStorage = { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, String(v)), removeItem: k => storage.delete(k) };
  globalThis.fetch = async (url, init) => {
    sent.push({ url, method: init?.method ?? 'GET', headers: init?.headers ?? {}, body: init?.body });
    return new Response(JSON.stringify({ id: 5, name: 'Nồi chiên 6L' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
  after(() => { delete globalThis.localStorage; delete globalThis.fetch; });
  return { api: createRequire(import.meta.url)(join(directory, 'api.cjs')), storage, sent };
}
