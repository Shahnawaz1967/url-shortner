import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import authRoutes from "./routes/authRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const __dirname = dirname(fileURLToPath(import.meta.url));

const swaggerDocument = YAML.load(join(__dirname, "./swagger.yaml"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", authRoutes);
app.use("/api/shorten", urlRoutes);
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
});
