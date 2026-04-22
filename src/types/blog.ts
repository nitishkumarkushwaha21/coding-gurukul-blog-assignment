export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
  featured: boolean;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  readingTime?: string;
}
