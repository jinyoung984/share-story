const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const bcrypt = require('bcrypt');
const { User, sequelize } = require('../../src/models');

// API 테스트용 일반 회원. 캡틴 지정과 크루 가입은 API를 통해 진행합니다.
// npm run seed
// 공통 로그인 비밀번호: Test1234!
const users = [
  {
    user_id: 'test_user_1',
    name: '김테스트',
    email: 'test_user_1@example.com',
    genre_1: 'NOVEL',
    genre_2: 'HUMANITIES_PHILOSOPHY',
    monthly_reading_volume: 'BOOKS_1_2',
    age_group: '20대',
    gender: 'M',
  },
  {
    user_id: 'test_user_2',
    name: '이테스트',
    email: 'test_user_2@example.com',
    genre_1: 'IT',
    genre_2: 'SCIENCE',
    monthly_reading_volume: 'BOOKS_3_4',
    age_group: '30대',
    gender: 'F',
  },
  {
    user_id: 'test_user_3',
    name: '박테스트',
    email: 'test_user_3@example.com',
    genre_1: 'ESSAY',
    genre_2: 'TRAVEL_LIFESTYLE',
    monthly_reading_volume: 'BOOKS_5_6',
    age_group: '20대',
    gender: 'F',
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    const saltRounds = parseInt(process.env.SALT_ROUND, 10) || 10;

    const results = await sequelize.transaction(async (transaction) => {
      const results = [];

      for (const user of users) {
        const [, created] = await User.findOrCreate({
          where: { user_id: user.user_id },
          defaults: {
            ...user,
            password: await bcrypt.hash('Test1234!', saltRounds),
            created_user_id: user.user_id,
            updated_user_id: user.user_id,
          },
          // 재실행 시 삭제된 회원을 포함해 기존 계정을 변경하지 않습니다.
          paranoid: false,
          transaction,
        });
        results.push({ user_id: user.user_id, status: created ? '생성' : '기존 회원 유지' });
      }

      return results;
    });

    console.table(results);
    console.log('회원 시드 완료');
  } catch (error) {
    console.error('회원 시드 실패:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  seed();
}

module.exports = { users, seed };
