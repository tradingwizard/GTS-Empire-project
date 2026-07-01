import { useCallback, useEffect, useState } from 'react';
import { clearCSRFToken, validateCSRFToken } from '@/components/shared/utils/config/config';
import { clearAuthData } from '@/utils/auth-utils';

/**
 * OAuth callback parameters extracted from URL
 */
export interface OAuthCallbackParams {
    code: string | null;
    state: string | null;
    error: string | null;
    error_description: string | null;
    isLegacy: boolean;
}

/**
 * OAuth callback processing result
 */
export interface OAuthCallbackResult {
    isProcessing: boolean;
    isValid: boolean;
    params: OAuthCallbackParams;
    error: string | null;
    cleanupURL: () => void;
}

/**
 * Custom hook to handle OAuth callback flow
 *
 * This hook:
 * 1. Extracts OAuth parameters (code, state, error) from URL
 * 2. Validates CSRF token (state parameter)
 * 3. Returns the authorization code and a cleanup function
 *
 * Note: Call cleanupURL() after you've processed the authorization code
 *
 * @returns OAuth callback processing result with cleanupURL function
 *
 * @example
 * ```tsx
 * const { isProcessing, isValid, params, error, cleanupURL } = useOAuthCallback();
 *
 * useEffect(() => {
 *   if (!isProcessing && isValid && params.code) {
 *     // Exchange code for tokens
 *     exchangeCodeForTokens(params.code).then(() => {
 *       cleanupURL(); // Clean up after processing
 *     });
 *   }
 * }, [isProcessing, isValid, params.code]);
 * ```
 */
export const useOAuthCallback = (): OAuthCallbackResult => {
    const [result, setResult] = useState<Omit<OAuthCallbackResult, 'cleanupURL'>>({
        isProcessing: true,
        isValid: false,
        params: {
            code: null,
            state: null,
            error: null,
            error_description: null,
            isLegacy: false,
        },
        error: null,
    });

    // Cleanup function that can be called by the consuming component
    const cleanupURL = useCallback(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete('code');
        url.searchParams.delete('state');
        url.searchParams.delete('scope');
        url.searchParams.delete('error');
        url.searchParams.delete('error_description');

        let index = 1;
        while (url.searchParams.has(`acct${index}`)) {
            url.searchParams.delete(`acct${index}`);
            url.searchParams.delete(`token${index}`);
            url.searchParams.delete(`cur${index}`);
            index++;
        }

        window.history.replaceState({}, '', url.toString());
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        // Extract OAuth parameters
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const error_description = urlParams.get('error_description');

        // Check for legacy tokens (acct1, token1, etc.)
        const hasLegacyTokens = urlParams.has('acct1') || urlParams.has('token1');

        if (hasLegacyTokens) {
            setResult({
                isProcessing: false,
                isValid: true,
                params: { code, state, error, error_description, isLegacy: true },
                error: null,
            });
            return;
        }

        // Check if this is an OAuth callback (has code or error parameter)
        const isOAuthCallback = code !== null || error !== null || state !== null;

        if (!isOAuthCallback) {
            // Not an OAuth callback, mark as complete
            setResult({
                isProcessing: false,
                isValid: false,
                params: { code: null, state: null, error: null, error_description: null, isLegacy: false },
                error: null,
            });
            return;
        }

        // Handle OAuth error response
        if (error) {
            console.error('OAuth error:', error, error_description);
            setResult({
                isProcessing: false,
                isValid: false,
                params: { code, state, error, error_description, isLegacy: false },
                error: error_description || error,
            });

            cleanupURL();
            return;
        }

        // Validate CSRF token (state parameter)
        if (!state) {
            console.error('[DEBUG] Missing state parameter in OAuth callback');
            clearAuthData();
            setResult({
                isProcessing: false,
                isValid: false,
                params: { code, state, error, error_description, isLegacy: false },
                error: 'Missing state parameter - potential security threat',
            });

            window.location.replace(window.location.origin);
            return;
        }

        if (!validateCSRFToken(state)) {
            console.error('[DEBUG] CSRF token validation failed - potential security threat');
            clearAuthData();
            setResult({
                isProcessing: false,
                isValid: false,
                params: { code, state, error, error_description, isLegacy: false },
                error: 'CSRF token validation failed',
            });
            return;
        }

        // CSRF validation passed
        clearCSRFToken();

        // If we have legacy tokens, we mark it as valid legacy session
        if (hasLegacyTokens) {
            setResult({
                isProcessing: false,
                isValid: true,
                params: { code, state, error, error_description, isLegacy: true },
                error: null,
            });
            return;
        }

        // Validate that we have the authorization code for V2
        if (!code) {
            console.error('Missing authorization code in OAuth callback');
            setResult({
                isProcessing: false,
                isValid: false,
                params: { code, state, error, error_description, isLegacy: false },
                error: 'Missing authorization code',
            });

            cleanupURL();
            return;
        }

        setResult({
            isProcessing: false,
            isValid: true,
            params: { code, state, error, error_description, isLegacy: false },
            error: null,
        });
    }, [cleanupURL]); // Run only once on mount

    return {
        ...result,
        cleanupURL,
    };
};
