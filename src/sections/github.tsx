import { Suspense } from "react";
import {
  GitHubContributions,
  GitHubContributionsFallback,
} from "@/components/github-contributions";
import { getCachedContributions } from "@/lib/get-cached-contributions";

const GITHUB_USERNAME = "swamiabhishek45";
const GITHUB_PROFILE_URL = "https://github.com/swamiabhishek45";

export default function GitHub() {
  const contributions = getCachedContributions(GITHUB_USERNAME);

  return (
    <section className="border p-5 rounded-lg">
      <h2 className="text-xl font-semibold border-b border-neutral-400 mb-3">
        GitHub Contributions
      </h2>

      <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-2 mb-4">
        Tracking my GitHub contributions and open-source activity over the past year.
      </p>

      {/* The Calendar */}
      <div className="github-calendar-wrapper w-full flex justify-center">
        <Suspense fallback={<GitHubContributionsFallback />}>
          <GitHubContributions
            contributions={contributions}
            githubProfileUrl={GITHUB_PROFILE_URL}
          />
        </Suspense>
      </div>
    </section>
  );
}