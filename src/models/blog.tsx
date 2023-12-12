export type Article = {
  id: number;
  date: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: object;
  author: number;
  featured_media: number;
};
