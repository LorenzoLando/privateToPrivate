//QUI  LO SCHEMA PER IL RECORD NEL DATABASE del post
const mongoose = require("mongoose");


//definig a schema for the post record
const postSchema = new mongoose.Schema({
	title: String,
	image: String,
	post : String
});

//compiling the property schema into a model
module.exports = mongoose.model("Post", postSchema);







