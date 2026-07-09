/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALLOWED_CHAT_IDS?: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_COUNTRY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}