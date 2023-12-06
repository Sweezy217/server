const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const UserModel = require("./models/user");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.REACT_APP_DATABASE);
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, response) => {
        if (response) {
          res.json({
            authenticated: true,
            user,
          });
        } else {
          res.json({
            authenticated: false,
          });
        }
      });
    } else {
      res.json({
        authenticated: false,
        mssg: "User Does not Exist",
      });
    }
  });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      UserModel.create({ name, email, password: hash })
        .then((user) => res.json(user))
        .catch((err) => res.json(err));
    })
    .catch((err) => console.log(err));
});

app.post("/updateUser", async (req, res) => {
  const { id, name } = req.body;
  try {
    await UserModel.updateOne(
      { _id: id },
      {
        $set: {
          name: name,
        },
      }
    );
    return res.json({ status: "ok", data: "updated" });
  } catch (error) {
    return res.json({ status: error, data: error });
  }
});

app.get("/getUsers", (req, res) => {
  UserModel.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => res.json(err));
});

app.listen(process.env.PORT, () => {
  console.log("server is running successfully");
});
