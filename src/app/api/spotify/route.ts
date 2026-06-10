import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const getAccessToken = async () => {
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

  return response.json();
};

export async function GET() {
  const cacheHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  };

  // If credentials are not set, return mock data matching the user's reference image
  if (!client_id || !client_secret || !refresh_token) {
    return NextResponse.json({
      isPlaying: false,
      title: "One Day",
      artist: "Kodaline",
      album: "In a Perfect World",
      albumImageUrl: "https://i.scdn.co/image/ab67616d0000b273b400994f31c26c04f981014e",
      songUrl: "https://open.spotify.com/track/1a2RlhZ6aU3a4eM1962j4d",
    }, {
      headers: cacheHeaders,
    });
  }

  try {
    const { access_token } = await getAccessToken();
    if (!access_token) {
      throw new Error("Failed to get access token from Spotify");
    }

    // 1. Try to fetch currently playing track
    const currentlyPlayingRes = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-store",
    });

    if (currentlyPlayingRes.status === 204 || currentlyPlayingRes.status > 400) {
      // Nothing is playing, fallback to recently played track
      const recentlyPlayedRes = await fetch(RECENTLY_PLAYED_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        cache: "no-store",
      });

      if (!recentlyPlayedRes.ok) {
        throw new Error("Failed to fetch recently played");
      }

      const recentlyPlayed = await recentlyPlayedRes.json();
      const track = recentlyPlayed.items[0]?.track;

      if (!track) {
        throw new Error("No recently played track found");
      }

      return NextResponse.json({
        isPlaying: false,
        title: track.name,
        artist: track.artists.map((_artist: any) => _artist.name).join(", "),
        album: track.album.name,
        albumImageUrl: track.album.images[0]?.url,
        songUrl: track.external_urls.spotify,
      }, {
        headers: cacheHeaders,
      });
    }

    const song = await currentlyPlayingRes.json();
    if (!song.item) {
      throw new Error("No currently playing song item found");
    }

    return NextResponse.json({
      isPlaying: song.is_playing,
      title: song.item.name,
      artist: song.item.artists.map((_artist: any) => _artist.name).join(", "),
      album: song.item.album.name,
      albumImageUrl: song.item.album.images[0]?.url,
      songUrl: song.item.external_urls.spotify,
    }, {
      headers: cacheHeaders,
    });
  } catch (error) {
    console.error("Spotify API error, returning mock track:", error);
    return NextResponse.json({
      isPlaying: false,
      title: "One Day",
      artist: "Kodaline",
      album: "In a Perfect World",
      albumImageUrl: "https://i.scdn.co/image/ab67616d0000b273b400994f31c26c04f981014e",
      songUrl: "https://open.spotify.com/track/1a2RlhZ6aU3a4eM1962j4d",
    }, {
      headers: cacheHeaders,
    });
  }
}
