const TOKEN_KEY = 'sharestory.token';

// --- 토큰 관리 헬퍼 ---
export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = (): void => localStorage.removeItem(TOKEN_KEY);

// --- 커스텀 API 에러 클래스 ---
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// --- 딜레이 헬퍼 ---
export const delay = (ms: number = 400): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// --- 인증 실패(401/403) 콜백 핸들러 ---
type UnauthorizedHandler = () => void;
let onUnauthorized: UnauthorizedHandler | null = null;

export const setUnauthorizedHandler = (fn: UnauthorizedHandler): void => {
  onUnauthorized = fn;
};

// --- Request 옵션 인터페이스 ---
interface RequestOptions {
  method?: string;
  // any 대신 unknown 사용 및 Record<string, unknown>과 호환되도록 인터페이스/타입 수용
  body?: Record<string, unknown> | FormData;
  auth?: boolean;
}

// --- 안전한 에러 메세지 추출을 위한 타입 가드 함수 ---
interface ErrorResponse {
  message: string;
}

// api.ts
export interface AuthResponse {
  count?: number;
}

function isErrorResponse(data: unknown): data is ErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'message' in data &&
    typeof (data as Record<string, unknown>).message === 'string'
  );
}

// --- 공통 Fetch 래퍼 함수 ---
async function request<T = unknown>(
  path: string,
  { method = 'GET', body, auth = false }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};

  if (auth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const isFormData = body instanceof FormData;
  if (body && !isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  // data의 기본 타입을 unknown으로 안전하게 유지
  let data: unknown = null;

  try {
    const res = await fetch(path, {
      method,
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
    console.log(`API Response: ${JSON.stringify(res)}`);
    try {
      data = await res.json();
    } catch {
      // JSON 변환 실패 시 (응답 바디 없음 등)
    }

    if (!res.ok) {
      if (auth && (res.status === 401 || res.status === 403)) {
        onUnauthorized?.();
      }

      // 타입 가드(isErrorResponse)를 통해 안전하게 message 추출
      const errorMessage = isErrorResponse(data) ? data.message : `요청 실패 (${res.status})`;

      throw new ApiError(errorMessage, res.status);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.',
      500,
    );
  }
}

// --- API 인터페이스 타입 정의 ---
export interface SignUpParams extends Record<string, unknown> {
  user_id: string;
  name: string;
  password: string;
  email: string;
  gender: string;
  age_group: string;
  genres: string;
  readingAmount: string;
}

export interface LoginParams extends Record<string, unknown> {
  user_id: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  message?: string;
}

// --- 백엔드 API 연동 객체 ---
export const api = {
  // 회원 관련
  signUp: (params: SignUpParams) =>
    request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: params,
    }),

  // 회원 관련
  getMyInfo: (user_id: string) =>
    request<AuthResponse>('/auth/getMyInfo', {
      method: 'POST',
      body: { user_id: user_id },
    }),

  // 회원 관련
  updateAuth: (params: SignUpParams) =>
    request<AuthResponse>('/auth/updateMyInfo', {
      method: 'PATCH',
      body: params,
    }),

  login: (params: LoginParams) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: params,
    }),
};
