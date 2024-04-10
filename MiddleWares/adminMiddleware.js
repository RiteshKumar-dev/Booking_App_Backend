const adminMiddleware = async (req, res, next) => {
  try {
    // console.log(req.user)
    const isAdminVerified = req.user.isAdmin;
    if (!isAdminVerified) {
      return res.status(403).json({ message: "Access denied :User is not an admin..." })
    }
    // res.status(200).json({ message: req.user.isAdmin })
    next()
  } catch (error) {
    console.log("addminmiddleware", error)
    next()
  }
}
module.exports = adminMiddleware;