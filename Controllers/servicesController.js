const Service = require("../Models/ServiceModel");

const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find()
    if (!services || services.length === 0) {
      res.status(404).json({ message: "NO services in database..." })
    }
    res.status(200).json(services)
  } catch (error) {
    console.log("Error from service controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
const deleteServicesById = async (req, res) => {
  const userId = req.params.id;

  try {
    const service = await Service.findById(userId);
    if (!service) {
      return res.status(404).json({ message: "service not found" });
    }

    await Service.deleteOne({ _id: userId });

    res.status(200).json({ message: "service deleted successfully" });
  } catch (error) {
    console.log("Error deleting service:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllServices, deleteServicesById }