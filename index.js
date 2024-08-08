const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MangoDB_username;
const password = process.env.MangoDB_password;

mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.uij59.mongodb.net/registrationdb`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const registrationschema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const Registration = mongoose.model("Registration", registrationschema);

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await Registration.findOne({ email: email });

    if (!existingUser) {
      const RegistrationData = new Registration({
        name,
        email,
        password,
      });
      await RegistrationData.save();
      res.redirect("/success");
    } else {
      console.log("user already exit");
      res.redirect("/error");
    }
  } catch (error) {
    console.log(error);
    res.redirect("error");
  }
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/pages/sucessfull.html");
});
app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/pages/error.html");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
