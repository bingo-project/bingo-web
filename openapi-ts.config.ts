import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  client: '@hey-api/client-axios',
  input: 'http://localhost:8080/api/docs/doc.json',
  output: './packages/core/src/api/generated',
})
