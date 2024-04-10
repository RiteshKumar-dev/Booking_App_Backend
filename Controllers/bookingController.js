const Booking = require('../Models/BookingModel');

const createBooking = async (req, res) => {
  try {
    const userData = req.user;
    const { place, checkIn, checkOut, numberOfGuests, name, phone, price } = req.body;

    const newBooking = new Booking({
      user: userData.id,
      place,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userData = req.user;
    const bookings = await Booking.find({ user: userData.id }).populate('place');
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createBooking, getUserBookings, deleteBooking };
