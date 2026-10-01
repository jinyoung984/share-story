const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
// 공통 middleware
const errorHandler = require('./common/middleware/errorHandler');
// const authorization = require('./common/middleware/authorization');

// 기능별 router
const meetupRouter = require('./modules/meetup/meetup.routes');
const authRouter = require('./modules/auth/auth.routes');
const sessionRoutes = require('./modules/session/session.routes');

const app = express();

app.use(logger('dev'));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  }),
);
// 1. JSON 형태의 body 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// urlencoded 할때 { extended : false } 옵션은 권장사항.

// src/app.js 상단 또는 중간에 테스트용 헬스체크 라우트 추가
app.get('/ping', (req, res) => {
  console.log('핑 요청 들어옴!');
  res.send('pong');
});

app.use('/session', sessionRoutes);

// Meetup API
app.use('/meetup', meetupRouter);

app.use('/auth', authRouter);
// Error Handler는 일반 route 등록 이후에 위치
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
