export type SpotifyNowPlaying = {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl?: string;
  songUrl?: string;
};

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const MOCK: SpotifyNowPlaying = {
  isPlaying: false,
  title: "One Day",
  artist: "Kodaline",
  album: "In a Perfect World",
  albumImageUrl:
    "https://i.scdn.co/image/ab67616d0000b273b400994f31c26c04f981014e",
  songUrl: "https://open.spotify.com/track/1a2RlhZ6aU3a4eM1962j4d",
};

async function getAccessToken(): Promise<string | null> {
  if (!client_id || !client_secret || !refresh_token) return null;
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
    cache: "no-store",
  });
  const data = (await response.json()) as { access_token?: string };
  return data.access_token ?? null;
}

export async function getSpotifyNowPlaying(): Promise<SpotifyNowPlaying> {
  const access_token = await getAccessToken();
  if (!access_token) return MOCK;

  try {
    const currentlyPlayingRes = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${access_token}` },
        cache: "no-store",
      }
    );

    if (
      currentlyPlayingRes.status === 204 ||
      currentlyPlayingRes.status > 400
    ) {
      const recentlyPlayedRes = await fetch(
        "https://api.spotify.com/v1/me/player/recently-played?limit=1",
        {
          headers: { Authorization: `Bearer ${access_token}` },
          cache: "no-store",
        }
      );
      if (!recentlyPlayedRes.ok) return MOCK;
      const recentlyPlayed = await recentlyPlayedRes.json();
      const track = recentlyPlayed.items?.[0]?.track;
      if (!track) return MOCK;
      return {
        isPlaying: false,
        title: track.name,
        artist: track.artists.map((a: { name: string }) => a.name).join(", "),
        album: track.album.name,
        albumImageUrl: track.album.images?.[0]?.url,
        songUrl: track.external_urls?.spotify,
      };
    }

    const song = await currentlyPlayingRes.json();
    const item = song.item;
    if (!item) return MOCK;

    return {
      isPlaying: song.is_playing,
      title: item.name,
      artist: item.artists.map((a: { name: string }) => a.name).join(", "),
      album: item.album.name,
      albumImageUrl: item.album.images?.[0]?.url,
      songUrl: item.external_urls?.spotify,
    };
  } catch {
    return MOCK;
  }
}
