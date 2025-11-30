import { useEffect, useState } from 'react'

type Track = {
  id: string
  title: string
  durationMs: number
  audioUrl: string
  coverUrl?: string
  genre?: string
  artistIds: string[]
  tagIds: string[]
  playlistIds?: string[]
  createdAt?: string
  updatedAt?: string
  lyrics?: string
}

type TracksResponse = {
  data: Track[]
  meta: {
    total: number
  }
}

type TrackDetail = Omit<Track, 'audioUrl'>

type TrackResponse = {
  data: TrackDetail
}

export function App() {
  const [tracks, setTracks] = useState<Track[] | null>(null)
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null)
  const [selectedTrack, setSelectedTrack] = useState<TrackDetail | null>(null)

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('/api/playlists/tracks')
        const payload: TracksResponse = await response.json()
        setTracks(payload.data)
      } catch (error) {
        console.error('Error fetching tracks:', error)
        setTracks([])
      }
    }

    fetchTracks()
  }, [])

  useEffect(() => {
    if(activeTrackId === null) {
      setSelectedTrack(null);
      return;
    }

    const fetchTrackDetail = async () => {
      try {
        const response = await fetch(`/api/playlists/tracks/${activeTrackId}`)  
        const payload: TrackResponse = await response.json()
        setSelectedTrack(payload.data)
      } catch (error) {
        console.error('Error fetching track detail:', error)
        setSelectedTrack(null)
      } 
    }

    fetchTrackDetail();
  }, [activeTrackId])

  const renderTrackList = () => {
    if (tracks === null) {
      return <div className="text-sm text-gray-500">loading...</div>
    }

    if (tracks.length === 0) {
      return <div className="text-sm text-gray-500">empty</div>
    }

    return (
      <ul className="flex flex-col gap-2">
        {tracks.map(({ id, title, audioUrl }) => {
          return (
            <li
              key={id}
              role="button"
              tabIndex={0}
              aria-label={`Трек ${title}`}
              onClick={() => setActiveTrackId(id)}
              className={`rounded border p-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                id === activeTrackId ? 'bg-green-100' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col gap-2">
                <span className="font-medium text-gray-900">{title}</span>
                <audio className="w-full" src={audioUrl} controls />
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  const renderTrackDetail = () => {
    if (!activeTrackId) {
      return <div className="text-sm text-gray-500">Выберите трек, чтобы увидеть детали</div>
    }

    if (activeTrackId !== selectedTrack?.id) {
      return <div className="text-sm text-gray-500">Загрузка информации...</div>
    }

    if (!selectedTrack) {
      return null
    }

    const { title, durationMs, coverUrl, genre, artistIds, tagIds, playlistIds, lyrics } =
      selectedTrack

    const formatDuration = (milliseconds: number) => {
      if (!milliseconds) {
        return '—'
      }

      const minutes = Math.floor(milliseconds / 60000)
      const seconds = Math.floor((milliseconds % 60000) / 1000)

      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    return (
      <div className="space-y-3 rounded border p-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>

        {coverUrl && (
          <img
            src={coverUrl}
            alt={`Обложка трека ${title}`}
            className="h-40 w-full rounded object-cover"
          />
        )}

        <div className="text-sm text-gray-700">
          <span className="font-medium">Длительность:</span> {formatDuration(durationMs)}
        </div>

        {genre && (
          <div className="text-sm text-gray-700">
            <span className="font-medium">Жанр:</span> {genre}
          </div>
        )}

        <div className="text-sm text-gray-700">
          <span className="font-medium">Исполнители:</span>{' '}
          {artistIds.length > 0 ? artistIds.join(', ') : '—'}
        </div>

        <div className="text-sm text-gray-700">
          <span className="font-medium">Теги:</span> {tagIds.length > 0 ? tagIds.join(', ') : '—'}
        </div>

        {playlistIds && (
          <div className="text-sm text-gray-700">
            <span className="font-medium">Плейлисты:</span>{' '}
            {playlistIds.length > 0 ? playlistIds.join(', ') : '—'}
          </div>
        )}

        {lyrics && (
          <div className="text-sm text-gray-700">
            <span className="font-medium">Текст песни:</span> {lyrics}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 md:flex-row">
      <div className="w-full rounded border bg-white p-4 shadow-sm md:w-2/3">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-gray-900">Список треков</h1>

          <button
            type="button"
            onClick={()=> setActiveTrackId(null)}
            disabled={!activeTrackId}
            className={`rounded px-3 py-2 text-sm font-medium transition ${
              activeTrackId
                ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                : 'cursor-not-allowed bg-gray-100 text-gray-400'
            }`}
          >
            Сбросить выбор
          </button>
        </div>
        {renderTrackList()}
      </div>

      <div className="w-full rounded border bg-white p-4 shadow-sm md:w-1/3">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Информация о треке</h2>
        {renderTrackDetail()}
      </div>
    </div>
  )
}
