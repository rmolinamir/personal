export type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export const status = {
  all: "all",
  completed: "completed",
  open: "open",
} as const;

export type Status = keyof typeof status;
