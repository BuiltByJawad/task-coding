import { Request, Response, NextFunction } from "express";
import { Product } from "../models/Product";
import { initialProducts } from "../data/products";

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (error) {
    return next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    return next(error);
  }
};

export const seedProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Product.deleteMany({});
    await Product.insertMany(initialProducts);

    return res.status(201).json({ message: "Products seeded" });
  } catch (error) {
    return next(error);
  }
};
