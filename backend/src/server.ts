import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Type definition for Track
type Track = {
  id: number;
  title: string;
  url: string;
};

// Endpoint to fetch tracks from external API
app.get('/api/tracks', async (req: Request, res: Response) => {
  try {
    // Fetch data from the external API
    // You can replace this URL with any music API you want to use
    const response = await fetch('https://musicfun.it-incubator.app/api/tracks');
    
    if (!response.ok) {
      // If the external API doesn't exist, return mock data
      const mockTracks: Track[] = [
        {
          id: 1,
          title: 'Musicfun soundtrack',
          url: 'https://musicfun.it-incubator.app/api/samurai-way-soundtrack.mp3',
        },
        {
          id: 2,
          title: 'Musicfun soundtrack instrumental',
          url: 'https://musicfun.it-incubator.app/api/samurai-way-soundtrack-instrumental.mp3',
        },
      ];
      return res.json(mockTracks);
    }

    const tracks: Track[] = await response.json();
    res.json(tracks);
  } catch (error) {
    console.error('Error fetching tracks:', error);
    // Return mock data as fallback
    const fallbackTracks: Track[] = [
      {
        id: 1,
        title: 'Musicfun soundtrack',
        url: 'https://musicfun.it-incubator.app/api/samurai-way-soundtrack.mp3',
      },
      {
        id: 2,
        title: 'Musicfun soundtrack instrumental',
        url: 'https://musicfun.it-incubator.app/api/samurai-way-soundtrack-instrumental.mp3',
      },
    ];
    res.json(fallbackTracks);
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});


