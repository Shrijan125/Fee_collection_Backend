import express from "express";
import cors from "cors";
import apiV1Router from "./routes/route.js";
const app = express();
import { ApiError } from "./utils/ApiError.js";

const errHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json({ message: err.message, errors: err.errors });
  }
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
};

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use("/api/v1", apiV1Router);
app.use(errHandler);

export default app;
