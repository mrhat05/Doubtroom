import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { createRequire } from "module";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const require = createRequire(import.meta.url);
const serviceAccount = require("./doubt-room-6679c-firebase-adminsdk-fbsvc-04328facac.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

// Configure CORS with specific options
const corsOptions = {
  origin: ['https://doubtroom.vercel.app', "http://localhost:3001"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
