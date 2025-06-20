
// export interface Journal {
//   _id: string;
//   user: string;
//   text: string;
//   createdAt: string;
// }

export interface Journal {
  _id: string;
  user: string;
  text: string;
  createdAt: string;
  aiInsights?: {
    mood: string;
    tone: string;
    summary: string;
  };
  embedding?: number[];
}
