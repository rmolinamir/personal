export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export const sort = {
  newest: "newest",
  oldest: "oldest",
} as const;

export type Sort = keyof typeof sort;
