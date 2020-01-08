//package require
const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  expressSanitizer = require("express-sanitizer"),
	  methodOverride = require("method-override"),
	  mongoose = require("mongoose"),
	  Post = require("./models/post"),
	  seedDB = 	require("./seeds");


//database connection via mongoose
mongoose.connect("mongodb://localhost:27017f/privateToPrivate", {useNewUrlParser: true});
//using view engine to automatically add extensions
app.set("view engine", "ejs");
//allowing express to use a static files such css images excetera forma folder named public
app.use(express.static(__dirname + "/public"));
//setto l`utilizzo di body parser
app.use(bodyParser.urlencoded({ extended: true })); 
//methodOverride serve a tramutare POST in PUT request 
//questo permette di utilizzare restful route anche se gli html form non supportano PUT
//l`argomento serve a far capire al metodo dove aspettarsi la query per cambiare il metodo
app.use(methodOverride("_method"));
//express-sanitizer permette di evitare che vengano forniti imput alla app con script malicious
app.use(expressSanitizer());


seedDB();





// when the request is done to "/"
//rendering of the landing page
app.get("/", (req,res) => {
	res.render("landing");
});


//INDEX
//routing for the index page the find method is called on the model to retrive the collection 
//send the data as variable to the index page the rander all elements
app.get("/posts", (req, res) => {
	Post.find({}, (err, posts) => {
		if(err){
		   console.log(err);
		} else {
		   res.render("index", {posts: posts});
		}
	});
});


//NEW
//it just render the form to insert the new  post
app.get("/posts/new", (req, res) => {
	res.render("new");
});


//CREATE
//post request to create a new post
//create post
	//1 saving the new record in the datbase
	//1.1 I dati negli attributi name del form sono passati in una struttura oggetto cosi possono essere passati direttamente al create
		//2 rima di salvare i dati nel database uso sanitize per eliminare script malevoli
app.post("/posts", (req, res) => {
	req.body.post.post = req.sanitize(req.body.post.post); //2
	Post.create(req.body.post, (err, newPost) => { //1 //1.1
		if (err) {
			  	console.log(err);
				res.render("new");
		  } else {
			  
			 res.redirect("/posts");
		  }

	});
});

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