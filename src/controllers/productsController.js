const User = require("../models/User");
const Product = require("../models/Products");
require("dotenv").config();
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const jwtSecret = process.env.JWT_SECRET;

const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

const productController = {
  create: async (req, res) => {
    try {
      const id = req.params.id;

      const image = req.file.filename;

      const productReq = {
        productName: req.body.productName,
        src: image,
        description: req.body.description,
        value: req.body.value,
      };

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Usuario não existe" });
      }

      const response = await Product.create(productReq);

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }

      user.products.push(response._id);

      await user.save();

      res
        .status(201)
        .json({ response, msg: "Produto cadastrado com sucesso." });
    } catch (error) {
      console.log(error);
    }
  },
  getAllProducts: async (req, res) => {
    try {
      const findProducts = await Product.find();

      res.json(findProducts);
    } catch (error) {
      console.log(error);
    }
  },
  getProduct: async (req, res) => {
    try {
      const id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Produto não existe" });
      }

      const findUserId = await Product.findById(id);

      if (!findUserId) {
        return res.status(404).json({ msg: "Produto não encontrado" });
      }

      res.json(findUserId);
    } catch (error) {
      console.log(error);
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const productId = req.params.productId;

      if (
        !mongoose.Types.ObjectId.isValid(id) ||
        !mongoose.Types.ObjectId.isValid(productId)
      ) {
        return res.status(400).json({ msg: "ID inválido" });
      }

      const findUserId = await User.findById(id);

      const findProductId = await Product.findById(productId);

      if (!findUserId) {
        return res.status(404).json({ msg: "Usuario não encontrado" });
      }

      const productIndex = findUserId.products.indexOf(productId);
      if (productIndex === -1) {
        return res
          .status(403)
          .json({ msg: "Usuário não tem permissão para excluir este produto" });
      }

      findUserId.products.splice(productIndex, 1);

      await findUserId.save();

      fs.unlinkSync(findProductId.src);

      await Product.findByIdAndDelete(productId);

      res
        .status(200)
        .json({ findUserId, msg: "Produto excluido com sucesso." });
    } catch (error) {
      console.log(error);
    }
  },
  updateProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const productId = req.params.productId;

      const productReq = {
        productName: req.body.productName,
        description: req.body.description,
        value: req.body.value,
      };

      if (
        !mongoose.Types.ObjectId.isValid(id) ||
        !mongoose.Types.ObjectId.isValid(productId)
      ) {
        return res.status(400).json({ msg: "ID inválido" });
      }

      const findUserId = await User.findById(id);

      if (!findUserId) {
        return res.status(404).json({ msg: "Usuario não encontrado" });
      }

      const productIndex = findUserId.products.indexOf(productId);
      if (productIndex === -1) {
        return res.status(403).json({
          msg: "Usuário não tem permissão para atualizar este produto",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        productReq,
        { new: true }
      );

      res
        .status(200)
        .json({ updatedProduct, msg: "Produto atualizado com sucesso" });
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = productController;
