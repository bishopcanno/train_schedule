// database initialization and setup
var config = {
    apiKey: "AIzaSyBr3rq3hytpOQhA2dK_txJ5AKYD2RQaRYU",
    authDomain: "fir-alpha-omega.firebaseapp.com",
    databaseURL: "https://fir-alpha-omega.firebaseio.com",
    projectId: "fir-alpha-omega",
    storageBucket: "fir-alpha-omega.appspot.com",
    messagingSenderId: "192089995703"
  };
firebase.initializeApp(config);
var database = firebase.database();
// will be used by timeCheck to push a true or false and will be later used by minCalculator to run and if else if
var arrivalBeforePresentTime = "";
// initializes the current time and formats one into military
var now = moment();
var nowMilitary = moment().format("HH:mm")
// these variables will be changed based on the if else if run in minCalculator and then passed into tableDisplay
var minAway = "";
var arrivalTime = "";
// gives parallax functionality
$(document).ready(function(){
    $('.parallax').parallax();
});
// function that uses an if else if to pass back true or false to the arrivalBeforePresentTime var
function timeCheck(Z, Y){      
    if (Z > Y){
        arrivalBeforePresentTime = true;
    } else if (Z <= Y){
        arrivalBeforePresentTime = false;
    };
};
// function for all the calculation and necassary var manipulation that will be based into tableDisplay function
function minuteCalculator(A){
    // will recieve the database object as an argument and creates a new variable... for cleanliness i could change all instances of that variable to A
    var trainObjectMinute = A;
    // converts the arrival variable from the object into military time set one year ago and pulls the frequency variale out of the object and converts it to a variable
    var newDateConverted = moment(trainObjectMinute.val().arrival, "HH:mm").subtract(1, "years");
    var trainFreq = trainObjectMinute.val().frequency;
    // finds the difference in time between the current time and the newDateConverted variable/ formats that into military time for functionality
    var diffTime = moment().diff(moment(newDateConverted), "minutes");
    var diffTimeFormated = moment(diffTime ).format('HH:mm');
    // finds the remainder of the difference between difftime and trainfreq and then subtracts that number from trainFreq after initializing a var
    var tRemainder = diffTime % trainFreq;
    var tMinutesTillTrain = trainFreq - tRemainder;
    // if tRemainder is zero then the min till next train will display boarding on the table
    if (tRemainder === 0) {
        tMinutesTillTrain = "BOARDING";
    }
    // uses if else if to determine if what to set arrivalTime and minAway variables to
    if(arrivalBeforePresentTime){
        arrivalTime = moment(trainObjectMinute.val().arrival).format("HH:mm");
        minAway = diffTimeFormated;
    } else if (!arrivalBeforePresentTime){
        arrivalTime = moment().add(tMinutesTillTrain, 'minutes').format('HH:mm')
        minAway = tMinutesTillTrain;
    };
    // calls the tableDisplay object and pass it the database object that minCalculator recieved 
    tableDislpy(trainObjectMinute);   
};
// function that will dynamically change the display table on the html page with what the user imputs
function tableDislpy(B){
    // will recieve the database object as an argument and creates a new variable... for cleanliness i could change all instances of that variable to B
    var trainObjectDisplay = B;
    // creates a new table row element
    var newLine = $("<tr>");
    // these variables will be displayed by creating new table colomn elements and then displaying text of the variables they are fed
    var displayName = $("<td>").text(trainObjectDisplay.val().name);
    var displayDestination = $("<td>").text(trainObjectDisplay.val().destination);
    var displayFreq = $("<td>").text(trainObjectDisplay.val().frequency);
    // these next two are manipulated by minCalculator based on if arrivalBeforePresentTime is true or false
    var displayArrival = $("<td>").text(arrivalTime);
    var displayMinAway = $("<td>").text(minAway);
    // displays the full time and date
    var displayUTC =$("<td>").text(now);
    // appends the above variables to the newLine variable
    newLine.append(displayName);
    newLine.append(displayDestination);
    newLine.append(displayFreq);
    newLine.append(displayArrival);
    newLine.append(displayMinAway)
    newLine.append(displayUTC);
    // jquery hooks into the trainInfoDisplay which is the table body then appends variable newLine
    $("#trainInfoDisplay").append(newLine)
};
// listens for the click on the add button and then gathers the users inputs and passes them to the database
$("#add").on("click", function() {
    event.preventDefault();
    // grabs the user inputs from the form 
    var name = $("#nameForm").val().trim()
    var destination = $("#destForm").val().trim()
    var arrival = $("#timeForm").val().trim()
    var frequency = $("#freqForm").val().trim()
    // resets the form values to blank 
    $("#nameForm").val("");
    $("#destForm").val("");
    $("#timeForm").val("");
    $("#freqForm").val("");
    // pushes the user's inputs to the database
    database.ref().push({
        name: name,
        destination: destination,
        arrival: arrival,
        frequency: frequency,
    });   
});
// whenever something is added to the database this runs
database.ref().on("child_added", function(trainDataBaseObject){
    // calls the timeCheck function and passes the arrival variable from the database object and the nowMilitary variable as arguments
    timeCheck(trainDataBaseObject.val().arrival, nowMilitary);
    // calls the minuteCalculator and passes the data base object as an argument
    minuteCalculator(trainDataBaseObject);
});