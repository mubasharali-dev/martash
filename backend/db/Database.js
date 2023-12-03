const mongoose = require("mongoose");
require("dotenv").config({ path: "./backend/.env" });

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((data) => {
      console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
    .catch((error) => {
      console.error(`MongoDB connection error: ${error.message}`);
    });
};

module.exports = { connectDatabase };
