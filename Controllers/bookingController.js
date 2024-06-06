const Booking = require('../Models/BookingModel');
const Stripe = require('stripe')

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

const getCheckOut = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findById(id).populate('place');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update isBooked to true
    booking.isBooked = true;
    await booking.save();

    const stripe = require('stripe')(process.env.Stripe_Secret_Key);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Booking for ${booking.place.title}`,
            description: `
              Check-In: ${booking.checkIn.toDateString()}
              Check-Out: ${booking.checkOut.toDateString()}
              Number of Guests: ${booking.numberOfGuests}
              Name: ${booking.name}
              Phone: ${booking.phone}
              -----------------------
            `,
          },
          unit_amount: booking.price * 100, // Price in cents
        },
        quantity: 1,
      }],
      success_url: `${process.env.Client_Side_URL}/account/bookings`,
      cancel_url: `${process.env.Client_Side_URL}/`,
    });

    res.status(200).json({ id: session.id, url: session.url, bookingData: booking });
  } catch (error) {
    console.log("getCheckOut Route...", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = { createBooking, getUserBookings, deleteBooking, getCheckOut };
