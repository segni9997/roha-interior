export interface PostContent {
  type: 'paragraph' | 'heading' | 'list';
  text?: string;
  items?: string[];
}

export interface Post {
  id: number;
  title: string;
  description: string;
  category: string;
  type: string;
  year: string;
  author: string;
  readTime: string;
  image: string;
  content: PostContent[];
}