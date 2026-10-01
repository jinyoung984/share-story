export type Gender = '남' | '여';

export type PreferredGenre =
  | 'NOVEL'
  | 'ECONOMY_BUSINESS'
  | 'SELF_DEVELOPMENT'
  | 'IT'
  | 'ESSAY'
  | 'TRAVEL_LIFESTYLE'
  | 'PARENT_CHILD'
  | 'HUMANITIES_PHILOSOPHY'
  | 'SOCIETY'
  | 'SCIENCE'
  | 'HISTORY'
  | 'ETC';

export type ReadingAmount = '1~2권' | '3~4권' | '4~5권' | '5~6권';

export interface SignupForm {
  user_id: string;
  password: string;
  passwordConfirm: string;

  emailId: string;
  emailDomain: string;

  name: string;

  gender: Gender | '';
  age_group: string;

  genres: PreferredGenre[];
  readingAmount: ReadingAmount | '';
}
