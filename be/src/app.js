const express = require('express');
const logger = require('morgan');
require('dotenv').config();

// 공통 middleware
const errorHandler = require('./common/middleware/errorHandler');
// const authorization = require('./common/middleware/authorization');

// 기능별 router
const meetupRouter = require('./modules/meetup/meetup.routes');
const authRouter = require('./modules/auth/auth.routes');

const app = express();

app.use(logger('dev'));
// 1. JSON 형태의 body 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// urlencoded 할때 { extended : false } 옵션은 권장사항.

// Meetup API
app.use('/meetup', require('./modules/member/meetup.routes'), meetupRouter);

app.use('/auth', authRouter);
// 마이페이지 및 참여자 기능
app.use('/member', require('./modules/member/member.routes'));
app.use('/logbook', require('./modules/logbook/logbook.routes'));
app.use('/review', require('./modules/review/review.routes'));
// Error Handler는 일반 route 등록 이후에 위치
app.use(errorHandler);

module.exports = app;
