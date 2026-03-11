const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");

// Action	Route	HTTP Verb
// Index	‘/users/:userId/foods’	GET

router.get("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const message = req.session.message;
    req.session.message = null;
    res.locals.pantry = currentUser.pantry;
    res.render("foods/index.ejs");
  } catch (error) {
    console.log("Index error:", error);
    res.redirect("/");
  }
});

// New	‘/users/:userId/foods/new’	GET

router.get("/new", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    res.render("foods/new.ejs", { userId: req.params.userId });
  } catch (error) {
    res.redirect(`/`);
  }
});

// Create	‘/users/:userId/foods’	POST

router.post("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const newItem = req.body.name.trim().toLowerCase();
    const sameItem = currentUser.pantry.some((food) => {
      return food.name.trim().toLowerCase() === newItem;
    });
    if (sameItem) {
      req.session.message = "Item is already in Pantry!";
      return res.redirect(`/users/${req.session.user._id}/foods`);
    }

    req.session.message = null;
    currentUser.pantry.push(req.body);
    currentUser.markModified("pantry");

    await currentUser.save();
    res.redirect(`/users/${req.session.user._id}/foods`);
  } catch (error) {
    console.log("POST error", error);
    res.redirect("/");
  }
});

// Show	‘/users/:userId/foods/:itemId’	GET

router.get("/:itemId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const food = currentUser.pantry.id(req.params.itemId);
    res.render("foods/show.ejs", { food: food });
  } catch (error) {
    console.log("SHOW Error", error);
    res.redirect(`/user/${req.params.userId}/foods`);
  }
});

// Edit	‘/users/:userId/foods/:itemId/edit’	GET

router.get("/:itemId/edit", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const food = currentUser.pantry.id(req.params.itemId);
    res.render("foods/edit.ejs", { food });
  } catch (error) {
    res.redirect(`/`);
  }
});

// Update	‘/users/:userId/foods/:itemId’	PUT

router.put("/:itemId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const foodUpdate = currentUser.pantry.id(req.params.itemId);

    foodUpdate.set(req.body);
    await currentUser.save();
    res.redirect(`/users/${req.session.user._id}/foods`);
  } catch (error) {
    res.render("UPDATE error", error);
    res.redirect(`/`);
  }
});

// Delete	‘/users/:userId/foods/:itemId’	DELETE

router.delete("/:itemId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    currentUser.pantry.id(req.params.itemId).deleteOne();
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/foods`);
  } catch (error) {
    console.log("DELETE error", error);
    res.redirect(`/`);
  }
});

module.exports = router;
