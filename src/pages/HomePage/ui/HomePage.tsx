import type { ITrackDetail, ITrackDetailResponse } from '@/entities/track/model/types'
import { TrackDetail } from '@/entities/track/ui/TrackDetail'
import { TrackList } from '@/entities/track/ui/TrackList'
import { useEffect, useState } from 'react'

export const HomePage = () => {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null)
  const [selectedTrack, setSelectedTrack] = useState<ITrackDetail | null>(null)

  const handleResetSelection = () => {
    setActiveTrackId(null)
    setSelectedTrack(null)
  }

  const handleSelectedTrack = (id: string) => {
    setActiveTrackId(id)
  }

  useEffect(() => {
    if (activeTrackId === null) return

    const fetchTrackDetail = async () => {
      try {
        const response = await fetch(`/api/playlists/tracks/${activeTrackId}`)
        const payload: ITrackDetailResponse = await response.json()
        setSelectedTrack(payload.data)
      } catch (error) {
        console.error('Error fetching track detail:', error)
        setSelectedTrack(null)
      }
    }

    fetchTrackDetail()
  }, [activeTrackId])

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 md:flex-row">
      <div className="w-full rounded border bg-white p-4 shadow-sm md:w-2/3">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-gray-900">Список треков</h1>

          <button
            type="button"
            onClick={handleResetSelection}
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
        <TrackList activeTrackId={activeTrackId} handleSelectedTrack={handleSelectedTrack} />
      </div>

      <div className="w-full rounded border bg-white p-4 shadow-sm md:w-1/3">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Информация о треке</h2>
        <TrackDetail activeTrackId={activeTrackId} selectedTrack={selectedTrack} />
      </div>
    </div>
  )
}
