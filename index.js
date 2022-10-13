const express = require("express");
const mongoose = require("mongoose");
const User = require("./schemas/userSchema");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));
app.use(cors());

const port = 8000;

mongoose
  .connect("mongodb://localhost:27017/express_auth", {
    useNewUrlParser: true, //
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

//Get all users data from database using Get request method
app.get("/users", async (req, res) => {
  const users = await User.find();

  if (users) {
    res.status(200).json({
      status: true, //
      message: "All users have been retrieved successfully",
      data: users,
    });
  } else {
    //
    res.status(404).json({
      status: false, //
      message: "No users were retrieved",
    });
  }
});

//Register a new user with the schema reference
app.post("/add", async (req, res, next) => {
  // const data = req.body;

  try {
    const salt = await bcrypt.genSalt();

    const password = await bcrypt.hash(req.body.password, salt);

    const { name, date_of_birth, gender, phone, email } = req.body;

    const user = await User.create({
      name,
      date_of_birth,
      gender,
      phone,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        status: true, //
        message: "User created successfully",
        data: user,
      });
    } else {
      res.status(404).json({
        status: false, //
        message: "User was not created successfully",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

//Edit user info
app.patch("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const patch = req.body;

  const user = await User.updateOne(patch).where({
    _id: id,
  });

  if (user) {
    res.status(200).json({
      status: true, //
      message: "User info edited successfully",
      data: user,
    });
  } else {
    res.status(404).json({
      status: false, //
      message: "Something went wrong",
    });
  }
});

//Delete user info from the database
app.delete("/remove/:id", async (req, res) => {
  const data = await User.findByIdAndDelete(req.params.id);

  if (data) {
    res.status(200).json({
      status: true,
      message: "User has been deleted successfully",
      data: data,
    });
  } else {
    res.status(400).json({
      status: false,
      message: "Sorry Something went wrong",
    });
  }
});


//Login a user using email and password
app.post("/login", (req, res) => {
  //email and password
  const email = req.body.email;
  const password = req.body.password;

  //find user exist or not
  User.findOne({ email }).then((user) => {
    //if user not exist than return status 400
    if (!user) return res.status(400).json({ msg: "Email does not exist" });

    //if user exist than compare password
    //password comes from the user
    //user.password comes from the database
    bcrypt.compare(password, user.password, (err, data) => {
      //if error than throw error
      if (err) throw err;

      //if both match than you can do anything
      if (data) {
        return res.status(200).json({ message: "You are logged in successfully" });
      } else {
        return res.status(401).json({ message: "Invalid Password" });
      }
    });

  });

});

app.get("/", (req, res) => {
  res.redirect(__dirname + "/index.html");
});


app.listen(port, () => {
  console.log("listening on port " + port);
});
