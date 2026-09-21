export type FavoriteMediaItem = {
  title: string;
  year: number;
  director: string;
  poster: string;
};

export type FavoriteMediaCategory = {
  category: string;
  creditLabel: "Director" | "Creator";
  items: FavoriteMediaItem[];
};

export const FAVORITE_MEDIA: FavoriteMediaCategory[] = [
  {
    category: "Movies",
    creditLabel: "Director",
    items: [
      {
        title: "The Shawshank Redemption",
        year: 1994,
        director: "Frank Darabont",
        poster: "/favourites/the-shawshank-redemption.png",
      },
      {
        title: "Avengers: Infinity War",
        year: 2018,
        director: "Anthony & Joe Russo",
        poster: "/favourites/infinity-war.png",
      },
    ],
  },
  {
    category: "Series",
    creditLabel: "Creator",
    items: [
      {
        title: "Breaking Bad",
        year: 2008,
        director: "Vince Gilligan",
        poster: "/favourites/breaking-bad.png",
      },
    ],
  },
  {
    category: "Anime",
    creditLabel: "Director",
    items: [
      {
        title: "Demon Slayer",
        year: 2019,
        director: "Haruo Sotozaki",
        poster: "/favourites/demon-slayer.png",
      },
    ],
  },
];
