const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const path = require("path");

const app = express();
const port = 3000;

const conn = require("./db/conn");

conn();
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

const routes = require("./routes/router");

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});
