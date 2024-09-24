export interface User {
  id: number;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string; // Optional field
  status: 'To Do' | 'In Progress' | 'Done';
  dueDate?: Date; // Optional field
}

export interface UserOption {
  value: string;
  label: string;
}

export interface Comment {
  id: number;
  user: {
    email: string;
  };
  content: string;
}

export interface User {
  id: number;
  email: string;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
}
