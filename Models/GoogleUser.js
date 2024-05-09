const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

const googleUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profilePic: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  sub: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});


googleUserSchema.pre('save', async function (next) {
  console.log("Pre method", this);
  const user = this;
  if (!user.isModified("password")) {
    next();
  }
  try {
    const saltRund = await bcrypt.genSalt(12);
    const hash_Password = await bcrypt.hash(user.password, saltRund);
    user.password = hash_Password;
  } catch (err) {
    next(err);
  }
})


googleUserSchema.methods.genrateToken = async function () {
  try {
    return jwt.sign({
      userId: this._id.toString(),
      email: this.email,
      isAdmin: this.isAdmin
    },
      process.env.JWT_SECRET_KEY, { expiresIn: "30d" }
    )
  } catch (err) {
    console.log("Error to genrate token", err)
  }
}

googleUserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
}


const GoogleUser = mongoose.model("GoogleUser", googleUserSchema);

module.exports = GoogleUser;