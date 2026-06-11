export interface OverviewData {
  role?: string;
  company?: string;
  resumeUrl: string;
  location: string;
  phone: string;
  phoneRaw: string;
  email: string;
}

export const overviewData: OverviewData = {
  resumeUrl: "/resume.pdf",
  location: "Pune, Maharashtra, India",
  phone: "+91 89560 08591",
  phoneRaw: "tel:+918956008591",
  email: "abhishekswami1435@gmail.com",
};
