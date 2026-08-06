import { Suspense } from "react";
import {
  GitHubContributions,
  GitHubContributionsError,
  GitHubContributionsFallback,
} from "@/components/github-contributions";
import { ErrorBoundary } from "@/components/error-boundary";
import { getCachedContributions } from "@/lib/get-cached-contributions";

const GITHUB_USERNAME = "swamiabhishek45";
const GITHUB_PROFILE_URL = "https://github.com/swamiabhishek45";

export default function GitHub() {
  const contributions = getCachedContributions(GITHUB_USERNAME);

  return (
    <section className="flex flex-col w-full">
      <div className="border border-dotted border-neutral-300 dark:border-neutral-800/80 p-5 rounded-2xl bg-neutral-50/10 dark:bg-neutral-900/10">
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 font-mono">
          // Tracking my GitHub contributions and open-source activity over the past year.
        </p>

        {/* The Calendar */}
        <div className="github-calendar-wrapper w-full flex justify-center">
          <ErrorBoundary
            label="GitHub contributions"
            fallback={<GitHubContributionsError />}
          >
            <Suspense fallback={<GitHubContributionsFallback />}>
              <GitHubContributions
                contributions={contributions}
                githubProfileUrl={GITHUB_PROFILE_URL}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </section>
  );
}