//package require
const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  expressSanitizer = require("express-sanitizer"),
	  methodOverride = require("method-override"),
	  mongoose = require("mongoose");

//database connection via mongoose
mongoose.connect("mongodb://localhost:27017f/restful_privateToPrivate", {useNewUrlParser: true});
//using view engine to automatically add extensions
app.set("view engine", "ejs");
//allowing express to use a static files such css images excetera forma folder named public
app.use(express.static("public"));
//using body parser
app.use(bodyParser.urlencoded({ extended: true })); 
//methodOverride to change POST in PUT and DELETE request
app.use(methodOverride("_method"));
//express-sanitizer =  sanitizing maicious script in my imput
app.use(expressSanitizer());
//definig a schema for the properties record
const propertySchema = new mongoose.Schema({
	title: String,
	image: String,
	description: String,
	adress: String,
	price: String
});

//compiling the property schema into a model
const Property = mongoose.model("Property", propertySchema);

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

//BEGINNING OF RESTFUL ROUTING





//INDEX
//1-routing for the index page 
//2-finding all users records in the database

app.get("/properties", (req, res) => {
	User.find({}, (err, users) => { //2
		if(err){
		   console.log(err);
		} else {
		   res.render("index", {users: users});  //1
		}
	});
});


//NEW
//it just render the form to insert the new blog post
// app.get("/blogs/new", (req, res) => {
// 	res.render("new");
// });


//CREATE
//la post request per creare il nuovo blog post
//create blog
	//creo un nuovo record nel database
	//i dati neegli attributi name del form son    o passati in una struttura oggetto cosi possono essere passati direttamente al create
		//prima di salvare i dati nel database uso sanitize per eliminare script malevoli
// app.post("/blogs", (req, res) => {
// 	req.body.blog.body = req.sanitize(req.body.blog.body);
// 	Blog.create(req.body.blog, (err, newBlog) => {
// 		if (err) {
// 			  	console.log(err);
// 				res.render("new");
// 		  } else {
// 			 res.redirect("/blogs");
// 		  }

// 		});
// });

//SHOW
//vogliamo mostrare le specfiche per il blog selezionato
//arrivando dal link contenete l id
	//prendo il parametro id dallo url e lo passo al metodo findById
	//renderizzo la pagina relativa passando il blog trovato come variabile
// app.get("/blogs/:id", (req, res) => {
// 	let parametri = req.params.id;
// 	Blog.findById(parametri, (err, foundBlog) => {
// 		if(err){
// 		   res.redirect("/blogs");
// 		} else {
// 		   res.render("show", {foundBlog: foundBlog});
// 		}
// 	});
// });


//EDIT
//serve a modificare il record 
//get request della pagina edit
// app.get("/blogs/:id/edit", function(req, res){
// 	Blog.findById(req.params.id, (err, foundBlog) => {
// 		if(err) {
// 		  res.redirect("/blogs");  
// 		} else {
// 			res.render("edit", {blog: foundBlog});
			
// 		}
// 	});
// });

//UPDATE 
//posso usare la put request grazie al methodOverride con il metodo find and update prendo i dati dalla request li aggiorno
//i dati sono presi dal form grazie all`attributo name req.body.blog
//se err re indirizzo all`index
//se sucess re indirzzo alla pagina show del blog in questione 

// app.put("/blogs/:id", (req, res) => {
// 	req.body.blog.body = req.sanitize(req.body.blog.body);
// 	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
// 		if(err){
// 		   	res.redirect("/blogs");
// 		  } else {
// 		   	res.redirect("/blogs/" + req.params.id);
// 		  }
// 	});
// });

//DELETE
//route che riceve la request per cancellare un blog
//la request e` una post request dal bottone delete e viene mutata in delete da methodoverride
//
// app.delete("/blogs/:id", (req, res)=> {
//   Blog.findByIdAndRemove(req.params.id, (err) => {
// 	  if(err) {
// 		  res.redirect("/blogs");
// 	  } else {
// 		  res.redirect("/blogs");
// 	  }
//   });
	
// });



//listening for http request on the port
app.listen(3000, () => {
  console.log("privateToPrivate app server has started!!!!!");
});

