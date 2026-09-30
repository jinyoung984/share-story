import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/auth'나 '/api'로 시작하는 요청을 백엔드 서버로 프록시
      '/auth': {
        target: 'http://localhost:3000', // ⚠️ 백엔드 Express 포트 번호로 변경하세요 (예: 5000 또는 3000)
        changeOrigin: true,
      },
    },
  },
});
