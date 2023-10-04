const express = require("express");
const cors = require('cors');
const sequelize = require('./config/database');
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();

// Model imports
const User = require('./src/User/models/userModel');
const Patient = require('./src/Patient/models/patientModel');
const Surgeon = require('./src/Surgeon/models/surgeonModel');
const Surgery = require('./src/Surgery/models/surgeryModel');
// const Bodypart = require('./src/Bodypart/models/bodypartModel')
// const Exam = require('./src/Exam/models/examModel')


//sequelize.sync({force:true}).then(()=> console.log("db is ready"));
sequelize.sync().then(()=> console.log("db is ready"));

const app = express();

const port = process.env.PORT || 5001;
const host = process.env.HOST || '127.0.0.1';

//Middleware
app.use(cors());
app.use(express.json());
app.use(errorHandler);
app.use("/users", require("./src/User/routes/userRoutes"));
app.use('/patients',require("./src/Patient/routes/patientRoutes"));
app.use('/surgeon',require("./src/Surgeon/models/surgeonModel"));
app.use('/surgery', require("./src/Surgery/routes/surgeryRoutes"));

app.listen(port, host, ()=>{
  console.log(`server is running on ${host}:${port}`)
});
