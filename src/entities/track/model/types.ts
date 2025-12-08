export type ITrack = {
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

export type ITracksResponse = {
  data: ITrack[]
  meta: {
    total: number
  }
}

export type ITrackDetail = Omit<ITrack, 'audioUrl'>

export type ITrackResponse = {
  data: ITrack[]
}

export type ITrackDetailResponse = {
  data: ITrackDetail
}
