import { defineConfig } from 'vite';

// Two pages: the provider console and the public guest payment page.
export default defineConfig({
  build: {
    rollupOptions: {
      input: { main: 'index.html', pay: 'pay.html' },
    },
  },
});
