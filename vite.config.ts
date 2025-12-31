import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		{
			name: 'exclude-admin-local',
			closeBundle() {
				// Remove admin-local folder from build output
				const adminLocalPath = resolve('build/admin-local');
				if (fs.existsSync(adminLocalPath)) {
					fs.rmSync(adminLocalPath, { recursive: true, force: true });
				}
			}
		}
	]
});
