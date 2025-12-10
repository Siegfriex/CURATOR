import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY),
        'import.meta.env.VITE_FUNCTIONS_URL': JSON.stringify(env.VITE_FUNCTIONS_URL || 'https://us-central1-curatorproto.cloudfunctions.net')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
            curatorgame: path.resolve(__dirname, 'curatorgame/index.html'),
          },
          output: {
            manualChunks: {
              // React 및 핵심 라이브러리
              'react-vendor': ['react', 'react-dom'],
              // 차트 라이브러리
              'charts': ['recharts'],
              // 애니메이션 라이브러리
              'animation': ['framer-motion'],
              // 마크다운 라이브러리
              'markdown': ['react-markdown'],
              // 오디오 라이브러리
              'audio': ['tone'],
            }
          }
        },
        chunkSizeWarningLimit: 1000, // 경고 임계값 상향
      }
    };
});
