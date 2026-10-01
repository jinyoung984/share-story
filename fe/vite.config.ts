import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


const targetUrl = 'http://localhost:3000';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Vite 클라이언트 포트
    proxy: {
      // /member 로 시작하는 요청을 localhost:3000 으로 포워딩
      '/meetup': {
        target: targetUrl,
        changeOrigin: true,
      },
      // /product 로 시작하는 요청 처리
      '/session': {
        target: targetUrl,
        changeOrigin: true,
      },
      // '/auth'나 '/api'로 시작하는 요청을 백엔드 서버로 프록시
      '/auth': {
        target: targetUrl,
        changeOrigin: true,
      },
    },
  },
});


