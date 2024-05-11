const User = require('../Models/UserModel');
const GoogleUser = require('../Models/GoogleUser');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authController = {
  home: async (req, res) => {
    try {
      res.status(200).send("This is a home page of api...")
    } catch (err) {
      console.log("Error in home api route...", err)
    }
  },
  signup: async (req, res) => {
    try {
      const { username, email, phone, password } = req.body;
      const userExist = await User.findOne({ email: email })
      if (userExist) {
        return res.status(400).json({ message: "Email is already exist..." })
      }
      const newUser = await User.create({ username, email, phone, password })
      res.status(201).json({ msg: "Registration successfull", token: await newUser.generateToken(), userId: newUser._id.toString(), userData: newUser })
    } catch (err) {
      if (err.name === 'ValidationError') {
        // Extract validation errors from Mongoose and send them in the response
        const errors = {};
        for (const field in err.errors) {
          errors[field] = err.errors[field].message;
        }
        return res.status(400).json({ errors });
      }
      // For other types of errors, return a generic error message
      console.error(err);
      console.log("Error in signup api route...", err)
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const userExist = await User.findOne({ email: email })
      console.log(userExist)
      if (!userExist) {
        return res.status(400).json({ message: "Invalid Credentials..." })
      }
      const isPasswordValid = await userExist.comparePassword(password)
      if (isPasswordValid) {
        res.status(200).json({ msg: "Login successfull", token: await userExist.generateToken(), userId: userExist._id.toString(), userData: userExist })
      } else {
        res.status(401).json({ msg: "Invalid Credentials..." })
      }
    } catch (err) {
      console.log("Error in login api route...", err)
      res.status(500).json({ msg: "Invalid Credentials..." }); // Send a generic error message to the UI
    }
  },
  googleLogin: async (req, res) => {
    try {
      const { tokenId } = req.body;
      const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      console.log("Data from google route controllers :", payload)
      const { email, name, picture, jti, sub } = payload;
      let user = await GoogleUser.findOne({ email });
      if (!user) {
        user = await GoogleUser.create({ username: name, email: email, profilePic: picture, password: jti, sub: sub });
      }
      console.log(user)
      res.status(200).json({ msg: "Google login successful", token: await user.generateToken(), userId: user._id.toString(), userData: user });
    } catch (err) {
      console.error("Error in Google login API route...", err);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  getUser: (req, res) => {
    try {
      const userData = req.user;
      const token = req.token.replace("Bearer", "").trim();
      console.log(userData)
      console.log(token)
      return res.status(200).json({ userData, token })
    } catch (error) {
      console.log("Error from the user root", error)
    }
  }
};

module.exports = authController;
