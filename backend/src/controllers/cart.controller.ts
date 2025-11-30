import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { User } from "../models/User";
import { Product } from "../models/Product";
import { AddOrUpdateCartBody } from "../validators/cart.validator";

export const getCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id).populate("cart.product");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ cart: user.cart });
  } catch (error) {
    return next(error);
  }
};

export const addOrUpdateCartItem = async (
  req: AuthRequest & { body: AddOrUpdateCartBody },
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingIndex >= 0) {
      user.cart[existingIndex].quantity = quantity;
    } else {
      user.cart.push({ product: product._id, quantity });
    }

    await user.save();

    return res.status(200).json({ cart: user.cart });
  } catch (error) {
    return next(error);
  }
};

export const removeCartItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const initialLength = user.cart.length;
    user.cart = user.cart.filter((item) => item._id?.toString() !== id);

    if (user.cart.length === initialLength) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await user.save();

    return res.status(200).json({ cart: user.cart });
  } catch (error) {
    return next(error);
  }
};
