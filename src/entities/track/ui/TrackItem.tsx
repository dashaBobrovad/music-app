interface TrackItemProps {
  id: string
  title: string
  audioUrl: string
  isActive: boolean
  onSelect: (id: string) => void
}

export const TrackItem = ({ id, title, audioUrl, isActive, onSelect }: TrackItemProps) => {
  const handleClick = () => onSelect?.(id)

  return (
    <li
      key={id}
      role="button"
      onClick={handleClick}
      className={`rounded border p-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        isActive ? 'bg-green-100' : 'bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex flex-col gap-2">
        <span className="font-medium text-gray-900">{title}</span>
        <audio className="w-full" src={audioUrl} controls />
      </div>
    </li>
  )
}
