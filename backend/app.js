import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT } from "./lib/env.js";
import authRouter from "./routes/auth.routes.js";
import { connectToDB } from "./lib/database.js";
import medicationRouter from "./routes/medication.routes.js";

const app = express();

// built in and third party middleware;
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/medications", medicationRouter);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  await connectToDB();
});
