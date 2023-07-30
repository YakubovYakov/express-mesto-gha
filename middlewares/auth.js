const jwt = require('jsonwebtoken');
// const { checkToken } = require('../utils/token');
const Unauthorized = require('../errors/Unauthorized');

const { JWT_SECRET = 'secret-key' } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new Unauthorized('Ошибка авторизации');
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    throw new Unauthorized('Ошибка авторизации');
  }
  // eslint-disable-next-line no-undef
  req.user = payload;
  return next();
  // if (!req.cookies) {
  //   throw new Unauthorized('Ошибка авторизации');
  // }
  // const token = req.cookies.jwt;
  // const result = checkToken(token);
  // req.user = result;
  // if (!result) {
  //   throw new Unauthorized('Ошибка авторизации');
  // }
  // next();
};

module.exports = auth;

// // eslint-disable-next-line consistent-return
// module.exports = (req, _, next) => {
//   const { authorization } = req.headers;
//   const bearer = 'Bearer ';
//   const erorrMsg = 'Ошибка авторизации';

//   if (!authorization || !authorization.startsWith(bearer)) {
//     return next(new Unauthorized(`${erorrMsg}(${authorization})`));
//   }

//   const token = authorization.replace(bearer, '');
//   let payloud;

//   try {
//     // eslint-disable-next-line no-unused-vars
//     payloud = jwt.verify(token, NODE_ENV ? JWT_SECRET : 'some-secret-key');
//   } catch (err) {
//     return next(new Unauthorized(`${erorrMsg}`));
//   }
// };
