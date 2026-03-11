require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const morgan = require("morgan");
const methodOverride = require("method-override");
const authController = require("./controllers/auth");
const userController = require("./controllers/user");
const foodsController = require("./controllers/food");
const usersController = require("./controllers/users");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

require("./db/connection");
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs"); 

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  }),
);
app.use(passUserToView);

app.get("/", (req, res) => {
  res.render("index", {
    user: req.session.user,
  });
});

app.use("/auth", authController);

app.use("/users", usersController);

app.use(isSignedIn);
app.use("/user", userController);

app.use("/users/:userId/foods", foodsController);

app.listen(PORT, () => console.log(`The port is running on: ${PORT}`));
