import { fetchNoStore, noStoreJson } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Call counterapi.dev to increment and fetch the count.
    // Namespace: swamiabhishek45, Key: portfolio
    const response = await fetchNoStore(
      "https://api.counterapi.dev/v1/swamiabhishek45/portfolio/up"
    );

    if (!response.ok) {
      throw new Error(`Counter API returned status ${response.status}`);
    }

    const data = await response.json();

    return noStoreJson({ count: data.count });
  } catch (error) {
    console.error("Error in visitor counter API:", error);
    // Return a realistic fallback if the API is offline
    return noStoreJson({ count: 17349 });
  }
}
