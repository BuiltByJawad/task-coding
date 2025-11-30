import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware";
import { placeOrder, getUserOrders } from "../controllers/order.controller";

const router = Router();

router.use(requireAuth);

router.post("/", placeOrder);
router.get("/", getUserOrders);

export default router;
