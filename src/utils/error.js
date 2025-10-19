/**
 * Custom error class for authentication failures (401 Unauthorized).
 * This allows specific error handling in catch blocks.
 */
export class AuthError extends Error {
    constructor(message, status = 401) {
        super(message);
        this.name = 'AuthError';
        this.status = status;
        // Optionally store the HTTP status
    }
}