import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  offers: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
