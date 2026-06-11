export interface AboutSegment {
  text: string;
  bold: boolean;
}

export interface AboutBullet {
  segments: AboutSegment[];
}

export const aboutBullets: AboutBullet[] = [
  {
    segments: [
      { text: "Full Stack Developer", bold: true },
      { text: " ", bold: false },
      { text: "", bold: true },
      { text: "", bold: false },
    ],
  },
    {
    segments: [
      { text: "Skilled in ", bold: false },
      { text: "Next.js, React, JavaScript, Node.js, & MongoDB", bold: true },
      { text: ".", bold: false },
    ],
  },
   {
    segments: [
      { text: "Learning in ", bold: false },
      { text: "System Design & GenAI", bold: true },
      { text: ".", bold: false },
    ],
  },
  {
    segments: [
      { text: "Passionate about ", bold: false },
      { text: "exploring new technologies & learning new things", bold: true },
      { text: ".", bold: false },
    ],
  },
 
];
