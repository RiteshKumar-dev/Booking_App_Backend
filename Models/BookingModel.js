const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  place: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Place" },
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  numberOfGuests: { type: Number, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  price: Number,
  isBooked: {
    type: Boolean,
    default: false,
  }
});
const BookingModel = mongoose.model('Booking', bookingSchema);
module.exports = BookingModel
