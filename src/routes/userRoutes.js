const router = require("express").Router();

const { userController, checkToken } = require("../controllers/UseController");

router.route("/register").post((req, res) => userController.create(req, res));
router.route("/login").post((req, res) => userController.loginUser(req, res));
router.route("/users").get((req, res) => userController.getAllUsers(req, res));
router
  .route("/users/:id")
  .get(checkToken, (req, res) => userController.getUser(req, res));
router.get("/me", checkToken, async (req, res) => {
  res.send(req.user);
});
router
  .route("/users/:id")
  .delete((req, res) => userController.deleteUser(req, res));
router
  .route("/users/:id")
  .put((req, res) => userController.updateUser(req, res));

module.exports = router;
