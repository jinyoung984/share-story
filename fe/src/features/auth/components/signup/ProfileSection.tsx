import { FormSection, TextInput } from '../../../../shared/ui';
import type { Gender } from '../../types/signup';

import styles from './SignupFormSection.module.css';

interface ProfileSectionProps {
  gender: Gender | '';
  age_group: string;

  onGenderChange: (value: Gender) => void;
  onAgeGroupChange: (value: string) => void;
}

const GENDERS: Gender[] = ['남', '여'];

function ProfileSection({
  gender,
  age_group,
  onGenderChange,
  onAgeGroupChange,
}: ProfileSectionProps) {
  return (
    <FormSection number={5} title="성별 / 생년월일">
      <div className={styles.fieldGroup}>
        <div className={styles.row}>
          {GENDERS.map((genderOption) => {
            const isSelected = gender === genderOption;

            return (
              <button
                key={genderOption}
                type="button"
                className={`${styles.equalOptionButton} ${
                  isSelected ? styles.equalOptionButtonSelected : ''
                }`}
                onClick={() => onGenderChange(genderOption)}
                aria-pressed={isSelected}
              >
                {genderOption}
              </button>
            );
          })}
        </div>

        <TextInput
          id="age_group"
          aria-label="생년월일"
          name="age_group"
          type="text"
          value={age_group}
          onChange={(event) => onAgeGroupChange(event.target.value)}
          placeholder="YYYY.MM.DD"
          className={styles.input}
          autoComplete="bday"
        />
      </div>
    </FormSection>
  );
}

export default ProfileSection;
