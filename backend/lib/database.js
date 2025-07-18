import { DB_CONNECTION_STRING } from "./env.js";
import mongoose from "mongoose";

export const connectToDB = async () => {
  await mongoose.connect(DB_CONNECTION_STRING);

  console.log("Successfully connected to the database.");
};
