import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['index.ts', 'scripts/copyTemplates.ts'],
	format: ['esm'],
	outDir: 'dist',
	clean: true,
	splitting: false,
	dts: true,
	outExtension: () => ({ js: '.mjs' }),
	banner: {
		js: '#!/usr/bin/env node',
	},
})
