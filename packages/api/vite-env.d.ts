/// <reference types="vite/client" />

interface ImportMetaEnv {
  PORT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
