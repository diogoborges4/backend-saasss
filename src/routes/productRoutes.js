const router = require("express").Router();

const productController = require("../controllers/productsController");
const userController = require("../controllers/productsController");
const upload = require("../config/multer");
const paymentController = require("../controllers/paymentController");

router
  .route("/user/:id/product")
  .post(upload.single("file"), (req, res) =>
    productController.create(req, res)
  );
router
  .route("/products")
  .get((req, res) => productController.getAllProducts(req, res));
router
  .route("/products/:id")
  .get((req, res) => userController.getProduct(req, res));
router
  .route("/user/:id/product/:productId")
  .delete((req, res) => userController.deleteProduct(req, res));
router
  .route("/user/:id/product/:productId")
  .put((req, res) => userController.updateProduct(req, res));
router.route("/payment").post((req, res) => paymentController.create(req, res));
router
  .route("/webhook")
  .post((req, res) => paymentController.reqPayment(req, res));

module.exports = router;
