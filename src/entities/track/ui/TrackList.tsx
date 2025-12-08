import type { ITrack, ITrackResponse } from '@/entities/track/model/types'
import { useEffect, useState } from 'react'

interface TrackListProps {
  activeTrackId: string | null
  handleSelectedTrack: (id: string) => void
}

export const TrackList = ({ activeTrackId, handleSelectedTrack }: TrackListProps) => {
  const [tracks, setTracks] = useState<ITrack[] | null>(null)

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('/api/playlists/tracks')
        const payload: ITrackResponse = await response.json()
        setTracks(payload.data)
      } catch (error) {
        console.error('Error fetching tracks:', error)
        setTracks([])
      }
    }

    fetchTracks()
  }, [])

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
            onClick={() => handleSelectedTrack(id)}
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
