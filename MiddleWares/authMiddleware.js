const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");
const GoogleUser = require("../Models/GoogleUser");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const jwtToken = token.replace("Bearer", "").trim();
    // console.log("token from authmiddleware:", jwtToken);

    try {
      const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
      // console.log("here:", isVerified)
      let userData;

      userData = await User.findOne({ email: isVerified.email }).select({ password: 0 });
      if (!userData) {
        userData = await GoogleUser.findOne({ email: isVerified.email }).select({ password: 0 });
      }

      if (!userData) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = userData;
      req.token = token;
      req.userId = userData._id;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid Token..." });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { authMiddleware };
