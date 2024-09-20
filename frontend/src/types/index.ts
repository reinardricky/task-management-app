export interface User {
  id: number;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string; // Optional field
  status: "To Do" | "In Progress" | "Done";
  dueDate?: Date; // Optional field
}
