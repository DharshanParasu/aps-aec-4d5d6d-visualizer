import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

const router = Router();

// Helper to get access token from auth route's store
// In production, use proper session management
async function getAccessToken(): Promise<string | null> {
    // This is a simplified approach - in production, use proper token management
    const tokenResponse = await fetch('http://localhost:3001/api/auth/token');
    if (tokenResponse.ok) {
        const data = await tokenResponse.json() as any;
        return data.accessToken;
    }
    return null;
}

// GET /api/data/hubs - List all hubs
router.get('/hubs', async (req: Request, res: Response) => {
    const token = await getAccessToken();
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const response = await fetch('https://developer.api.autodesk.com/project/v1/hubs', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching hubs:', error);
        res.status(500).json({ error: 'Failed to fetch hubs' });
    }
});

// GET /api/data/hubs/:hubId/projects - List projects in a hub
router.get('/hubs/:hubId/projects', async (req: Request, res: Response) => {
    const token = await getAccessToken();
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const { hubId } = req.params;
        const response = await fetch(`https://developer.api.autodesk.com/project/v1/hubs/${hubId}/projects`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// GET /api/data/projects/:projectId/folders/:folderId/contents - List folder contents
router.get('/projects/:projectId/folders/:folderId/contents', async (req: Request, res: Response) => {
    const token = await getAccessToken();
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const { projectId, folderId } = req.params;
        const response = await fetch(
            `https://developer.api.autodesk.com/data/v1/projects/${projectId}/folders/${folderId}/contents`,
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching folder contents:', error);
        res.status(500).json({ error: 'Failed to fetch folder contents' });
    }
});

// GET /api/data/projects/:projectId/topFolders - Get top folders of a project
router.get('/projects/:projectId/topFolders', async (req: Request, res: Response) => {
    const token = await getAccessToken();
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const { projectId } = req.params;
        const response = await fetch(
            `https://developer.api.autodesk.com/project/v1/hubs/b.${projectId.replace('b.', '')}/projects/${projectId}/topFolders`,
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching top folders:', error);
        res.status(500).json({ error: 'Failed to fetch top folders' });
    }
});

export default router;
