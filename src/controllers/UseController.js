const User = require("../models/User");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const checkToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado." });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;

    const decoded = jwt.verify(token, jwtSecret);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    res.status(400).json({ msg: "Token inválido" });
  }
};

const userController = {
  create: async (req, res) => {
    try {
      const userReq = {
        userName: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      };

      if (!userReq.userName) {
        return res.status(422).json({ msg: "O nome é obrigatório." });
      }
      if (!userReq.email) {
        return res.status(422).json({ msg: "O email é obrigatório." });
      }
      if (!userReq.password) {
        return res.status(422).json({ msg: "A senha é obrigatória." });
      }
      if (userReq.password !== userReq.confirmPassword) {
        return res.status(422).json({ msg: "As senhas tem que ser iguais" });
      }

      const userExists = await User.findOne({ email: userReq.email });

      if (userExists) {
        return res
          .status(422)
          .json({ msg: "Esse email ja esta sendo utilizado" });
      }

      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(userReq.password, salt);

      const userValidate = {
        userName: req.body.name,
        email: req.body.email,
        password: passwordHash,
        confirmPassword: req.body.confirmPassword,
      };

      const response = await User.create(userValidate);

      res.status(201).json({ response, msg: "Usuario cadastrado com sucesso" });
    } catch (error) {
      console.log(error);
    }
  },
  loginUser: async (req, res) => {
    try {
      const userReq = {
        email: req.body.email,
        password: req.body.password,
      };

      if (!userReq.email) {
        return res.status(422).json({ msg: "O email é obrigatório." });
      }
      if (!userReq.password) {
        return res.status(422).json({ msg: "A senha é obrigatória." });
      }

      const userExists = await User.findOne({ email: userReq.email });

      if (!userExists) {
        return res.status(404).json({ msg: "Usuario não encontrado" });
      }

      const checkPassword = await bcrypt.compare(
        userReq.password,
        userExists.password
      );

      if (!checkPassword) {
        return res.status(422).json({ msg: "Senha Inválida" });
      }

      const secret = process.env.JWT_SECRET;

      if (!secret) {
        return res
          .status(500)
          .json({ msg: "Erro no servidor, secret não definido" });
      }

      const token = jwt.sign(
        {
          id: userExists._id,
        },
        secret
      );

      res
        .status(200)
        .json({ token, userExists, msg: "Usuario autenticado com sucesso" });
    } catch (error) {
      console.log(error);
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const findUsers = await User.find();

      res.json(findUsers);
    } catch (error) {
      console.log(error);
    }
  },
  getUser: async (req, res) => {
    try {
      const id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Usuario não existe" });
      }

      const findUserId = await User.findById(id, "-password");

      if (!findUserId) {
        return res.status(404).json({ msg: "Usuario não encontrado" });
      }

      res.json(findUserId);
    } catch (error) {
      console.log(error);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "Usuario não existe" });
      }

      const findUserId = await User.findById(id);

      if (!findUserId) {
        return res.status(404).json({ msg: "Usuario não encontrado" });
      }

      const deletedUser = await User.findByIdAndDelete(id);

      res
        .status(200)
        .json({ deletedUser, msg: "Usuario excluido com sucesso." });
    } catch (error) {
      console.log(error);
    }
  },
  updateUser: async (req, res) => {
    const id = req.params.id;

    const userReq = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const updateUser = await User.findByIdAndUpdate(id, userReq);

    if (!updateUser) {
      return res.status(404).json({ msg: "Usuario não encontrado" });
    }

    res.status(200).json({ userReq, msg: "Usuario atualizado." });
  },
};

module.exports = { userController, checkToken };
