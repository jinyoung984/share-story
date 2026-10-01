const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

/* Authorization: Bearer <token> 검증 후 req.user = { id, lvl } 설정 */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: '인증 토큰이 필요합니다.' });
  }

  const token = authHeader.slice('Bearer '.length);

  try {
    req.user = jwt.verify(token, secret);
    if (!req.user.user_id && req.user.id) {
      req.user.user_id = req.user.id;
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: '유효하지 않거나 만료된 토큰입니다.' });
  }
}

module.exports = { verifyToken };
