const express = require("express");
const router = express.Router();

const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  changePassword,
  archiveUser,
  retriveUser,
  searchUsers
} = require("../controllers/userController");


router.route("/").get(getUsers).post(createUser);
router.route("/:user_id").get(getUser).put(updateUser).delete(deleteUser)
router.route("/password/:user_id").put(changePassword)
router.route("/archive/:user_id").put(archiveUser)
router.route("/retrive/:user_id").put(retriveUser)
router.route("/search").post(searchUsers)
router.post("/login", loginUser);


module.exports = router;
