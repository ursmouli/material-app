export interface User {
  id: number;
  name: string;
  email: string;
  token: string;
  role: 'admin' | 'user' | 'teacher' | 'student';
}
