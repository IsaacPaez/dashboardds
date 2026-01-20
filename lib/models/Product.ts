import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  media: string[];
  price: number;
  duration: number;
  tag?: string;
  type: "Book" | "Buy" | "Contact";
  buttonLabel: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema: Schema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  media: { type: [String], default: [] },
  price: { type: Number, required: true, min: 0.1 },
  duration: { type: Number, required: true, min: 1, validate: { validator: Number.isInteger, message: 'Duration must be a whole number' } },
  tag: { type: String, default: "", trim: true, maxlength: 50 },
  type: { type: String, enum: ["Book", "Buy", "Contact"], required: true },
  buttonLabel: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
