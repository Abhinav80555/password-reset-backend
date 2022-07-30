require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const shortRoutes = require("./routes/short");
const authRoutes = require("./routes/auth");
const passwordResetRoutes = require("./routes/passwordReset");

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

//common call
app.get("/",(req,res)=>{
    res.status(200).send("Server is running Successfully")
});


// routes
app.use("/api/users", userRoutes);
app.use("/s", shortRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passwordResetRoutes);

const port = process.env.PORT || 8055;
app.listen(port, console.log(`Listening on port ${port}...`));
