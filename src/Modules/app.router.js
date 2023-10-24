import connectDB from "../../DB/connection.js";
import { globalErrorHandel } from "../Services/errorHandling.js";
import AuthRouter from "./Auth/Auth.router.js";
import UserRouter from "./User/User.router.js";
import ResturantRouter from "./Resturant/resturant.router.js";
import CategoryRouter from "./Category/Category.router.js";
import MealRouter from "./Meal/Meal.router.js";
import CartRouter from "./Cart/cart.router.js";
import OrderRouter from "./Order/order.router.js";
import cors from 'cors';

import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fullPath = path.join(__dirname, "../upload");

const initApp = (app, express) => {
  app.use(cors());
  connectDB();
  app.use(express.json());
  app.use("/upload", express.static(fullPath));
  app.use("/auth", AuthRouter);
  app.use("/user", UserRouter);
  app.use("/resturant", ResturantRouter);
  app.use("/category", CategoryRouter);
  app.use("/meal", MealRouter);
  app.use("/cart", CartRouter);
  app.use("/order", OrderRouter);
  app.use("/*", (req, res) => {
    return res.json({ messaga: "page not found" });
  });

  //global error handler
  app.use(globalErrorHandel);
};

export default initApp;
