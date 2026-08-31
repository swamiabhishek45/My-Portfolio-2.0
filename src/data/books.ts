export type BookStatus = "Completed" | "Reading" | "Queued";

export interface Book {
  slug: string;
  title: string;
  author: string;
  /** Path under /public, or any absolute URL. */
  cover: string;
  year?: string;
  status: BookStatus;
  rating: number;
  /** Shown on the left inner page, under the title. */
  note: string;
  /** Shown on the right inner page. */
  excerpt: string;
  /** Fallback spine/cover tint when the cover image fails to load. */
  accent: string;
}

export const books: Book[] = [
  // {
  //   slug: "steve-jobs",
  //   title: "Steve Jobs",
  //   author: "Walter Isaacson",
  //   cover: "/books/steve-jobs.jpg",
  //   year: "2011",
  //   status: "Completed",
  //   rating: 5,
  //   note: "Biography · 656 pages",
  //   excerpt:
  //     "The people who are crazy enough to think they can change the world are the ones who do.",
  //   accent: "#3f3f46",
  // },
  // {
  //   slug: "almanack-naval-ravikant",
  //   title: "The Almanack of Naval Ravikant",
  //   author: "Eric Jorgenson",
  //   cover: "/books/almanack-naval-ravikant.jpg",
  //   year: "2020",
  //   status: "Completed",
  //   rating: 5,
  //   note: "Philosophy · Wealth",
  //   excerpt:
  //     "Play long-term games with long-term people. All returns in life come from compound interest.",
  //   accent: "#52525b",
  // },
  // {
  //   slug: "the-stranger",
  //   title: "The Stranger",
  //   author: "Albert Camus",
  //   cover: "/books/the-stranger.jpg",
  //   year: "1942",
  //   status: "Completed",
  //   rating: 5,
  //   note: "Fiction · Absurdism",
  //   excerpt:
  //     "I opened myself to the gentle indifference of the world, and found it so much like myself.",
  //   accent: "#18181b",
  // },
  // {
  //   slug: "red-rising",
  //   title: "Red Rising",
  //   author: "Pierce Brown",
  //   cover: "/books/red-rising.jpg",
  //   year: "2014",
  //   status: "Reading",
  //   rating: 4,
  //   note: "Sci-fi · Book 1",
  //   excerpt:
  //     "I would have lived in peace. But my enemies brought me war.",
  //   accent: "#7f1d1d",
  // },
  {
    slug: "courage-to-be-disliked",
    title: "The Courage to Be Disliked",
    author: "Ichiro Kishimi & Fumitake Koga",
    cover: "/books/courage-to-be-disliked.jpg",
    year: "2013",
    status: "Completed",
    rating: 5,
    note: "Psychology · Adlerian",
    excerpt:
      "Freedom is being disliked by other people. It is proof that you are living by your own principles.",
    accent: "#991b1b",
  },
  {
    slug: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    cover: "/books/meditations.jpg",
    year: "180",
    status: "Reading",
    rating: 5,
    note: "Stoicism · Penguin Classics",
    excerpt:
      "You have power over your mind, not outside events. Realize this, and you will find strength.",
    accent: "#1e3a5f",
  },
  {
    slug: "crime-and-punishment",
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    cover: "/books/crime-and-punishment.jpg",
    year: "1866",
    status: "Queued",
    rating: 5,
    note: "Fiction · Russian classic",
    excerpt:
      "Pain and suffering are always inevitable for a large intelligence and a deep heart.",
    accent: "#292524",
  },
  // {
  //   slug: "the-rudest-book-ever",
  //   title: "The Rudest Book Ever",
  //   author: "Shwetabh Gangwar",
  //   cover: "/books/the-rudest-book-ever.jpg",
  //   year: "2019",
  //   status: "Completed",
  //   rating: 4,
  //   note: "Self-help · Blunt",
  //   excerpt:
  //     "You are not a fixed thing. You are a work in progress, and that is the whole point.",
  //   accent: "#a16207",
  // },
  {
    slug: "metamorphosis",
    title: "Metamorphosis",
    author: "Franz Kafka",
    cover: "/books/metamorphosis.png",
    year: "1915",
    status: "Completed",
    rating: 5,
    note: "Fiction · Novella",
    excerpt:
      "One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin.",
    accent: "#c2410c",
  },
  // {
  //   slug: "designing-data-intensive-applications",
  //   title: "Designing Data-Intensive Applications",
  //   author: "Martin Kleppmann",
  //   cover: "/books/designing-data-intensive-applications.jpg",
  //   year: "2017",
  //   status: "Completed",
  //   rating: 5,
  //   note: "Systems · Reference",
  //   excerpt:
  //     "The definitive map of reliability, scalability and the trade-offs hiding inside every data store.",
  //   accent: "#1f2937",
  // },
  {
    slug: "principles-of-building-ai-agents",
    title: "Principles of Building AI Agents",
    author: "Sam Bhagwat",
    cover: "/books/principles-of-building-ai-agents.png",
    year: "2024",
    status: "Reading",
    rating: 4,
    note: "AI Engineering · 2nd Edition",
    excerpt:
      "Agents are not just chatbots with tools—they are systems that perceive, reason, act, and learn in loops you can design and ship.",
    accent: "#2563eb",
  },
  {
    slug: "white-nights",
    title: "White Nights",
    author: "Fyodor Dostoevsky",
    cover: "/books/white-nights.png",
    year: "1848",
    status: "Completed",
    rating: 4,
    note: "Fiction · Russian classic",
    excerpt:
      "White Nights is a novel by Fyodor Dostoevsky, published in 1848. It is a story of love, loss, and redemption set in St. Petersburg during the 1840s.",
    accent: "#2563eb",
  },
  // {
  //   slug: "system-design-interview",
  //   title: "System Design Interview",
  //   author: "Alex Xu",
  //   cover: "/books/system-design-interview.jpg",
  //   year: "2020",
  //   status: "Reading",
  //   rating: 4,
  //   note: "Systems · Interview prep",
  //   excerpt:
  //     "Every design starts with the same question: what are we actually optimising for?",
  //   accent: "#312e81",
  // },
];
