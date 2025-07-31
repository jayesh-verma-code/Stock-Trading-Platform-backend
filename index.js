require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const {HoldingsModel} = require('./model/HoldingsModel');
const {PositionsModel} = require('./model/PositionsModel');
const {OrdersModel} = require('./model/OrdersModel');
const {UserModel} = require('./model/UserModel');

const port = process.env.PORT || 8080;
const uri = process.env.MONGO_URL;

// temparary data for holdings
// app.get("/getholding", async(req,res) => {
//   const holdingData = [
//   {
//     name: "WIPRO",
//     qty: 12,
//     avg: 530.00,
//     price: 545.50,
//     net: "+15.50",
//     day: "+2.92%",
//     isLoss: false
//   },
//   {
//     name: "TCS",
//     qty: 3,
//     avg: 3750.00,
//     price: 3690.00,
//     net: "-60.00",
//     day: "-1.60%",
//     isLoss: true
//   },
//   {
//     name: "RELIANCE",
//     qty: 8,
//     avg: 2450.00,
//     price: 2505.00,
//     net: "+55.00",
//     day: "+1.45%",
//     isLoss: false
//   },
//   {
//     name: "INFY",
//     qty: 6,
//     avg: 1450.75,
//     price: 1468.20,
//     net: "+17.45",
//     day: "+1.20%",
//     isLoss: false
//   },
//   {
//     name: "ITC",
//     qty: 10,
//     avg: 425.25,
//     price: 420.10,
//     net: "-5.15",
//     day: "-1.21%",
//     isLoss: true
//   },
//   {
//     name: "HDFCBANK",
//     qty: 4,
//     avg: 1580.00,
//     price: 1598.50,
//     net: "+18.50",
//     day: "+1.17%",
//     isLoss: false
//   },
//   {
//     name: "DMART",
//     qty: 2,
//     avg: 4000.00,
//     price: 3980.00,
//     net: "-20.00",
//     day: "-0.50%",
//     isLoss: true
//   },
//   {
//     name: "SBIN",
//     qty: 5,
//     avg: 720.00,
//     price: 710.00,
//     net: "-10.00",
//     day: "-1.39%",
//     isLoss: true
//   },
//   {
//     name: "ASIANPAINT",
//     qty: 3,
//     avg: 3200.00,
//     price: 3275.00,
//     net: "+75.00",
//     day: "+2.34%",
//     isLoss: false
//   },
//   {
//     name: "BHARTIARTL",
//     qty: 7,
//     avg: 538.05,
//     price: 543.75,
//     net: "+5.70",
//     day: "+1.06%",
//     isLoss: false
//   }
// ];

// holdingData.forEach((data) => {
//   let newHolding = new HoldingsModel({
//     name: data.name,
//     qty: data.qty,
//     avg: data.avg,
//     price: data.price,
//     net: data.net,
//     day: data.day,
//     isLoss: data.isLoss
//   });

//   newHolding.save();
// });

// res.send("done");

// })

// temparary data for positiona as well
// app.get("/addPositions", (req,res) => {
//   const positionsData = [
//     {
//     name: "HDFCBANK",
//     qty: 4,
//     avg: 1580.00,
//     price: 1598.50,
//     net: "+18.50",
//     day: "+1.17%",
//     isLoss: false
//   },
//   {
//     name: "DMART",
//     qty: 2,
//     avg: 4000.00,
//     price: 3980.00,
//     net: "-20.00",
//     day: "-0.50%",
//     isLoss: true
//   },
// ];

// positionsData.forEach((data) => {
//   const newPosition = new PositionsModel({
//     name: data.name,
//     qty: data.qty,
//     avg: data.avg,
//     price: data.price,
//     net: data.net,
//     day: data.day,
//     isLoss: data.isLoss
//   });

//   newPosition.save();
// });

// res.send("done");
// });

app.get("/allHoldings", async(req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async(req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.get("/getHolding/:id", async(req, res) => {
  let id = req.params.id;
  let holding = await HoldingsModel.findById(id);
  res.json(holding);
});

app.post("/buyOrder", async(req, res) => {
  let data = req.body;

  const timestamp = Date.now();
  const readableDate = new Date(timestamp);

  let newOrder = new OrdersModel({
    name: data.name,
    qty: data.qty,
    price: data.price,
    mode: data.mode,
    date: readableDate.toLocaleString()
  });
  newOrder.save()
   .then((res) => console.log(res))
   .catch((err) => console.log(`Error: ${err}`));

  res.send("new order is saved");
});

// for deleting all sample orders
// app.get("/deleteAllOrders", async(req, res) => {
//   await OrdersModel.deleteMany({})
//    .then((res) => console.log("done delete all"));

//    res.send("done");
// });

app.get("/allOrders", async(req,res) => {
  let allOrders = await OrdersModel.find({});
  res.json(allOrders);
});

// sample user
app.post("/signup", async(req, res) => {
  let {name, mobileNumber, password} = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let newUser = new UserModel({
          name,
          mobileNumber,
          password: hash
      });
      newUser.save()
      .then((res) => console.log(res));

      let token = jwt.sign({mobileNumber}, "secret567");
      res.cookie("token", token);
      res.send("signup done");
    });
  });
  
});

app.post("/login", async(req, res) => {
  let user = await UserModel.findOne({mobileNumber: req.body.mobileNumber});
  if(!user) return res.send("Bad credentials.");

  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if(result) {
      let token = jwt.sign({mobileNumber: req.body.mobileNumber}, "secret567");
      res.cookie("token", token);
      res.json({credentials: true});
    }
    else res.json({credentials: false});
  });
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.json({success: true});
});

app.get("/getUser/:mobileNumber", async (req, res) => {
  let userMobileNumber = req.params.mobileNumber;
  let user = await UserModel.findOne({ mobileNumber: userMobileNumber }); 
  res.json(user);
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  mongoose.connect(uri)
  .then(() => console.log('DB is connected'))
  .catch((err) => console.error('Eror in connecting to DB:', err));
});
