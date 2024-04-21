import mongoose from "mongoose"
import { User, Order } from "./d"
// Define schema
const Schema = mongoose.Schema;

const UserSchema = new Schema<User>({
  id: String,
  name: String,
  email: String,
  password: String,
  isEmailVerified: Boolean,
  orders: Array<Order>,
  cart: [{id: Number, quantity: Number}]
},{collection: 'users'});

// Compile model from schema
const users = mongoose.model<User>('users', UserSchema);

export default users;