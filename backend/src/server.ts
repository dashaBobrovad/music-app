import cors from 'cors'
import express, { Request, Response } from 'express'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

type RawTrack = {
  id: number
  title: string
  url: string
}

type Track = {
  id: string
  title: string
  durationMs: number
  audioUrl: string
  coverUrl?: string
  genre?: string
  lyrics?: string
  artistIds: string[]
  tagIds: string[]
  playlistIds?: string[]
  createdAt?: string
  updatedAt?: string
}

type TrackDetail = Omit<Track, 'audioUrl'>

const STATIC_TIMESTAMP = '2024-01-01T00:00:00.000Z'

const TRACK_BASE: Record<string, Track> = {
  '1': {
    id: '1',
    title: 'Musicfun soundtrack',
    durationMs: 49_000,
    audioUrl: 'https://musicfun.it-incubator.app/api/samurai-way-soundtrack.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400',
    genre: 'Future Garage',
    lyrics:
      'Into the neon night we ride,\nBlades of light at either side,\nThrough the static, hearts collide,\nSamurai way, our city guide.',
    artistIds: ['artist-neo-samurai'],
    tagIds: ['tag-focus', 'tag-instrumental'],
    playlistIds: ['playlist-focus-mode'],
    createdAt: STATIC_TIMESTAMP,
    updatedAt: STATIC_TIMESTAMP,
  },
  '2': {
    id: '2',
    title: 'Musicfun soundtrack instrumental',
    durationMs: 49_000,
    audioUrl: 'https://musicfun.it-incubator.app/api/samurai-way-soundtrack-instrumental.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=400',
    genre: 'Ambient',
    lyrics: undefined,
    artistIds: ['artist-neo-samurai'],
    tagIds: ['tag-chill', 'tag-lofi'],
    playlistIds: ['playlist-samurai-way', 'playlist-night-drive'],
    createdAt: STATIC_TIMESTAMP,
    updatedAt: STATIC_TIMESTAMP,
  },
}

const stripAudioUrl = (track: Track): TrackDetail => {
  const { audioUrl, ...detail } = track
  void audioUrl
  return detail
}

const TRACK_DETAIL_BASE: Record<string, TrackDetail> = Object.fromEntries(
  Object.entries(TRACK_BASE).map(([id, track]) => [id, stripAudioUrl(track)]),
) as Record<string, TrackDetail>

const buildTrackDetail = (trackId: string, track: Track): TrackDetail => {
  const baseDetail = TRACK_DETAIL_BASE[trackId]
  const fallbackLyrics = TRACK_BASE[trackId]?.lyrics ?? track.lyrics

  if (baseDetail) {
    return {
      ...baseDetail,
      lyrics: baseDetail.lyrics ?? fallbackLyrics,
    }
  }

  const detail = stripAudioUrl(track)

  return {
    ...detail,
    lyrics: detail.lyrics ?? fallbackLyrics,
  }
}

const respondWithError = (
  res: Response,
  status: number,
  code: string,
  title: string,
  detail: string,
) => {
  return res.status(status).json({
    errors: [
      {
        status,
        code,
        title,
        detail,
      },
    ],
  })
}

const mapToTrack = (raw: RawTrack): Track => {
  const nowIso = new Date().toISOString()
  const base = TRACK_BASE[String(raw.id)]

  return {
    id: String(raw.id),
    title: raw.title ?? base?.title ?? 'Unknown track',
    durationMs: base?.durationMs ?? 0,
    audioUrl: (raw.url ?? base?.audioUrl ?? '').trim(),
    coverUrl: base?.coverUrl,
    genre: base?.genre,
    artistIds: base?.artistIds ?? [],
    tagIds: base?.tagIds ?? [],
    playlistIds: base?.playlistIds,
    lyrics: base?.lyrics,
    createdAt: base?.createdAt ?? nowIso,
    updatedAt: nowIso,
  }
}

const fetchTracks = async (): Promise<Track[]> => {
  try {
    const response = await fetch('https://musicfun.it-incubator.app/api/playlists/tracks')

    if (!response.ok) {
      return Object.values(TRACK_BASE)
    }

    const payload = (await response.json()) as RawTrack[]
    return payload.map(mapToTrack)
  } catch (error) {
    console.error('Error fetching tracks:', error)
    return Object.values(TRACK_BASE)
  }
}

app.get('/api/playlists/tracks', async (_req: Request, res: Response) => {
  const tracks = await fetchTracks()

  return res.json({
    data: tracks,
    meta: {
      total: tracks.length,
    },
  })
})

app.get('/api/playlists/tracks/:trackId', async (req: Request, res: Response) => {
  const { trackId } = req.params
  const tracks = await fetchTracks()
  const track = tracks.find(({ id }) => id === trackId)

  if (!track) {
    return respondWithError(
      res,
      404,
      'TrackNotFound',
      'Track not found',
      `Track with id ${trackId} was not found`,
    )
  }

  const trackDetail = buildTrackDetail(trackId, track)

  return res.json({
    data: trackDetail,
  })
})

app.get('/health', (_req: Request, res: Response) => {
  return res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
