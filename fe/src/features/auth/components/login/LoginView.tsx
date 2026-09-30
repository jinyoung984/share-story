import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Field,
  TextInput,
  Button,
  PageHeading,
  PageContainer,
  FormSection,
  Notice,
} from '../../../../shared/ui';

export default function LoginView() {
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const [user_id, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function hanldeSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      console.log(`${user_id}`);
      await login(user_id, password);
      navigate(from, { replace: true });
    } catch (e) {
      console.error(e);
      alert(`${e instanceof Error ? e.message : '로그인에 실패했습니다.'}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageContainer narrow>
      <PageHeading
        eyebrow="WELCOME BACK"
        title="다시 만나 반가워요."
        description="로그인하고 이어서 항해해요."
      />

      <form onSubmit={hanldeSubmit}>
        <FormSection title="로그인">
          <Field label="아이디" required>
            <TextInput
              type="text"
              name="user_id"
              autoComplete="user_id"
              required
              onChange={(e) => setUserId(e.target.value)}
              placeholder="아이디를 입력해 주세요"
              value={user_id}
            />
          </Field>
          <Field label="비밀번호" required>
            <TextInput
              type="password"
              name="password"
              autoComplete="current-password"
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해 주세요"
              value={password}
            />
          </Field>

          <Button type="submit" disabled={submitting}>
            {submitting ? '로그인중...' : '로그인'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setMessage('비밀번호 찾기는 아직 준비 중입니다.')}
          >
            비밀번호 찾기
          </Button>
        </FormSection>

        {message && <Notice>{message}</Notice>}
      </form>

      <p>
        아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
      </p>
    </PageContainer>
  );
}
