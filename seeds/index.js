const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelpcamp")
  .then(() => {
    console.log("Connection Open...");
  })
  .catch((err) => {
    console.log("Ohhhh noooo errorrrr");
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  try {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
      const rand = Math.floor(Math.random() * 1000);
      const price = Math.floor(Math.random() * 30) + 10;
      const camp = new Campground({
        location: `${cities[rand].city}, ${cities[rand].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        image: `https://picsum.photos/400?random=${Math.random()}`,
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor sed, ipsam consectetur et praesentium quis libero voluptatibus? Maiores saepe delectus nobis ipsa repudiandae sequi aspernatur.`,
        price,
      });
      await camp.save();
    }
    console.log("Records added successfully");
  } catch (err) {
    console.log("Error in inserting records: ");
    console.log(err);
  }
};

seedDB();
