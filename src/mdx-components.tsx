import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

const components = {
  h1: ({ children }) => (
    <h1 className="mt-12 mb-8 text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 text-center">
      {children}
    </h1>
  ),

  h2: ({ children }) => (
    <h2 className="
    mb-4 pb-2
    text-2xl md:text-xl
    font-semibold
    text-neutral-800 dark:text-neutral-200
    border-b border-neutral-200 dark:border-neutral-700
  ">
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="mb-3 text-xl font-semibold text-neutral-800 dark:text-neutral-300">
      {children}
    </h3>
  ),

  Block: ({ children }) => (
    <div className="mb-10 border border-neutral-200 dark:border-neutral-700 rounded-xl px-5 py-4">
      {children}
    </div>
  ),
  /* ------------------------------ Text ------------------------------ */

  p: ({ children }) => (
    <p className="my-4 text-lg leading-relaxed text-neutral-800 dark:text-neutral-300">
      {children}
    </p>
  ),

  a: ({ href, children }) => (
    <a
      href={href}
      className="text-blue-400 underline underline-offset-4 hover:text-blue-300 transition"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),

  /* ------------------------------ Lists ------------------------------ */

  ul: ({ children }) => (
    <ul className="my-4 list-disc list-inside space-y-2 text-neutral-800 dark:text-neutral-300">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="my-4 list-decimal list-inside space-y-2 text-neutral-800 dark:text-neutral-300">
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li className="leading-relaxed">
      {children}
    </li>
  ),

  /* --------------------------- Block Content --------------------------- */

  blockquote: ({ children }) => (
    <blockquote className="my-6 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-100 dark:bg-neutral-900/40 px-5 py-4 italic text-neutral-600 dark:text-neutral-400">
      {children}
    </blockquote>
  ),

  code: ({ children }) => (
    <code className="rounded bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 text-sm text-neutral-900 dark:text-neutral-100">
      {children}
    </code>
  ),

  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 p-5 text-sm">
      {children}
    </pre>
  ),

  /* ------------------------------ Media ------------------------------ */

  img: (props) => (
    <Image
      {...(props as ImageProps)}
      width={250}
      height={250}
      sizes="(max-width: 768px) 100vw, 520px"
      className="my-8 mx-auto rounded-xl border border-neutral-200 dark:border-neutral-700"
      style={{ height: "auto" }}
    />
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
