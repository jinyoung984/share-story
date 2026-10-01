import { Button, Notice } from '../../../../shared/ui';
import { validateSignup, validateSignupId } from '../../lib/signupValidation';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import type { SignupForm } from '../../types/signup';

import AccountSection from './AccountSection';
import EmailSection from './EmailSection';
import NicknameSection from './NicknameSection';
import PasswordSection from './PasswordSection';
import ProfileSection from './ProfileSection';
import ReadingPreferenceSection from './ReadingPreferenceSection';

import styles from './SignupView.module.css';
import { api } from '../../lib/api/api';

const INITIAL_FORM: SignupForm = {
  user_id: '',
  password: '',
  passwordConfirm: '',
  emailId: '',
  emailDomain: '',
  name: '',
  gender: '',
  age_group: '',
  genres: [],
  readingAmount: '',
};

// api.ts
export interface AuthResponse {
  message: string; // '?' 제거 (필수값으로 변경)
  count?: number;
}

function SignupView() {
  const [message, setMessage] = useState('');
  const [form, setForm] = useState<SignupForm>(INITIAL_FORM);
  const [idMessage, setIdMessage] = useState('');
  const [count, setCount] = useState(1);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleChange = <K extends keyof SignupForm>(field: K, value: SignupForm[K]) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUserIdChange = async (value: string) => {
    handleChange('user_id', value);
    // 아이디가 변경되면 기존 중복 확인 결과는 무효
    setIdMessage('다시 중복을 확인해주세요.');
  };

  const handleUserIdCheck = async () => {
    setIdMessage(
      validateSignupId(form.user_id) ??
        '아이디는 영문과 숫자를 포함해 10자리 이하로 입력해 주세요.',
    );

    handleChange('user_id', form.user_id);

    try {
      const result = await api.getMyInfo(form.user_id);

      if (result.count === 0) {
        setIdMessage('사용 가능한 아이디입니다.');
        setCount(0);
      } else {
        setIdMessage('이미 사용 중인 아이디입니다.');
        setCount(1);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setIdMessage('이미 사용 중인 아이디입니다.');
      } else {
        setIdMessage('아이디 확인 중 오류가 발생했습니다. ${err.message}');
      }
    }
  };

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setMessage('회원가입 중입니다. 잠시만 기다려 주세요.');
    setSubmitting(true);

    if (count === 1) {
      setMessage('이미 사용 중인 아이디입니다.');
      return;
    }

    const signupError = validateSignup(form);
    if (signupError) {
      setMessage(signupError);
      return;
    }

    try {
      console.log(`Submitting signup form: ${JSON.stringify(form)}`);
      await api.signUp({
        user_id: form.user_id,
        password: form.password,
        email: `${form.emailId}@${form.emailDomain}`,
        name: form.name,
        gender: form.gender,
        age_group: form.age_group,
        genres: form.genres.join(','),
        readingAmount: form.readingAmount,
      });
      navigate('/login', { replace: true });
    } catch {
      setMessage('회원가입에 실패했습니다.');
    } finally {
      setMessage('회원가입이 완료되었습니다.');
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <Link to="/login" className={styles.backLink}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            돌아가기
          </Link>

          <p className={styles.eyebrow}>회원가입</p>

          <h1 className={styles.title}>항해를 시작하세요</h1>

          <p className={styles.description}>계정과 사용자 정보를 입력해 주세요.</p>
        </div>
      </header>

      <form className={styles.content} onSubmit={handleSubmit}>
        <AccountSection
          user_id={form.user_id}
          message={idMessage}
          onUserIdChange={handleUserIdChange}
          onUserIdCheck={handleUserIdCheck}
        />

        <PasswordSection
          password={form.password}
          passwordConfirm={form.passwordConfirm}
          onPasswordChange={(value) => handleChange('password', value)}
          onPasswordConfirmChange={(value) => handleChange('passwordConfirm', value)}
        />

        <EmailSection
          emailId={form.emailId}
          emailDomain={form.emailDomain}
          onEmailIdChange={(value) => handleChange('emailId', value)}
          onEmailDomainChange={(value) => handleChange('emailDomain', value)}
        />

        <NicknameSection name={form.name} onNameChange={(value) => handleChange('name', value)} />

        <ProfileSection
          gender={form.gender}
          age_group={form.age_group}
          onGenderChange={(value) => handleChange('gender', value)}
          onAgeGroupChange={(value) => handleChange('age_group', value)}
        />

        <ReadingPreferenceSection
          genres={form.genres}
          readingAmount={form.readingAmount}
          onGenreChange={(value) => handleChange('genres', value)}
          onReadingAmountChange={(value) => handleChange('readingAmount', value)}
        />

        <Button type="submit" className={styles.submitButton} disabled={submitting}>
          {submitting ? '가입중...' : '가입하기'}
        </Button>
        {message && <Notice>{message}</Notice>}
      </form>
    </div>
  );
}

export default SignupView;
