import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

const router = Router();

const AEC_DM_GRAPHQL_URL = process.env.AEC_DM_GRAPHQL_URL || 'https://developer.api.autodesk.com/aec/graphql';

// Helper to get access token
async function getAccessToken(): Promise<string | null> {
    const tokenResponse = await fetch('http://localhost:3001/api/auth/token');
    if (tokenResponse.ok) {
        const data = await tokenResponse.json() as any;
        return data.accessToken;
    }
    return null;
}

// POST /api/graphql - Proxy GraphQL requests to AEC Data Model API
router.post('/', async (req: Request, res: Response) => {
    const token = await getAccessToken();
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const { query, variables } = req.body;

        const response = await fetch(AEC_DM_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query, variables })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('GraphQL proxy error:', error);
        res.status(500).json({ error: 'GraphQL request failed' });
    }
});

export default router;
