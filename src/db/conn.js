const mongoose = require("mongoose");
require("dotenv").config();

async function main(params) {
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASS;

  try {
    mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@cluster0.aofcoc2.mongodb.net/dbsass?retryWrites=true&w=majority`
    );

    console.log("Conectado ao banco");
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

module.exports = main;
