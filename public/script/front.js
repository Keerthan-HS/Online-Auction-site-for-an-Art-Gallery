//Function expression to select element
var selectElement = (s) => document.querySelector(s);

//Opent the menu on click
selectElement( '.open').addEventListener('click',()=>{
    selectElement('.nav-list').classList.add('active');
});

//Close the menu on click
selectElement('.close').addEventListener('click',()=>{
    selectElement('.nav-list').classList.remove('active');
});