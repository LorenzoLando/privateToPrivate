//package require
const express = require("express"),
	  app = express(),
	  viewEngine = require("view-engine"), 
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  passport = require("passport"),
	  LocalStrategy = require("passport-local"),
	  expressSanitizer = require("express-sanitizer"),
	  methodOverride = require("method-override"),
	  Post = require("./models/post"),
	  User = require("./models/user"),
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

//PASSPORT CONFIGURATION
//1 secret is used for securyty reasons to set the cookie
app.use(require("express-session")({
	secret: "Secret", //1
	resave: false,
	saveUninitialized: false
}));

//2 setting the auth method
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware req.user the user is  passed to all routes
//1 is p[assed to the rews of all routes]
//2 nex() let you execcuted the other code
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

//end of passport configuration


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
		   res.render("posts/index", {posts: posts});
		}
	});
});


//NEW
//it just render the form to insert the new  post
app.get("/posts/new", (req, res) => {
	res.render("posts/new");
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
				res.render("posts/new");
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
app.get("/posts/:id", (req, res) => {
	let parametri = req.params.id;
	Post.findById(parametri, (err, foundPost) => {
		if(err){
		   res.redirect("/posts");
		} else {
		   res.render("posts/show", {foundPost: foundPost});
		}
	});
});


//EDIT
//serve a modificare il record 
//get request della pagina edit
app.get("/posts/:id/edit", function(req, res){
	Post.findById(req.params.id, (err, foundPost) => {
		if(err) {
		  res.redirect("/posts");  
		} else {
			res.render("posts/edit", {post: foundPost});
			
		}
	});
});

//UPDATE  
//posso usare la put request grazie al methodOverride con il metodo find and update prendo i dati dalla request li aggiorno
//i dati sono presi dal form grazie all`attributo name req.body.blog
//se err re indirizzo all`index
//se sucess re indirzzo alla pagina show del blog in questione 

app.put("/posts/:id", (req, res) => {
	console.log(req.body.post.posi);
	req.body.post.post = req.sanitize(req.body.post.post);
 	Post.findByIdAndUpdate(req.params.id, req.body.post, (err, updatedPost) => {
		if(err){
		   	res.redirect("/posts");
		  } else {
		   	res.redirect("/posts/" + req.params.id);
		  }
	});
});

//DELETE
//route che riceve la request per cancellare un blog
//la request e` una post request dal bottone delete e viene mutata in delete da methodoverride
//
app.delete("/posts/:id", (req, res)=> {
  Post.findByIdAndRemove(req.params.id, (err) => {
	  if(err) {
		  res.redirect("/posts");
	  } else {
		  res.redirect("/posts");
	  }
  });
	
});



//===================================
// AUTH ROUTES
//Routing for user authentication
//===================================

//showing registration page
app.get("/register", (req, res) => {
	res.render("register");
});

//logica del sign in form
//1 creo un nuovo user inserendo nel database lo username inserito nel form
//2 creo una registrazione salvando nel database una password che viene criptata
//3 in caso di errore renderizzo la pagina di registrazione
//4 ti loggo e ti riporto su campground
app.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username}); //1
	console.log(newUser);
	User.register(newUser, req.body.password, (err, user) => { //2
		if(err) {
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, () => {
			res.redirect("/posts"); //4
		});
	});
});



//=======================
// LOGIN ROUTES
//questa e` la sezione che gestisce le routes il login dell`utente
//====================

//mostra pagina per il login
app.get("/login", (req, res) => {
	res.render("login");
});



//logica del sign in form
//1 l`autenticazione si fa tramite middleware il metodo autenticate deriva  da * 
//per middleware si intende una funzionalita` che si esegue prima della callback
//e la stessa funzione autenticate che si carica in register route
app.post("/login", passport.authenticate("local", // *
										 
			{
				successRedirect: "/posts",
				failureRedirect: "/login"
			
	}), (req, res) => {
	 
});


//=======================
//LOGOUT ROUTES
//questa e` la sezione che gestisce le routes il logout dell`utente
//====================


//gestisci la richiesta di logout
//1 .logout() e` una funzionalita` costruita dentro il pacchetto passport
//2 re-indirizzo su campground
app.get("/logout", (req, res) => {
	req.logout(); //1
	res.redirect("/posts"); //2
});


//definisco il middlware per quanto riguarda l`autenticazione
//la funzione verra` utilizzata come middleware 
//1 se sei autenticato con una funzionalita` offerta da passport
//2 eseguo la funzione successiva grazie a next()
//3 if non autenticato reindirizzo su /login
function isLoggedIn (req, res, next) {
	if(req.isAuthenticated()) { //1
	   		return next(); //2
	 }
	 res.redirect("/login"); //3
}



//listening for http request on the port
app.listen(3000, () => {
  console.log("privateToPrivate app server has started!!!!!");
});