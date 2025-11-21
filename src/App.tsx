type Track = {
  id: number
  title: string
  url: string
}

const data: Track[] | null = [
  {
    id: 1,
    title: 'Musicfun soundtrack',
    url: 'https://musicfun.it-incubator.app/api/samurai-way-soundtrack.mp3',
  },
  {
    id: 2,
    title: 'Musicfun soundtrack instrumental',
    url: ' https://musicfun.it-incubator.app/api/samurai-way-soundtrack-instrumental.mp3',
  },
]

export function App() {
  return (
    <>
      <h1>Список треков</h1>
      {data === null && <div>loading...</div>}

      {data && data?.length === 0 && <div>empty</div>}

      {data && data?.length > 0 && (
        <ul>
          {data?.map(({ id, title, url }) => (
            <li key={id}>
              <span>{title}</span>

              <audio src={url} controls />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
