"use client";

import { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import { fetchJson } from "@/lib/fetch-json";

interface SpotifyTrack {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
}

export default function SpotifyCard() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpotifyStatus() {
      try {
        setTrack(await fetchJson<SpotifyTrack>("/api/spotify"));
      } catch (error) {
        console.error("Failed to fetch Spotify status:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSpotifyStatus();
    // Poll Spotify status every 15 seconds to keep it fresh
    const interval = setInterval(fetchSpotifyStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !track) {
    return (
      <div className="flex items-center gap-4 p-4 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 rounded-xl animate-pulse">
        <div className="w-14 h-14 bg-neutral-200 dark:bg-neutral-800 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></div>
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <a
      href={track.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-4 border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-900/85 rounded-xl transition duration-300 group max-w-md w-full relative overflow-hidden"
    >
      {/* Vinyl/CD Cover Art Container */}
      <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
        <img
          src={track.albumImageUrl}
          alt={track.album}
          className={`w-12 h-12 rounded-full object-cover shadow-md z-10 border border-neutral-300 dark:border-neutral-700 ${
            track.isPlaying ? "animate-spin-slow" : ""
          }`}
        />
        {/* Vinyl center dot */}
        <div className="absolute w-3 h-3 bg-neutral-50 dark:bg-neutral-900 rounded-full z-20 border border-neutral-300 dark:border-neutral-800"></div>
        {/* Vinyl records outline back effect */}
        <div className="absolute inset-0 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 opacity-60 animate-[spin_30s_linear_infinite]"></div>
      </div>

      {/* Title & Status */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="relative flex h-2 w-2">
            {track.isPlaying && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                track.isPlaying ? "bg-green-500" : "bg-neutral-400"
              }`}
            ></span>
          </span>
          <span className="text-[11px] font-medium tracking-wide uppercase text-neutral-500 dark:text-neutral-400">
            {track.isPlaying ? "Now Playing" : "Last Played"}
          </span>
        </div>

        <div className="truncate font-semibold text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-green-500 transition-colors duration-200">
          {track.title}
        </div>
        <div className="truncate text-xs text-neutral-600 dark:text-neutral-400">
          {track.artist}
        </div>
      </div>

      {/* Visualizer and Logo Side */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <FaSpotify className="text-neutral-400 dark:text-neutral-600 group-hover:text-green-500 transition-colors duration-300 w-5 h-5" />
        
        {track.isPlaying && (
          <div className="flex items-end gap-[2px] h-3">
            <span className="w-[2px] h-full bg-green-500 rounded-sm animate-bounce-slow origin-bottom" style={{ animationDelay: "0.1s" }}></span>
            <span className="w-[2px] h-full bg-green-500 rounded-sm animate-bounce-slow origin-bottom" style={{ animationDelay: "0.4s" }}></span>
            <span className="w-[2px] h-full bg-green-500 rounded-sm animate-bounce-slow origin-bottom" style={{ animationDelay: "0.2s" }}></span>
          </div>
        )}
      </div>
    </a>
  );
}
