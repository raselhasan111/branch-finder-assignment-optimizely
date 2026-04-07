/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GRAPH_ENDPOINT: string;
  readonly VITE_GRAPH_AUTH_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
