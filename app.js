// require("dotenv").config();
// const express = require("express")
// const app = express()
// const bodyParser = require('body-parser');
// const cors = require("cors")
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const cloudinary = require('cloudinary').v2;
// const fs = require('fs');
// const multer = require('multer');
// const imageDownloader = require('image-downloader')
// const path = require('path');
// const connectDb = require("./Utils/databaseConf");
// const User = require("./Models/UserModel")
// const Place = require("./Models/placeModel")
// const Booking = require("./Models/BookingModel")
// const Review = require("./Models/ReviewModel")



// const corsOptions = {
//   origin: "http://localhost:5173",
//   methods: "GET,POST,PATCH,DELETE,UPDATE,PUT,HEAD ",
//   credentials: true,
// };
// app.use(cors(corsOptions));
// app.use(express.json())
// app.use(bodyParser.json());

// app.use('/uploads', express.static(__dirname + '/uploads'));

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const authMiddleWare = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization');
//     if (!token) {
//       return res.status(401).json({ message: "Token not provided" });
//     }

//     const jwtToken = token.replace("Bearer", "").trim();
//     console.log("token from authmiddleware:", jwtToken);

//     try {
//       const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY)
//       const userData = await User.findOne({ email: isVerified.email }).select({ password: 0 })
//       console.log(userData)
//       req.user = userData
//       req.token = token
//       req.userId = userData._id
//       next();
//     } catch (error) {
//       return res.status(401).json({ message: "Invalid Token..." });
//     }

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };


// app.get('/api/home', (req, res) => {
//   res.json("This is a root page of airbnb clone...");
// });

// app.post('/api/auth/signup', async (req, res) => {
//   try {
//     // console.log(req.body)
//     const { username, email, phone, password } = req.body;
//     const userExist = await User.findOne({ email: email })
//     if (userExist) {
//       return res.status(400).json({ message: "Email is already exist..." })
//     }
//     const newUser = await User.create({ username, email, phone, password })
//     res.status(201).json({ msg: "Registration successfull", token: await newUser.genrateToken(), userId: newUser._id.toString(), userData: newUser })
//   } catch (err) {
//     console.log("Error in signup api route...", err)
//   }
// })

// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const userExist = await User.findOne({ email: email })
//     console.log(userExist)
//     if (!userExist) {
//       return res.status(400).json({ message: "Invalid Credentials..." })
//     }
//     // const isPasswordValid = await bcrypt.compare(password, userExist.password);
//     const isPasswordValid = await userExist.comparePassword(password)
//     if (isPasswordValid) {
//       res.status(200).json({ msg: "Login successfull", token: await userExist.genrateToken(), userId: userExist._id.toString(), userData: userExist })
//     } else {
//       res.status(401).json({ msg: "Invalid Credentials..." })
//     }
//   } catch (err) {
//     console.log("Error in login api route...", err)
//   }
// })

// app.get('/api/auth/user', authMiddleWare, (req, res) => {
//   try {
//     const userData = req.user;
//     const token = req.token.replace("Bearer", "").trim();
//     console.log(userData)
//     console.log(token)
//     return res.status(200).json({ userData, token })
//   } catch (error) {
//     console.log("Error from the user root", error)

//   }
// })

// app.post('/api/upload-by-link', async (req, res) => {
//   const { link } = req.body;
//   const newName = 'photo' + Date.now() + '.jpg';
//   await imageDownloader.image({
//     url: link,
//     dest: __dirname + '/uploads/' + newName,
//   });
//   res.json(newName);
// });

// const photosMiddleware = multer({ dest: 'uploads/' });
// app.post('/api/upload', photosMiddleware.array('photos', 100), async (req, res) => {
//   // console.log(req.files)
//   // res.json(req.files)
//   const uploadedFiles = [];
//   for (let i = 0; i < req.files.length; i++) {
//     const { path, originalname, mimetype } = req.files[i];
//     const parts = originalname.split('.');
//     const ext = parts[parts.length - 1];
//     const newPath = path + '.' + ext;
//     fs.renameSync(path, newPath);
//     uploadedFiles.push(newPath.replace('uploads\\', ""))
//   }
//   res.json(uploadedFiles)
// });

// app.post('/api/upload-by-link', async (req, res) => {
//   const { link } = req.body;
//   try {
//     const result = await cloudinary.uploader.upload(link);
//     res.json(result);
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     res.status(500).json({ message: 'Failed to upload image' });
//   }
// });

// const photosMiddleware = multer({ dest: 'uploads/' });
// app.post('/api/upload', photosMiddleware.array('photos', 100), async (req, res) => {
//   const uploadedFiles = [];
//   try {
//     for (let i = 0; i < req.files.length; i++) {
//       const { path } = req.files[i];
//       const result = await cloudinary.uploader.upload(path);
//       uploadedFiles.push(result.secure_url);
//     }
//     res.json(uploadedFiles);
//   } catch (error) {
//     console.error('Error uploading images:', error);
//     res.status(500).json({ message: 'Failed to upload images' });
//   }
// });

