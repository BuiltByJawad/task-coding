import { Schema, model, Document, Types } from "mongoose";

export interface ICartItem {
  _id?: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  cart: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: true }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    cart: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
