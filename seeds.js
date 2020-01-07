//lo scopo di un file seeds e seminare il database con il primo post
//lo scopo di questo file e` camncellare tutti i dati da database
const mongoose = require("mongoose"), //mongoose to add js to databases
	  Post = require("./models/post"); //sto importando mongoose.model("Campgroud", campgroundSchema);
	  

const data = [
		{
			title: "First Post",
			image: "https://images.unsplash.com/photo-1489533119213-66a5cd877091?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80",
			post: "This is the fist post of your journal journey"
		}
	];




const seedDB = () => {
		Post.deleteMany({}, (err) => {
	if(err){
		console.log(err);
	}
	console.log("removed posts!");
	//aggiungiamo dei camground trial i cui dati sono salvai in data
	//NB: la logica di aggiunta dei campground sta nella callback del remove aggiungo i camground dopo averli rimossi 
	//1 loop nel array data
	//2 element in questo caso e` uno degli oggetti nell`array data
	Post.create(data, (err, post) => { //2
		
		if(err) {
			
			console.log(err);
		
		} else {
			
			console.log("NEWLY CREATED Post: ");
					
		}
	
	 });
 });

}



//esportero` questo file in app.js
module.exports = seedDB;