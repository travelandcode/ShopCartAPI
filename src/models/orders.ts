import mongoose from "mongoose";
import { Order } from "./d";

// Define schema
const Schema = mongoose.Schema;

const OrderSchema = new Schema<Order>({
    id: Number,
    userId: Number,
    products: [{
        id: Number,
        quatity: Number
    }],
    status: String,
    shipping_address: String,
    subtotal: Number,
    deliveryCost: Number,
    discount: Number,
    tax: Number,
    total: Number,
    createdAt: String,
    cancelledAt: String,
    shippedAt: String,
    deliveredAt: String

},{collection: 'orders'});

// Compile model from schema
const orders = mongoose.model<Order>('orders', OrderSchema);

export default orders;
