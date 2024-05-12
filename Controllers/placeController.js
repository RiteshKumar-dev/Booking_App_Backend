const Place = require('../Models/placeModel');
const mongoose = require('mongoose');


const createPlace = async (req, res) => {
  try {
    const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
    const userData = req.user;
    const placeInfo = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price
    });
    res.json(placeInfo);
  } catch (error) {
    console.error("Error creating place:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserPlaces = async (req, res) => {
  try {
    const userData = req.user;
    const places = await Place.find({ owner: userData.id });
    res.json(places);
  } catch (error) {
    console.error("Error fetching user places:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deletePlace = async (req, res) => {
  try {
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting place:", error);
    res.status(500).json({ error: "Failed to delete place" });
  }
};

const getPlaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);
    res.json(place);
  } catch (error) {
    console.error("Error fetching place by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updatePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
    const userData = req.user;
    const placeData = await Place.findById(id);

    if (!placeData) {
      return res.status(404).json({ message: "Place not found" });
    }

    if (userData.id !== placeData.owner.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    placeData.set({
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price
    });

    await placeData.save();
    res.json("Place updated successfully");
  } catch (error) {
    console.error("Error updating place:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateLikeStatus = async (req, res) => {
  try {
    const placeId = req.params.id;
    const likeStatus = req.body.like;

    // Ensure that placeId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      return res.status(400).json({ error: 'Invalid placeId' });
    }

    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }

    const newLikeStatus = !place.likeStatus;

    await Place.updateOne({ _id: placeId }, { $set: { likeStatus: newLikeStatus } });

    res.json({ message: 'Like status updated successfully', newLikeStatus });
  } catch (error) {
    console.error('Error updating like status:', error);
    res.status(500).json({ error: 'Failed to update like status' });
  }
};



// const updateLikeStatus = async (req, res) => {
//   try {
//     const placeId = req.params.id;
//     const likeStatus = req.body.like;
//     const userId = req.user.id; // Assuming req.user contains the current user's ID

//     // Ensure that placeId is a valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(placeId)) {
//       return res.status(400).json({ error: 'Invalid placeId' });
//     }

//     const place = await Place.findById(placeId);

//     if (!place) {
//       return res.status(404).json({ message: 'Place not found' });
//     }

//     // Check if the current user has already liked the place
//     const userLiked = place.likes.some(like => like.user.toString() === userId);

//     if (likeStatus && !userLiked) {
//       // Add the user's like to the place
//       place.likes.push({ user: userId });
//     } else if (!likeStatus && userLiked) {
//       // Remove the user's like from the place
//       place.likes = place.likes.filter(like => like.user.toString() !== userId);
//     }

//     await place.save();

//     res.json({ message: 'Like status updated successfully' });
//   } catch (error) {
//     console.error('Error updating like status:', error);
//     res.status(500).json({ error: 'Failed to update like status' });
//   }
// };



module.exports = { createPlace, getUserPlaces, deletePlace, getPlaceById, updatePlace, getAllPlaces, updateLikeStatus };
