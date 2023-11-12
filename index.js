const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Userrouter = require("./Routes/userroutes");
const Blogrouter = require("./Routes/blogroutes");
const Adminrouter = require("./Routes/adminroutes");
require("dotenv").config()

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
//app.use(cors());
app.use(cors({
    origin:'*'
}))

app.use("/user" ,  Userrouter)
app.use("/blog" , Blogrouter)
app.use("/admin" , Adminrouter)

// Connect to your MongoDB database
mongoose.connect(process.env.mongodbString).then(()=>{
    console.log("Connected to db");
}).catch(err=>{
    console.log(err)
});

// Starting server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
