const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const allUsers = await User.find({});
    console.log("Users found in DB:", allUsers);
    res.render("users/index.ejs", { users: allUsers });
  } catch (error) {
    console.log(`Error Loading Users`);
    res.redirect("/");
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.userId);
    res.render("users/show.ejs", {
      user: foundUser,
      pantry: foundUser.pantry,
    });
  } catch (error) {
    console.log("SHOW Error", error);
    res.redirect(`/users`);
  }
});

module.exports = router;
