const router = require("express").Router();

const {
  getUserInfo,
  getUserInfoId,
  updateUser,
  updateAvatar,
  createUserInfo,
} = require("../controllers/users");

// Пользователи
router.get("/", getUserInfo);
// Пользователь по ID
router.get("/:id", getUserInfoId);
// Создание пользователя
router.post("/", createUserInfo);
// Обновление профиля
router.patch("/me", updateUser);
// Обновляет аватар
router.patch("/me/avatar", updateAvatar);

module.exports = router;
