const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [50, 'Username can be at most 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    // Regular expression to validate email format
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Please enter a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    // Regular expression to validate phone number format
    match: [/^\d{10}$/, 'Please enter a valid phone number'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  try {
    const saltRounds = 12;
    const hashPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.generateToken = function () {
  return jwt.sign({
    userId: this._id.toString(),
    email: this.email,
    isAdmin: this.isAdmin
  },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "30d" }
  );
};

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
