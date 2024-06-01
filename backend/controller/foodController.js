import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";

// Add food item
const addFood = async (req, res) => {
  const image_filename = req.file.filename;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding food" });
  }
};

// All food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error retrieving food list" });
  }
};

// Remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });
    }

    if (food.image) {
      fs.unlink(path.join("uploads", food.image), (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing food" });
  }
};

// Update food item
const updateFood = async (req, res) => {
  try {
    const { id, name, price, description, category } = req.body;

    // Retrieve the current food data
    const food = await foodModel.findById(id);
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });
    }

    // Prepare the updated data
    let updateData = {
      name: name || food.name,
      price: price || food.price,
      description: description || food.description,
      category: category || food.category,
    };

    // Handle file upload
    if (req.file) {
      // Delete the old image file
      if (food.image) {
        fs.unlink(path.join("uploads", food.image), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
      // Set the new image filename
      updateData.image = req.file.filename;
    }

    // Update the food item in the database
    const updatedFood = await foodModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedFood) {
      return res
        .status(404)
        .json({ success: false, message: "Food not found or not updated" });
    }

    res.json({ success: true, message: "Food Updated", data: updatedFood });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error updating food" });
  }
};

export { addFood, listFood, removeFood, updateFood };
