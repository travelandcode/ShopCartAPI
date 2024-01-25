import mongoose from "mongoose";
import { Product } from "./d";
// Define schema
const Schema = mongoose.Schema;

const ProductSchema = new Schema<Product>({
    id: Number,
    name: String,
    description: String,
    price: Number,
    tags: [String],
    img_src: [String],
    isDeal: Boolean

},{collection: 'products'});

// Compile model from schema
const products = mongoose.model<Product>('products', ProductSchema);

export default products;
