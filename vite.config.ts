import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { join, relative, resolve, sep } from 'path';
import fs from 'fs';

const escapeXml = (value: string): string =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');

const walkDir = (dirPath: string, ignoredDirNames: Set<string>): string[] => {
	if (!fs.existsSync(dirPath)) return [];

	const entries = fs.readdirSync(dirPath, { withFileTypes: true });
	const paths: string[] = [];

	for (const entry of entries) {
		if (entry.isDirectory() && ignoredDirNames.has(entry.name)) continue;

		const fullPath = join(dirPath, entry.name);
		if (entry.isDirectory()) {
			paths.push(...walkDir(fullPath, ignoredDirNames));
			continue;
		}

		paths.push(fullPath);
	}

	return paths;
};

const toRoutePath = (buildDir: string, htmlFilePath: string): string | null => {
	const rel = relative(buildDir, htmlFilePath).split(sep).join('/');
	if (!rel.endsWith('.html')) return null;

	if (rel === '404.html') return null;
	if (rel === '200.html') return null;

	if (rel === 'index.html') return '/';
	if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'/index.html'.length)}/`;
	return `/${rel.slice(0, -'.html'.length)}`;
};

const generateSitemapXml = (
	siteUrl: string,
	entries: Array<{ path: string; lastmod: string }>
): string => {
	const rawOrigin = siteUrl.trim().replace(/\/$/, '');
	const origin = rawOrigin
		? rawOrigin.startsWith('http://') || rawOrigin.startsWith('https://')
			? rawOrigin
			: `https://${rawOrigin}`
		: '';

	const urlsXml = entries
		.map(({ path, lastmod }) => {
			const loc = origin ? `${origin}${path}` : path;
			return `\t<url>\n\t\t<loc>${escapeXml(loc)}</loc>\n\t\t<lastmod>${lastmod}</lastmod>\n\t</url>`;
		})
		.join('\n');

	return (
		'<?xml version="1.0" encoding="UTF-8"?>\n' +
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
		`${urlsXml}\n` +
		'</urlset>\n'
	);
};

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
		},
		{
			name: 'generate-sitemap',
			closeBundle() {
				const buildDir = resolve('build');
				if (!fs.existsSync(buildDir)) return;

				const ignoredDirNames = new Set(['_app', 'admin-local', 'admin']);

				const htmlFiles = walkDir(buildDir, ignoredDirNames).filter((filePath) =>
					filePath.endsWith('.html')
				);

				const entries = htmlFiles
					.map((filePath) => {
						const path = toRoutePath(buildDir, filePath);
						if (!path) return null;
						if (path === '/admin' || path.startsWith('/admin/')) return null;
						const lastmod = new Date(fs.statSync(filePath).mtimeMs).toISOString();
						return { path, lastmod };
					})
					.filter((entry): entry is { path: string; lastmod: string } => Boolean(entry));

				const uniqueEntries = Array.from(
					new Map(entries.map((entry) => [entry.path, entry])).values()
				).sort((a, b) => a.path.localeCompare(b.path));

				const sitemapXml = generateSitemapXml('recetalias.com', uniqueEntries);

				fs.writeFileSync(resolve(buildDir, 'sitemap.xml'), sitemapXml, 'utf8');
			}
		}
	]
});
