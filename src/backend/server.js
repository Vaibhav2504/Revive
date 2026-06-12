import hospitalRoutes from "./routes/hospitalRoutes.js";
import express from "express";
const app = express();

app.use(express.json());

app.use("/api/hospitals", hospitalRoutes);