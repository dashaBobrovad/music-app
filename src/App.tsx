import { useState, useEffect } from "react"

type Track = {
  id: number
  title: string
  url: string
}

export function App() {
  const [active, setActive] = useState<number | null>(null);
  const [data, setData] = useState<Track[] | null>(null);

  useEffect(() => {
    fetch('/api/tracks')
      .then(response => response.json())
      .then((tracks: Track[]) => setData(tracks))
      .catch(error => {
        console.error('Error fetching tracks:', error);
        setData([]);
      });
  }, []);

  return (
    <>
      <h1>Список треков</h1>
      
      {data === null && <div>loading...</div>}

      {data && data?.length === 0 && <div>empty</div>}

      {data && data?.length > 0 && (
        <ul>
          {data?.map(({ id, title, url }) => (
            <li key={id} onClick={() => setActive(id)} style={{ background: active === id ? "green" : ""}}>
              <span>{title}</span>

              <audio src={url} controls />
            </li>
          ))}

          <button onClick={() => setActive(null)}>reset</button>
        </ul>
      )}
    </>
  )
}
