require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");
const jwt = require("express-jwt")
const routes = require("./api/routes");
const authRoutes = require("./api/routes/auth.routes");
const db = require("./api/models");
const stripe = require("stripe")("sk_test_ROLTtG56J1fcJUZGNHLJFAtS");

const PORT = process.env.PORT || 3001;
const app = express();

const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

// HTML REQUEST LOGGER
app.use(morgan("dev"))

// BODY PARSER FOR AJAX REQEUESTS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// BODY PARSER FOR STRIPE
app.use(require("body-parser").text());


// ROUTING
app.use("/auth", authRoutes);
app.use("/api", auth, routes);


// STATIC ASSETS WHEN PUSHED TO HEROKU
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}


// SEND EVERY REQUEST TO REACT APP
app.get("*", function (req, res) {
  // res.sendFile(path.join(__dirname, "./client/public/index.html"));
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// FILE PATH FOR STRIPE
app.post("/charge", (req, res) => {
  stripe.charges.create({
    amount: 2000,
    currency: "usd",
    description: "An example charge",
    source: req.body
  }).then(resp => {
    res.json(resp)
  }).catch(err => {
    res.status(500).end();
  });
});

// CHANGE TO FORCE:FALSE BEFORE DEPLOYING
db.Sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, function () {
    console.log(`Listening to ${PORT}`);
  });
});
