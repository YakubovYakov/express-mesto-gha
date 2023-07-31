const JWT = require('jsonwebtoken');

const SECRET_KEY = 'super-strong-secret';

function generateToken(payloud) {
  return JWT.sign(payloud, SECRET_KEY, {
    expiresIn: '7d',
  });
}

function checkToken(token) {
  if (!token) {
    return false;
  }
  try {
    return JWT.verify(token, SECRET_KEY);
  } catch (err) {
    return false;
  }
}

module.exports = { generateToken, checkToken, SECRET_KEY };
