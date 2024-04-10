const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  photos: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  provider: {
    type: String,
    required: true
  }
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
