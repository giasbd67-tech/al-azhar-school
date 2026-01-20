import express from "express";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());

registerRoutes(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
