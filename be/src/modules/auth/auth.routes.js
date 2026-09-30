const router = require('express').Router();
const { signUp, login, getMyInfo, updateMyInfo } = require('./auth.controller');

router.post('/signup', signUp);
router.post('/login', login);
router.post('/getMyInfo', getMyInfo);
router.patch('/updateMyInfo', updateMyInfo);

module.exports = router;