// app.post('/api/places', authMiddleWare, async (req, res) => {
//   try {
//     const token = req.token.replace("Bearer", "").trim();
//     const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;

//     const userData = req.user;
//     const placeInfo = await Place.create({
//       owner: userData.id,
//       title,
//       address,
//       photos: addedPhotos,
//       description,
//       perks,
//       extraInfo,
//       checkIn,
//       checkOut,
//       maxGuests,
//       price
//     });

//     res.json(placeInfo);
//   } catch (error) {
//     console.error("Error creating place:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// })

// app.get('/api/user-places', authMiddleWare, async (req, res) => {
//   try {
//     const token = req.token.replace("Bearer", "").trim();
//     const userData = req.user;
//     const places = await Place.find({ owner: userData.id });

//     res.json(places);
//   } catch (error) {
//     console.error("Error fetching user places:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// })

// app.delete('/api/user-places/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Place.findByIdAndDelete(id);
//     res.sendStatus(204);
//   } catch (error) {
//     console.error("Error deleting place:", error);
//     res.status(500).json({ error: "Failed to delete place" });
//   }
// })

// app.get('/api/places/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const place = await Place.findById(id);
//     res.json(place);
//   } catch (error) {
//     console.error("Error fetching place by ID:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// })

// app.put('/api/places/:id', authMiddleWare, async (req, res) => {
//   try {
//     const token = req.token.replace("Bearer", "").trim();
//     const { id } = req.params;
//     const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;

//     const userData = req.user;
//     const placeData = await Place.findById(id);

//     if (!placeData) {
//       return res.status(404).json({ message: "Place not found" });
//     }

//     if (userData.id !== placeData.owner.toString()) {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     placeData.set({
//       title,
//       address,
//       photos: addedPhotos,
//       description,
//       perks,
//       extraInfo,
//       checkIn,
//       checkOut,
//       maxGuests,
//       price
//     });

//     await placeData.save();
//     res.json("Place updated successfully");
//   } catch (error) {
//     console.error("Error updating place:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// })

// app.get('/api/places', async (req, res) => {
//   try {
//     const places = await Place.find();
//     res.json(places);
//   } catch (error) {
//     console.error("Error fetching places:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }
// )

// app.post('/api/bookings', authMiddleWare, async (req, res) => {
//   try {
//     const userData = req.user;
//     const { place, checkIn, checkOut, numberOfGuests, name, phone, price } = req.body;

//     const newBooking = new Booking({
//       user: userData.id,
//       place,
//       checkIn,
//       checkOut,
//       numberOfGuests,
//       name,
//       phone,
//       price,
//     });

//     const savedBooking = await newBooking.save();
//     res.status(201).json(savedBooking);
//   } catch (error) {
//     console.error("Error creating booking:", error);
//     res.status(500).json({ error: "Failed to create booking" });
//   }
// })

// app.get('/api/bookings', authMiddleWare, async (req, res) => {
//   try {
//     const userData = req.user;
//     const bookings = await Booking.find({ user: userData.id }).populate('place');
//     res.json(bookings);
//   } catch (error) {
//     console.error("Error fetching bookings:", error);
//     res.status(500).json({ error: "Failed to fetch bookings" });
//   }
// })

// app.delete('/api/bookings/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     const deletedBooking = await Booking.findByIdAndDelete(id);
//     if (!deletedBooking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }
//     res.json({ message: "Booking deleted successfully" });
//   } catch (error) {
//     console.error('Error deleting booking:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// },
// )

// app.post('/api/reviews', authMiddleWare, async (req, res) => {
//   try {
//     const userData = req.userData;
//     const { place, rating, comment, userName, email } = req.body;

//     const newReview = new Review({
//       user: req.userId,
//       place,
//       rating,
//       comment,
//       userName,
//       email,
//     });

//     const savedReview = await newReview.save();
//     res.status(201).json(savedReview);
//   } catch (error) {
//     console.error("Error creating review:", error);
//     res.status(500).json({ error: "Failed to create review" });
//   }
// })

// app.get('/api/reviews/place/:placeId', async (req, res) => {
//   try {
//     const reviews = await Review.find({ place: req.params.placeId }).populate('user', 'userName');
//     res.json(reviews);
//   } catch (error) {
//     console.error("Error fetching reviews:", error);
//     res.status(500).json({ error: "Failed to fetch reviews" });
//   }
// })

// app.delete('/api/reviews/:id', authMiddleWare, async (req, res) => {
//   try {
//     const reviewId = req.params.id;
//     const userData = req.user;
//     console.log("From review", userData.id)
//     const review = await Review.findById(reviewId);

//     if (!review) {
//       // return res.status(404).json({ message: 'Review not found' });
//       return;
//     }

//     if (review.user.toString() !== userData.id) {
//       return res.status(403).json({ message: 'You are not authorized to delete this review' });
//     }

//     await Review.findByIdAndDelete(reviewId);

//     res.status(200).json({ message: 'Review deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting review:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });




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
  origin: "http://localhost:5173",
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

