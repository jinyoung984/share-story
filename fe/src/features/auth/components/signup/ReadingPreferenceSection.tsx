import { FormSection } from '../../../../shared/ui';
import type { PreferredGenre, ReadingAmount } from '../../types/signup';

import styles from './SignupFormSection.module.css';

interface ReadingPreferenceSectionProps {
  genres: PreferredGenre[];
  readingAmount: ReadingAmount | '';

  onGenreChange: (genres: PreferredGenre[]) => void;
  onReadingAmountChange: (readingAmount: ReadingAmount) => void;
}

const GENRES: { value: PreferredGenre; label: string }[] = [
  { value: 'NOVEL', label: '소설' },
  { value: 'ECONOMY_BUSINESS', label: '경제·경영' },
  { value: 'SELF_DEVELOPMENT', label: '자기계발' },
  { value: 'IT', label: 'IT' },
  { value: 'ESSAY', label: '에세이' },
  { value: 'TRAVEL_LIFESTYLE', label: '여행·라이프스타일' },
  { value: 'PARENT_CHILD', label: '부모 교육' },
  { value: 'HUMANITIES_PHILOSOPHY', label: '인문·철학' },
  { value: 'SOCIETY', label: '사회' },
  { value: 'SCIENCE', label: '과학' },
  { value: 'HISTORY', label: '역사' },
  { value: 'ETC', label: '그외' },
];

const READING_AMOUNTS: ReadingAmount[] = ['1~2권', '3~4권', '4~5권', '5~6권'];

function ReadingPreferenceSection({
  genres,
  readingAmount,
  onGenreChange,
  onReadingAmountChange,
}: ReadingPreferenceSectionProps) {
  const handleGenreToggle = (genre: PreferredGenre) => {
    const nextGenres = genres.includes(genre)
      ? genres.filter((selectedGenre) => selectedGenre !== genre)
      : [...genres, genre];

    onGenreChange(nextGenres);
  };

  return (
    <FormSection title="선호 도서 / 한달 독서량">
      <p className={styles.fieldLabel}>선호 카테고리 (복수 선택 가능)</p>

      <div className={styles.preferenceGroup}>
        {GENRES.map(({ value: genre, label }) => {
          const isSelected = genres.includes(genre);

          return (
            <button
              key={genre}
              type="button"
              className={`${styles.optionButton} ${isSelected ? styles.optionButtonSelected : ''}`}
              onClick={() => handleGenreToggle(genre)}
              aria-pressed={isSelected}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p className={styles.fieldLabel}>한달 독서량</p>

      <div className={styles.preferenceGroup}>
        {READING_AMOUNTS.map((amount) => {
          const isSelected = readingAmount === amount;

          return (
            <button
              key={amount}
              type="button"
              className={`${styles.optionButton} ${styles.readingButton} ${
                isSelected ? styles.optionButtonSelected : ''
              }`}
              onClick={() => onReadingAmountChange(amount)}
              aria-pressed={isSelected}
            >
              {amount}
            </button>
          );
        })}
      </div>

      <p className={styles.helpText}>필수 여부·복수 선택·구간 중복은 확인 필요</p>
    </FormSection>
  );
}

export default ReadingPreferenceSection;
