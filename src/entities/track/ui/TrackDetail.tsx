import { formatDuration } from '@/shared/lib/formatDuration'
import type { ITrackDetail } from '../model/types'

interface TrackDetailProps {
  activeTrackId: string | null
  selectedTrack: ITrackDetail | null
}

export const TrackDetail = ({ activeTrackId, selectedTrack }: TrackDetailProps) => {
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
