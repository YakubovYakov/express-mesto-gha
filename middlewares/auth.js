const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/token');

const Unauthorized = require('../errors/Unauthorized');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  const erorrMsg = 'Ошибка авторизации';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(
      new Unauthorized(`${erorrMsg}(${authorization})!`),
    );
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    // верификация токена
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return next(new Unauthorized(`${erorrMsg}`));
  }
  req.user = payload;

  return next();
};
