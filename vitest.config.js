import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        include: ['tests/js/**/*.test.{js,jsx}'],
        setupFiles: ['tests/js/setup.js'],
    },
})
