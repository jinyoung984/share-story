const authService = require('./auth.service');

/**
 * [Controller]
 * - 요청(req)에서 필요한 값을 가져옵니다.
 * - Service를 호출합니다.
 * - Service의 처리 결과를 HTTP 응답으로 반환합니다.
 * - 비즈니스 로직은 Service에서 처리합니다.
 */
const getAuth = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const user = await authService.getAuthById(user_id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const { User } = require('../../models/index');

//password hash
const createHash = async (password) => {
  const saltRounds = parseInt(process.env.SALT_ROUND, 10) || 10;
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
};

//회원가입
const signUp = async (req, res, next) => {
  try {
    const {
      name,
      password,
      user_id,
      gender,
      age_group,
      readingAmount,
      genres,
      social_provider,
      social_id,
      updated_user_id,
      email,
      created_user_id,
    } = req.body;

    // 유효성 검사
    if (!user_id || !password || !name) {
      return res.status(400).json({ success: false, message: '필수 항목이 누락되었습니다.' });
    }

    //중복체크
    const user = await User.findOne({ where: { user_id: user_id } });
    console.log('POST /auth/signup ', user);
    if (user) {
      return res
        .status(409)
        .json({ success: false, message: `이미 가입이 되어있습니다. ${user_id}` });
    }
    // 비밀번호 해시화
    const newPassword = await createHash(password);

    // DB 생성
    const result = await User.create({
      name,
      password: newPassword,
      user_id,
      gender,
      age_group,
      monthly_reading_volume: readingAmount,
      genre_1: genres[0],
      genre_2: genres[1],
      social_provider,
      social_id,
      updated_user_id: user_id,
      email,
      created_user_id: user_id,
    });

    // 응답 전달
    res.status(201).json({
      success: true,
      document: { name: result.name, user_id: result.user_id },
      message: '회원가입에 완료되었습니다.',
    });
  } catch (error) {
    console.error('회원가입 처리 중 에러 발생:', error);
    next(error);
  }
};

//로그인
const login = async (req, res, next) => {
  try {
    const { password, user_id } = req.body;
    console.log(`be login controller user_id ===> ${user_id}`);
    const user = await User.findOne({ where: { user_id: user_id } });

    //이메일체크, 비밀번호 확인
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: `회원정보가 잘못되었습니다.` });
    }

    const option = { expiresIn: 'user_id' };
    //토큰생성, payload는 {user_id }
    const token = jwt.sign({ user_id }, secret);
    //console.log(`token ===> ${token}`);
    console.log(`be login controller token ===> ${token}`);
    return res
      .status(200)
      .json({ success: true, token: token, message: '로그인에 완료되었습니다.', document: user });
  } catch (error) {
    console.log(`error ===> ${error}`);
    next(error, req, res);
  }
};

//아이디 중복확인
const getMyInfo = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    console.log(`getMyInfo user_id: ${user_id}`);
    const count = await User.count({ where: { user_id: user_id } });
    console.log(`getMyInfo count: ${count}`);

    return res
      .status(200)
      .json({
        message: count === 0 ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.',
        count,
      });
  } catch (error) {
    console.log(`error ===> ${error}`);
    next(error, req, res);
  }
};

//회원정보 수정
const updateMyInfo = async (req, res, next) => {
  try {
    const {
      password,
      user_id,
      email,
      name,
      gender,
      age_group,
      monthly_reading_volume,
      genre_1,
      genre_2,
    } = req.body;
    const user = await User.update(
      {
        email: email,
        name: name,
        gender: gender,
        age_group: age_group,
        monthly_reading_volume: monthly_reading_volume,
        genre_1: genre_1,
        genre_2: genre_2,
      },
      { where: { user_id: user_id } },
    );

    //이메일체크, 비밀번호 확인
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: `회원정보가 잘못되었습니다.` });
    }

    return res
      .status(200)
      .json({ success: true, token: token, message: '로그인에 완료되었습니다.' });
  } catch (error) {
    console.log(`error ===> ${error}`);
    next(error, req, res);
  }
};

module.exports = { getAuth, signUp, login, getMyInfo, updateMyInfo };
