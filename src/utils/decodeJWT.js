/**
 * Decode JWT token without verification (client-side safe)
 * Only use for displaying user info, NOT for authorization
 */
export function decodeJWT(token) {
    if (!token) return null;

    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = parts[1];
        const decoded = Buffer.from(payload, 'base64').toString('utf8');
        const parsed = JSON.parse(decoded);

        // Check if token is expired
        if (parsed.exp && parsed.exp * 1000 < Date.now()) {
            return null;
        }

        return parsed;
    } catch {
        return null;
    }
}