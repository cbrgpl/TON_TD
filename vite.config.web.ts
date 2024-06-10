/* eslint-env node */
import { resolve } from 'path'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'

export default defineConfig( {
  build: {
    sourcemap: true,
  },

  server: {
    port: 8080,
  },

  plugins: [
    vue( {
      template: {
        compilerOptions: {
          isCustomElement: ( tag ) => [ ].includes( tag ),
        },
      },
    } ),
  ],


  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src', 'components'),
      '@assets': resolve(__dirname, 'src', 'assets'),
      '@libs': resolve(__dirname, 'src', 'libs'),
      '@utils': resolve(__dirname, 'src', 'utils'),
      '@constant': resolve(__dirname, 'src', 'constant'),
    },
  },
} )

