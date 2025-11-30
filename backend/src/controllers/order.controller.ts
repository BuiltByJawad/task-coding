import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { User } from "../models/User";
import { Order } from "../models/Order";

export const placeOrder = async (
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

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = user.cart.map((item) => {
      const productDoc = item.product as any;
      const priceAtOrder = productDoc.price as number;
      return {
        product: productDoc._id,
        quantity: item.quantity,
        priceAtOrder,
      };
    });

    const totalPrice = items.reduce(
      (sum, item) => sum + item.priceAtOrder * item.quantity,
      0
    );

    const order = await Order.create({
      user: user._id,
      items,
      totalPrice,
    });

    user.cart = [];
    await user.save();

    return res.status(201).json(order);
  } catch (error) {
    return next(error);
  }
};

export const getUserOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await Order.find({ user: req.user.id }).populate(
      "items.product"
    );

    return res.json(orders);
  } catch (error) {
    return next(error);
  }
};
