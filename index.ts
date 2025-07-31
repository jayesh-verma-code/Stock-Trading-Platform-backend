import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

// Import your Mongoose Models (assume they're written in TypeScript)
import { HoldingsModel } from "./model/HoldingsModel";
import { PositionsModel } from "./model/PositionsModel";
import { OrdersModel } from "./model/OrdersModel";
import { UserModel } from "./model/UserModel"; // assuming IUser interface for User

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 8080;
const uri = process.env.MONGO_URL || "";

// ----------------------------
// GET all holdings
app.get("/allHoldings", async (req: Request, res: Response) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET all positions
app.get("/allPositions", async (req: Request, res: Response) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET a single holding by ID
app.get("/getHolding/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const holding = await HoldingsModel.findById(id);
    res.json(holding);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// BUY order
interface IOrderBody {
  name: string;
  qty: number;
  price: number;
  mode: string;
}

app.post("/buyOrder", async (req: Request<{}, {}, IOrderBody>, res: Response) => {
  try {
    const data = req.body;
    const timestamp = Date.now();
    const readableDate = new Date(timestamp);

    const newOrder = new OrdersModel({
      name: data.name,
      qty: data.qty,
      price: data.price,
      mode: data.mode,
      date: readableDate.toLocaleString(),
    });

    await newOrder.save();
    res.send("new order is saved");
  } catch (err) {
    res.status(500).json({ error: "Could not save order." });
  }
});

// GET all orders
app.get("/allOrders", async (req: Request, res: Response) => {
  try {
    const allOrders = await OrdersModel.find({});
    res.json(allOrders);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// SIGNUP
interface ISignupBody {
  name: string;
  mobileNumber: string;
  password: string;
}

app.post("/signup", async (req: Request<{}, {}, ISignupBody>, res: Response) => {
  try {
    const { name, mobileNumber, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      name,
      mobileNumber,
      password: hash,
    });
    await newUser.save();

    const token = jwt.sign({ mobileNumber }, "secret567");
    res.cookie("token", token);
    res.send("signup done");
  } catch (err) {
    res.status(500).json({ error: "Signup failed." });
  }
});

// LOGIN
interface ILoginBody {
  mobileNumber: string;
  password: string;
}

app.post("/login", async (req: Request<{}, {}, ILoginBody>, res: Response) => {
  try {
    const user = await UserModel.findOne({ mobileNumber: req.body.mobileNumber });
    if (!user) return res.send("Bad credentials.");

    const result = await bcrypt.compare(req.body.password, user.password);
    if (result) {
      const token = jwt.sign({ mobileNumber: req.body.mobileNumber }, "secret567");
      res.cookie("token", token);
      res.json({ credentials: true });
    } else res.json({ credentials: false });
  } catch (err) {
    res.status(500).json({ error: "Login failed." });
  }
});

// LOGOUT
app.get("/logout", (req: Request, res: Response) => {
  res.cookie("token", "");
  res.json({ success: true });
});

// Get user by mobile number
app.get("/getUser/:mobileNumber", async (req: Request, res: Response) => {
  try {
    const userMobileNumber = req.params.mobileNumber;
    const user = await UserModel.findOne({ mobileNumber: userMobileNumber });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// =============================
// Server listen
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  mongoose
    .connect(uri)
    .then(() => console.log("DB is connected"))
    .catch((err) => console.error("Error in connecting to DB:", err));
});
