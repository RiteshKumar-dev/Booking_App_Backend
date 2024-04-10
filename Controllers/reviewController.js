const Review = require('../Models/ReviewModel');

const createReview = async (req, res) => {
  try {
    const userData = req.userData;
    const { place, rating, comment, userName, email } = req.body;

    const newReview = new Review({
      user: req.userId,
      place,
      rating,
      comment,
      userName,
      email,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Failed to create review" });
  }
};

const getReviewsByPlace = async (req, res) => {
  try {
    const reviews = await Review.find({ place: req.params.placeId }).populate('user', 'userName');
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userData = req.user;
    console.log("From review", userData.id)
    const review = await Review.findById(reviewId);

    if (!review) {
      // return res.status(404).json({ message: 'Review not found' });
      return;
    }

    if (review.user.toString() !== userData.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createReview, getReviewsByPlace, deleteReview };
