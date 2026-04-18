
export interface BaseIdea {
  title: string;
  concept: string;
}

export interface BlogPostIdea extends BaseIdea {
  outline: string[];
  keywords: string[];
  metaDescription: string;
}

export type Platform = 'Blog';

export type Idea = BlogPostIdea & { platform: Platform };
