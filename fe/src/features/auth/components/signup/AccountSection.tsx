import { FormSection, Button, TextInput, Notice } from '../../../../shared/ui';
import styles from './SignupFormSection.module.css';

interface AccountSectionProps {
  user_id: string;
  message: string;
  onUserIdChange: (value: string) => void;
  onUserIdCheck: () => void;
}

function AccountSection({ user_id, message, onUserIdChange, onUserIdCheck }: AccountSectionProps) {
  return (
    <FormSection number={1} title="아이디">
      <div className={styles.row}>
        <TextInput
          aria-label="아이디"
          id="user_id"
          name="user_id"
          type="text"
          value={user_id}
          onChange={(event) => onUserIdChange(event.target.value)}
          placeholder="아이디를 입력해 주세요"
          className={`${styles.input} ${styles.flexInput}`}
          autoComplete="user_id"
        />

        <Button type="button" className={styles.checkButton} onClick={onUserIdCheck}>
          중복확인
        </Button>
      </div>

      {message && <Notice>{message}</Notice>}

      <p className={styles.helpText}>영문·숫자 조합 10자리 이하</p>
    </FormSection>
  );
}

export default AccountSection;
