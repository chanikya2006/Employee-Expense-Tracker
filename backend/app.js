const express = require("express");

const app = express(); //express app, act as a middleware

const bodyParser = require("body-parser"); //imnport body-parser


const employeeRoutes = require('./routes/employee');
const userRoutes=require('./routes/user');
const expenseRoutes=require('./routes/expense');
const employeeExpenseRoutes =require("./routes/employeeExpense");
const dashboardRoutes =require("./routes/dashboard");

const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://root:'+process.env.MONGO_ATLAS_PW+'@clusterkey.6xuabxc.mongodb.net/expenseTracker')
.then(()=>{
  console.log("Connected to database");
})
.catch(()=>{
  console.log("Not able to connect to database");
})


app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, authentication"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PATCH, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
app.use('/v1/api',expenseRoutes);
app.use('/v1/api/USER',userRoutes);
app.use('/v1/api/EMPLOYEE', employeeRoutes);
app.use("/v1/api/EMPLOYEE_EXPENSE",employeeExpenseRoutes);
app.use("/v1/api/DASHBOARD", dashboardRoutes);

module.exports = app;
