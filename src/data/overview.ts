export interface Role {
  title: string;
  company?: string;
  iconName: "code" | "lightbulb" | "user" | "globe";
}

export interface OverviewData {
  roles: Role[];
  location: string;
  email: string;
  website: string;
  websiteRaw: string;
  gender: string;
  timezone: string;
}

export const overviewData: OverviewData = {
  roles: [{ title: "Full Stack GenAI Engineer", iconName: "code" }],
  location: "Pune, Maharashtra, India",
  email: "abhishekswami1435@gmail.com",
  website: "swamiabhishek.online",
  websiteRaw: "https://github.com/swamiabhishek45",
  gender: "he/him",
  timezone: "Asia/Kolkata"
};
