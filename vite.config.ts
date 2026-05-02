import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig(({ mode }) => ({
	resolve: { tsconfigPaths: true },
	plugins: [
		tailwindcss(),
		tanstackStart(),
		mode === 'test' ? undefined : nitro(),
		viteReact(),
	],
}))

export default config
