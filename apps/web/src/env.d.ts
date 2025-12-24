// ABOUTME: Vite environment variable type declarations
// ABOUTME: Provides type safety for import.meta.env

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_NAMESPACE: string
  readonly VITE_PORT: string
  readonly VITE_BASE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_DEVTOOLS: string
  readonly VITE_COMPRESS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
