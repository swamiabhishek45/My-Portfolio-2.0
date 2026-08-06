import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
};

// Shown only when Spotify credentials are not configured, so local runs and
// forks still render the card. Never used to mask a real API failure.
const PLACEHOLDER_TRACK = {
  isPlaying: false,
  title: "One Day",
  artist: "Kodaline",
  album: "In a Perfect World",
  albumImageUrl:
    "https://i.scdn.co/image/ab67616d0000b273b400994f31c26c04f981014e",
  songUrl: "https://open.spotify.com/track/1a2RlhZ6aU3a4eM1962j4d",
  isMock: true,
};

type SpotifyArtist = { name: string };

type SpotifyTrack = {
  name: string;
  artists: SpotifyArtist[];
  album: { name: string; images: { url: string }[] };
  external_urls: { spotify: string };
};

const getAccessToken = async (): Promise<string> => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token || "",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Spotify token endpoint returned status ${response.status}: ${await response
        .text()
        .catch(() => "<unreadable body>")}`
    );
  }

  const { access_token } = await response.json();

  if (!access_token) {
    throw new Error("Spotify token response did not contain an access token");
  }

  return access_token;
};

const serializeTrack = (track: SpotifyTrack, isPlaying: boolean) => ({
  isPlaying,
  title: track.name,
  artist: track.artists.map((artist) => artist.name).join(", "),
  album: track.album.name,
  albumImageUrl: track.album.images[0]?.url,
  songUrl: track.external_urls.spotify,
});

export async function GET() {
  if (!client_id || !client_secret || !refresh_token) {
    return NextResponse.json(PLACEHOLDER_TRACK, { headers: CACHE_HEADERS });
  }

  try {
    const access_token = await getAccessToken();

    const currentlyPlayingRes = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-store",
    });

    // 204 means nothing is playing; anything else that is not ok is a genuine
    // failure and must not be silently treated as "nothing playing".
    if (currentlyPlayingRes.status !== 204 && !currentlyPlayingRes.ok) {
      throw new Error(
        `Spotify currently-playing endpoint returned status ${currentlyPlayingRes.status}`
      );
    }

    if (currentlyPlayingRes.status !== 204) {
      const song = await currentlyPlayingRes.json();

      if (song?.item) {
        return NextResponse.json(serializeTrack(song.item, song.is_playing), {
          headers: CACHE_HEADERS,
        });
      }
    }

    // Nothing is playing, fall back to the most recently played track.
    const recentlyPlayedRes = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-store",
    });

    if (!recentlyPlayedRes.ok) {
      throw new Error(
        `Spotify recently-played endpoint returned status ${recentlyPlayedRes.status}`
      );
    }

    const recentlyPlayed = await recentlyPlayedRes.json();
    const track: SpotifyTrack | undefined = recentlyPlayed?.items?.[0]?.track;

    if (!track) {
      return NextResponse.json(
        { error: "no_track_available" },
        { status: 404, headers: CACHE_HEADERS }
      );
    }

    return NextResponse.json(serializeTrack(track, false), {
      headers: CACHE_HEADERS,
    });
  } catch (error) {
    console.error("Spotify API error:", error);
    return NextResponse.json(
      {
        error: "spotify_unavailable",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502, headers: CACHE_HEADERS }
    );
  }
}
