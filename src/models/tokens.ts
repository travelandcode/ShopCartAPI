import mongoose from "mongoose";
import { Token } from "./d";
// Define schema
const Schema = mongoose.Schema;

const   TokenSchema = new Schema<Token>({
    userId: String,
    token: String,
    createdAt: String,
    expiresAt: String

},{collection: 'tokens'});

// Compile model from schema
const tokens = mongoose.model<Token>('tokens',   TokenSchema);

export default tokens;
