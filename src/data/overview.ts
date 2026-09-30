export interface Role {
  title: string;
  company?: string;
  iconName: "code" | "lightbulb" | "user" | "globe";
}

export interface OverviewData {
  roles: Role[];
  location: string;
  phone: string;
  phoneRaw: string;
  email: string;
  website: string;
  websiteRaw: string;
  gender: string;
  timezone: string;
}

export const overviewData: OverviewData = {
  roles: [
    { title: "Full Stack GenAI Engineer", iconName: "code" },
    { title: "Full Stack Developer @ One Union Solutions", iconName: "globe" },
  ],
  location: "Pune, Maharashtra, India",
  phone: "+91 8956* *****",
  phoneRaw: "tel:+918956008591",
  email: "abhishekswami1435@gmail.com",
  website: "swamiabhishek.online",
  websiteRaw: "https://github.com/swamiabhishek45",
  gender: "he/him",
  timezone: "Asia/Kolkata"
};
