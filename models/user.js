//This is the schema for user authentication
//1 require passport-local-mongoose to use it as a plugin on the usershcema
const mongoose = require("mongoose"),
	  passportLocalMongoose = require("passport-local-mongoose"); //1

//defining the schema for the users record
const userSchema = new mongoose.Schema({
	username: String,
	password: String
	//email: String,
	//properties: [propertySchema]
});


//using  passportLocalMongoose as plugin having passport functionality in the model
userSchema.plugin(passportLocalMongoose);
//to use a the schema i have to compile it into a model and export it
module.exports = mongoose.model("User", userSchema);




