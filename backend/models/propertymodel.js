import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: [String],
    required: true
  },
  beds: {
    type: Number,
    required: true,
  },
  baths: {
    type: Number,
    required: true,
  },
  sqft: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  availability: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amenities: {
    type: Array,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  googleMapLink: {
    type: String,
    default: '',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Set to true after migration if necessary
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'expired'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid',
  },
}, { timestamps: true });

const Property = mongoose.model("Property", propertySchema);

export default Property;
