import http from "http";
import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";

const server = http.createServer(app);

const start = async () => {
  await connectDB();

  server.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
