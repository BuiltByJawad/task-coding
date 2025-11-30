import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware";
import {
  getCart,
  addOrUpdateCartItem,
  removeCartItem,
} from "../controllers/cart.controller";
import { validateRequest } from "../middleware/validateRequest";
import { addOrUpdateCartSchema } from "../validators/cart.validator";

const router = Router();

router.use(requireAuth);

router.get("/", getCart);
router.post("/", validateRequest(addOrUpdateCartSchema), addOrUpdateCartItem);
router.delete("/:id", removeCartItem);

export default router;
