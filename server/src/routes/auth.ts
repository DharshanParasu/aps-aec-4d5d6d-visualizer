import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

const router = Router();

// Read env vars at request time (not module load time)
const getClientId = () => process.env.APS_CLIENT_ID || '';
const getClientSecret = () => process.env.APS_CLIENT_SECRET || '';
const getCallbackUrl = () => process.env.APS_CALLBACK_URL || 'https://localhost:8080/auth/callback/';

// Scopes required for AEC Data Model and Data Management
const SCOPES = [
    'data:read',
    'data:write',
    'data:create',
    'account:read',
    'user:read'
].join(' ');

// Store tokens in memory (use a proper session store in production)
let tokenStore: { accessToken?: string; refreshToken?: string; expiresAt?: number } = {};

// GET /api/auth/url - Returns the OAuth authorization URL
router.get('/url', (req: Request, res: Response) => {
    const clientId = getClientId();
    const callbackUrl = getCallbackUrl();

    console.log('Auth URL request - Client ID:', clientId ? 'SET' : 'EMPTY');

    const authUrl = `https://developer.api.autodesk.com/authentication/v2/authorize?` +
        `response_type=code&` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(callbackUrl)}&` +
        `scope=${encodeURIComponent(SCOPES)}`;

    res.json({ url: authUrl });
});

// GET /api/auth/callback - OAuth callback handler
router.get('/callback', async (req: Request, res: Response) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code missing' });
    }

    const clientId = getClientId();
    const clientSecret = getClientSecret();
    const callbackUrl = getCallbackUrl();

    try {
        const tokenResponse = await fetch('https://developer.api.autodesk.com/authentication/v2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code as string,
                redirect_uri: callbackUrl
            })
        });

        const tokenData = await tokenResponse.json() as any;

        if (tokenData.access_token) {
            tokenStore = {
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
                expiresAt: Date.now() + (tokenData.expires_in * 1000)
            };
            // Redirect to frontend after successful auth
            res.redirect('http://localhost:3000?auth=success');
        } else {
            res.status(400).json({ error: 'Failed to get access token', details: tokenData });
        }
    } catch (error) {
        console.error('Auth callback error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

// GET /api/auth/token - Returns the current access token (for frontend use)
router.get('/token', (req: Request, res: Response) => {
    if (tokenStore.accessToken && tokenStore.expiresAt && Date.now() < tokenStore.expiresAt) {
        res.json({
            accessToken: tokenStore.accessToken,
            expiresAt: tokenStore.expiresAt
        });
    } else {
        res.status(401).json({ error: 'Not authenticated or token expired' });
    }
});

// GET /api/auth/logout - Clears the token
router.get('/logout', (req: Request, res: Response) => {
    tokenStore = {};
    res.json({ success: true });
});

export default router;
