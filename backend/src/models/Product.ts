import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  price: number;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", productSchema);
