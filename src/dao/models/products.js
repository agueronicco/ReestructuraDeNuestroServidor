import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollections = "products";

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: Array,
    default: [],
  },
});

productsSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(productCollections, productsSchema);
