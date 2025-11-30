import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import devRoutes from "./routes/dev.routes";
import { notFound, errorHandler } from "./middleware/errorHandler";

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

if (process.env.NODE_ENV !== "production") {
  app.use("/dev", devRoutes);
}

app.use(notFound);
app.use(errorHandler);

export default app;
