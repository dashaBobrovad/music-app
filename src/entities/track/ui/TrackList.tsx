import type { ITrack, ITrackResponse } from '@/entities/track/model/types'
import { useEffect, useState } from 'react'
import { TrackItem } from './TrackItem'

interface TrackListProps {
  activeTrackId: string | null
  onSelectTrack: (id: string) => void
}

export const TrackList = ({ activeTrackId, onSelectTrack }: TrackListProps) => {
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

  const handleSelectedTrack = (id: string) => onSelectTrack(id)

  if (tracks === null) {
    return <div className="text-sm text-gray-500">loading...</div>
  }

  if (tracks.length === 0) {
    return <div className="text-sm text-gray-500">empty</div>
  }

  return (
    <ul className="flex flex-col gap-2">
      {tracks.map(({ id, title, audioUrl }) => (
        <TrackItem
          id={id}
          title={title}
          audioUrl={audioUrl}
          isActive={id === activeTrackId}
          onSelect={handleSelectedTrack}
        />
      ))}
    </ul>
  )
}
