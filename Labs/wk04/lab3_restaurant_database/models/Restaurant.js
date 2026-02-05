const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema(
  {
    building: String,
    street: String,
    zipcode: String,
    coord: [Number],
    city: String,
  },
  { _id: false }
);

const GradeSchema = new mongoose.Schema(
  {
    date: Date,
    grade: String,
    score: Number,
  },
  { _id: false }
);

const RestaurantSchema = new mongoose.Schema(
  {
    address: AddressSchema,
    borough: String,
    city: String, // kept explicitly for queries in the lab requirements
    cuisine: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    restaurant_id: {
      type: String,
      required: true,
      trim: true,
    },
    grades: [GradeSchema],
  },
  {
    collection: 'restaurants',
    strict: false, // allow any extra fields from the sample data set
  }
);

module.exports = mongoose.model('Restaurant', RestaurantSchema);
