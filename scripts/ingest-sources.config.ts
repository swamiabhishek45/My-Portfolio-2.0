export const ingestSourcesConfig = {
  githubUsername: process.env.GITHUB_USERNAME ?? "swamiabhishek45",
  mediumUsername: process.env.MEDIUM_USERNAME ?? "swamiabhishek45",
  resumePdfPath: process.env.RESUME_PDF_PATH ?? "",
  privateNotesDir: "knowledge/private",
  linkedinExportPath: process.env.LINKEDIN_EXPORT_PATH ?? "",
  xExportPath: process.env.X_EXPORT_PATH ?? "",
  webAllowlist: [
    "https://swamiabhishek.online",
    "https://medium.com/@swamiabhishek45",
  ],
};
