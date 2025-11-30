import { Router } from "express";
import { seedProducts } from "../controllers/product.controller";

const router = Router();

router.post("/seed-products", seedProducts);

export default router;
