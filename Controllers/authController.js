const User = require('../Models/UserModel');

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
      res.status(201).json({ msg: "Registration successfull", token: await newUser.genrateToken(), userId: newUser._id.toString(), userData: newUser })
    } catch (err) {
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
        res.status(200).json({ msg: "Login successfull", token: await userExist.genrateToken(), userId: userExist._id.toString(), userData: userExist })
      } else {
        res.status(401).json({ msg: "Invalid Credentials..." })
      }
    } catch (err) {
      console.log("Error in login api route...", err)
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
