import mongoose, { Collection } from "mongoose";
import { Products } from "./d";
// Define schema
const Schema = mongoose.Schema;

const ProductSchema = new Schema<Products>({
    id: Number,
    name: String,
    description: String,
    price: Number,
    tags: [String],
    img_src: String,
    isDeal: Boolean

},{collection: 'products'});

// Compile model from schema
const products = mongoose.model<Products>('products', ProductSchema);

export default products;
