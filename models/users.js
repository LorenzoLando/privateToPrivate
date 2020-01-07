//QUI  LO SCHEMA PER IL RECORD NEL DATABASE DEGLI UTENTI
const mongoose = mongoose = require("mongoose");

//defining the schema for the users record
const userSchema = new mongoose.Schema({
	name: String,
	surname: String,
	email: String,
	properties: [propertySchema]
});

//to use a the schema i have to compile it into a model
const User = mongoose.model("User", userSchema);



//Creating a new user record
//with a property association


// User.create({ 
// 	name: "Test",
// 	surname: "Test",
// 	email: "ciao@google.it",
// 	properties: [
// 		{
// 			title: "test",
// 			image: "https://images.unsplash.com/photo-1568905429146-cf7656892b5a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=552&q=80",
// 			description: "test description",
// 			adress: "test adress",
// 			price: "test price"
// 		}
// 	]
	
// }, (err, blog) => {
//   if (err) {
// 	  console.log(err);
//   } else {
// 	  console.log(blog);
//   }
  
// });

