
require("dotenv").config();
const express = require("express")
const app = express()
const bodyParser = require('body-parser');
const cors = require("cors")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const multer = require('multer');
const imageDownloader = require('image-downloader')
const path = require('path');
const connectDb = require("./Utils/databaseConf");
const User = require("./Models/UserModel")
const Place = require("./Models/placeModel")
const Booking = require("./Models/BookingModel")
const Review = require("./Models/ReviewModel")



const corsOptions = {
  origin: ["http://localhost:5173", "https://developershahapartments01.netlify.app/"],
  methods: "GET,POST,PATCH,DELETE,UPDATE,PUT,HEAD ",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json())
app.use(bodyParser.json());

app.use('/uploads', express.static(__dirname + '/uploads'));

//Admin Routes here...
const adminRoute = require("./Routes/adminRoute")
const contactRoute = require("./Routes/contactRoute")
const serviceRoute = require("./Routes/serviceRoute")
//User Routes here...
const authRoute = require("./Routes/authRoute")
const uploadRoute = require('./Routes/uploadRoute')
const placeRoute = require('./Routes/placeRoute')
const bookingRoute = require('./Routes/bookingRoute')
const reviewRoute = require('./Routes/reviewRoute')
const stripeController = require('./Controllers/StripeController')
app.use("/api/admin", adminRoute)
app.use("/api/form", contactRoute)
app.use("/api/data", serviceRoute)
app.use('/api/auth', authRoute);
app.use('/api', uploadRoute);
app.use('/api', placeRoute);
app.use('/api', bookingRoute);
app.use('/api', reviewRoute);

const PORT = 5000
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})

