const mongoose = require("mongoose")
const URL = process.env.MONGODB_URL


const connectDb = async () => {
  try {
    mongoose.connect(URL)
      .then(() => {
        console.log("MongoDB connected successfully");
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
      });
  } catch (err) {
    console.log("Error to connect databse...")
  }
}

module.exports = connectDb;


