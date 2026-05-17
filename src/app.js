import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

//user routes
import userRoutes from "./routes/user-auth-routes.js";
import userProfileRoutes from "./routes/user-profile-routes.js";
import matchingRoutes from "./routes/matching-routes.js";
import chatRoutes from "./routes/chat-routes.js";

//middlewares
import { errorHandler } from "./middlewares/error.middleware.js";
import { swaggerUiServe, swaggerUiSetup } from "./swagger/swagger.js";

//config
import { env } from "./config/env.js";

dotenv.config();

const app = express();

app.use(helmet()); // 🔒 security headers

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(compression());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Swagger docs
app.use("/api-docs", swaggerUiServe, swaggerUiSetup);

// =======================
// ROUTES
// =======================

app.use("/api/users/auth", userRoutes);
app.use("/api/users/profile", userProfileRoutes);

app.use("/api/users/matches", matchingRoutes);


app.use("/api/users/chat", chatRoutes);


// =======================
// HEALTH CHECK
// =======================

app.get("/", (req, res) => {
  res.json({
    message: "Dating App Backend Running 🚀",
  });
});

// =======================
// 404
// =======================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});
// GLOBAL ERROR HANDLER
app.use(errorHandler);

export default app;
