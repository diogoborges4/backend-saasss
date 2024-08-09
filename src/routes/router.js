const router = require("express").Router();

const userRouter = require("./userRoutes");
const productRouter = require("./productRoutes");

router.use("/", userRouter);
router.use("/", productRouter);

module.exports = router;
