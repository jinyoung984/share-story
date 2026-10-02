// src/context/AuthProvider.tsx ;
/*
AuthProvider 와 AuthContext를 분리한 이유
1. Fast Refresh(핫 리로딩)가 깨지는 것을 방지
2. 순환 참조(Circular Dependency) 방지
3. 파일 확장자와 역할의 명확성 (TS vs TSX)
4. 무엇보다 계속 빨간줄 에러...
*/
import { useState, useEffect, type ReactNode, useMemo } from 'react';
import type { SignupForm } from '../types/signup';
import { api, setToken, clearToken, setUnauthorizedHandler } from '../lib/api/api';
import { AuthContext, type AuthContextValue } from './AuthContext';

const USER_KEY = 'sharestory.user';

console.log(`AuthProvider`);

function readUser(): SignupForm | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as SignupForm) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SignupForm | null>(() => readUser());

  const logout = () => {
    clearToken();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  // 토큰 만료(401/403) 시 자동으로 로그아웃 처리
  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
    });
  }, []);

  // user 상태가 변경될 때마다 localStorage에 동기화
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: async (user_id, password) => {
        const data = await api.login({ user_id, password });

        // 1. 토큰 저장
        const token = data.token || data.token;
        console.log(`token = ${token}`);
        if (token) {
          setToken(token);
        }

        // 2. 유저 정보 저장
        const userData = { user_id } as SignupForm;
        console.log(`userData = ${JSON.stringify(userData)}`);
        setUser(userData);
      },
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
