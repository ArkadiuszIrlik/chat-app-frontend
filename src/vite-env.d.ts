/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOCKET_IO_URL: string;
  readonly VITE_MAIN_API_ENDPOINT: string;
  readonly VITE_FRONTEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
