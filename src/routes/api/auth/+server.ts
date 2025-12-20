import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = import.meta.env.VITE_GITHUB_CLIENT_SECRET;

export const GET: RequestHandler = async ({ url }) => {
	const code = url.searchParams.get('code');

	if (!code) {
		throw error(400, 'Missing authorization code');
	}

	if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
		throw error(500, 'GitHub OAuth credentials not configured');
	}

	try {
		// Exchange code for access token
		const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				client_id: GITHUB_CLIENT_ID,
				client_secret: GITHUB_CLIENT_SECRET,
				code
			})
		});

		const tokenData = await tokenResponse.json();

		if (tokenData.error) {
			throw error(400, tokenData.error_description || 'OAuth token exchange failed');
		}

		// Return HTML that posts message back to CMS
		const html = `
<!DOCTYPE html>
<html>
<head>
	<title>Authorizing...</title>
</head>
<body>
	<script>
		(function() {
			window.opener.postMessage(
				'authorization:github:success:${JSON.stringify({
					token: tokenData.access_token,
					provider: 'github'
				})}',
				'*'
			);
			window.close();
		})();
	</script>
	<p>Authorization successful. This window should close automatically.</p>
</body>
</html>
		`;

		return new Response(html, {
			headers: {
				'Content-Type': 'text/html'
			}
		});
	} catch (err) {
		console.error('OAuth error:', err);
		throw error(500, 'Failed to authenticate with GitHub');
	}
};
