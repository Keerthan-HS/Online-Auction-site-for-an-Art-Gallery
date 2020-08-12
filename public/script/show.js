const socket = io();

const form = document.getElementById('myForm');
const myTable = document.getElementById('myTable');

//when the page loads, find the last entry
let maxAmt = findLastAmt();

//check the timer
timer();

//to get id from url
const url = window.location.pathname.split('/');
const id = url[2];

socket.on('Welcome', (obj) => {
    console.log(obj.msg);
});

//this variable stores the id of the product
// let myId;
//(we could just use <%= dta._id%> to get the id, but i couldn't do (<<<no patience xD), try it yourself if you have time)
//this is emitted from the server ( here we obtain the process id)

//add event listener to the form
//this is executed when the form is submitted
form.addEventListener(
    'submit',
    (e) => {
        //used to prevent the normal behaviour of the form (basically to no refresh the page :p)
        e.preventDefault();

        //get the entered values (ie name and the amount). Store it in some variable
        //const name = e.target.elements.name.value;
        const amt = e.target.elements.amt.value;

        if (amt <= maxAmt) {
            alert('Invalid Bid');
            return;
        }

        //else do this
        socket.emit('newAmt', amt);

        //to make a request from sockect.io we have to specify the header ( don't worry about it, I too didn't git it lol)
        const headers = {
            'Content-Type': 'application/json',
        };

        //this is the data we going to send
        //this is a new syntax to create a object automatically key will be give the name ({name: name, amt:amt}  like this...)
        const data = {
            amt,
        };
        //post request to insert into the database (dont worry about the syntaxxxx)
        fetch('/auction/' + id + '/bid', {
                method: 'Post',
                body: JSON.stringify(data),
                headers,
            })
            .then((response) => response.json())
            .then((result) => {
                console.log(result.name);
                socket.emit('addData', { name: result.name, amt: data.amt });
            });
    }

    //this is to add the new data to the table( I used table for my convenience , you may change to whatever you like(ul,div etc..))
);

socket.on('addData', (data) => {
    addData(data);
});

socket.on('newAmt', (amt) => {
    updateAmt(amt);
});

//add newly entered bid to the page
function addData({ name, amt }) {
    // Create an empty <tr> element ; -1= end of the table
    var row = myTable.insertRow(-1);

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    // Add the name and amt to the new cells:
    cell1.innerHTML = name;
    cell2.innerHTML = amt;
}

function findLastAmt() {
    // if (myTable.rows.length === 1)
    //     return parseInt(document.getElementById('#base').value);
    const lastRow = myTable.rows.length - 1;

    const maxAmt = myTable.rows[lastRow].cells[1].innerHTML;
    return parseInt(maxAmt);
}
console.log(myTable.rows.length);
//get the winner div
const winnerDiv = document.getElementById('showWinner');

function timer() {
    //for the timer
    var countDownDate = new Date('Jun 18, 2020 15:55:25').getTime();

    // Update the count down every 1 second
    var x = setInterval(function() {
        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('demodata').innerHTML =
            days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);

            //add the winner name to winner div
            const winner = myTable.rows[myTable.rows.length - 1].cells[0].innerHTML;
            winnerDiv.innerHTML = '<h1>Winner :' + winner + '</h1>';

            form.parentNode.removeChild(form);
            return;
        }
    }, 1000);
}

function updateAmt(newAmt) {
    maxAmt = newAmt;
}