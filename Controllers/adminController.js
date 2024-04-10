const User = require("../Models/UserModel")



const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select({ password: 0 })
    if (!users || users.length === 0) {
      res.status(404).json({ message: "NO users in database..." })
    }
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const data = await User.findOne({ _id: userId }, { password: 0 })
    return res.status(200).json(data)
  } catch (error) {
    next(error)
  }
};
const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userData = req.body; // Use req.body to access the request body
    const updateUser = await User.updateOne({ _id: userId }, { $set: userData });
    return res.status(200).json(updateUser);
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.deleteOne({ _id: userId });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllUsers, deleteUserById, getUserById, updateUserById, }