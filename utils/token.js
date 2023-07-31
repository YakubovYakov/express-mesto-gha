const JWT = require('jsonwebtoken');

const SECRET_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGM4MDE1MzAzYjM2OGIzNzhhZDY5YzYiLCJpYXQiOjE2OTA4MjkyMDIsImV4cCI6MTY5MTQzNDAwMn0.IWh6IoKuVl6DDTraQlp7yww5XKA31MyS_3x-j3qoEuI';

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
