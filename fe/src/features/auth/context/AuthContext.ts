// src/context/AuthContext.ts
import { createContext } from 'react';
import type { SignupForm } from '../types/signup';

console.log(`AuthContextValue`);

// login 매개변수 이름을 user_id로 통일
export interface AuthContextValue {
  user: SignupForm | null;
  login: (user_id: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
