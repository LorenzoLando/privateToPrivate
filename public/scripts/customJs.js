//changing the displayed search form
//1- selecting all search forms buttons
//2- selecting all search forms
//3- when a user click on a button
	//3.1- remove active class form all forms
		//3.2- adding class active on the related form
const formButtons = document.querySelectorAll(".form-button"); //1
const forms = document.querySelectorAll(".formContainer form"); //2
formButtons.forEach((formButton, index) => {
    formButton.addEventListener('click', () => { //3
        forms.forEach((form) => {
            form.classList.remove("active"); //3.1
        });
        forms[index].classList.add("active");  //3.2    

    });
});