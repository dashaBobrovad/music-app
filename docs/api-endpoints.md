# API Specification

## Base URL

All endpoints are under the base path:

```
/api
```

All endpoints return JSON. Successful responses follow a JSON:API-like envelope:

```json
{
  "data": {},
  "meta": {},
  "included": []
}
```

Error format:

```json
{
  "errors": [
    {
      "status": "400",
      "code": "BadRequest",
      "title": "Bad Request",
      "detail": "Human readable description"
    }
  ]
}
```

---

## 1. Authentication

### 1.1 GET /api/auth/oauth-redirect
Starts or handles OAuth redirect flow.

**Auth:** Public

**Query params:** Provider-specific.

**Response:** Redirect or JSON with redirect URL.

---

### 1.2 POST /api/auth/login
Exchanges authorization code for tokens.

**Auth:** Public

**Body:**
```json
{
  "code": "OAUTH_AUTHORIZATION_CODE"
}
```

**Response 200:**
```json
{
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "expiresIn": 3600,
    "user": {
      "id": "string",
      "displayName": "string",
      "email": "user@example.com"
    }
  }
}
```

---

### 1.3 POST /api/auth/refresh
Refresh tokens.

**Auth:** Public

**Body:**
```json
{
  "refreshToken": "string"
}
```

**Response 200:**
```json
{
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "expiresIn": 3600
  }
}
```

---

### 1.4 POST /api/auth/logout
Invalidates refresh token.

**Auth:** Public

**Body:**
```json
{
  "refreshToken": "string"
}
```

**Response:** `204 No Content` or minimal JSON.

---

### 1.5 GET /api/auth/me
Returns current user.

**Auth:** Required

**Response 200:**
```json
{
  "data": {
    "id": "string",
    "displayName": "string",
    "email": "user@example.com"
  }
}
```

---

## 2. Tracks

### 2.1 GET /api/tracks
Paginated list of tracks.

**Auth:** Public

**Query params:** `page[size]`, `page[number]`, `filter[q]`, `filter[artistId]`, `filter[tagId]`.

**Response 200:** List of tracks and pagination meta.

---

### 2.2 GET /api/playlists/{playlistId}/tracks
Tracks of specific playlist.

**Auth:** Public/Owner

**Response 200:** List of tracks.

---

### 2.3 GET /api/playlists/tracks/{trackId}
Detailed track.

**Auth:** Public

**Response 200:** Track with optional `included`.

---

### 2.4 PUT /api/playlists/tracks/{trackId}
Update track.

**Auth:** Owner

**Body:** Track update payload.

**Response 200:** Updated track.

---

### 2.5 POST /api/playlists/tracks/upload
Upload audio and create/update track.

**Auth:** Owner

**Content-Type:** multipart/form-data

**Response 201:** Track info.

---

### 2.6 POST /api/playlists/{playlistId}/tracks
Add track to playlist.

**Auth:** Owner

**Body:**
```json
{ "trackId": "existing-track-id" }
```

**Response 200:** Playlist-track mapping.

---

### 2.7 DELETE /api/playlists/{playlistId}/tracks/{trackId}
Remove track from playlist.

**Auth:** Owner

**Response:** `204 No Content`

---

### 2.8 PUT /api/playlists/{playlistId}/tracks/{trackId}/reorder
Reorder track.

**Auth:** Owner

**Body:** `{ "newPosition": 3 }`

**Response 200:** New position.

---

## 3. Playlists

### 3.1 GET /api/playlists
List public playlists.

**Auth:** Public

**Response 200:** Playlists with pagination.

---

### 3.2 GET /api/playlists/my
User-owned playlists.

**Auth:** Required

**Response 200:** List of playlists.

---

### 3.3 GET /api/playlists/{playlistId}
Detailed playlist.

**Auth:** Public or owner for private.

**Response 200:** Playlist with `included` tracks.

---

### 3.4 POST /api/playlists
Create playlist.

**Auth:** Required

**Body:** Playlist create payload.

**Response 201:** Created playlist.

---

### 3.5 PUT /api/playlists/{playlistId}
Update playlist.

**Auth:** Owner

**Response 200:** Updated playlist.

---

### 3.6 DELETE /api/playlists/{playlistId}
Delete playlist.

**Auth:** Owner

**Response:** `204 No Content`

---

### 3.7 PUT /api/playlists/reorder
Reorder user playlists.

**Auth:** Required

**Body:** Order list.

**Response 200:** New ordering.

---

## 4. Tags

### 4.1 POST /api/tags
Create tag.

**Auth:** Required

**Response 201:** Tag.

---

### 4.2 GET /api/tags/search
Search tags.

**Auth:** Public

**Response 200:** List of tags.

---

### 4.3 DELETE /api/tags/{id}
Delete tag.

**Auth:** Required

**Response:** `204 No Content`

---

## 5. Artists

### 5.1 POST /api/artists
Create artist.

**Auth:** Required

**Response 201:** Artist.

---

### 5.2 GET /api/artists/search
Search artists.

**Auth:** Public

**Response 200:** List of artists.

---

### 5.3 DELETE /api/artists/{id}
Delete artist.

**Auth:** Required

**Response:** `204 No Content`

---

## 6. Common Behavior

### 6.1 Authentication
Use:
```
Authorization: Bearer <accessToken>
```

### 6.2 Pagination
Supports `page[size]` and `page[number]`.

### 6.3 Errors
JSON:API error format with proper status codes.

