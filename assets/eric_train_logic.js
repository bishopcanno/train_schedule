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
 
 // initializes the current time and formats one into military
 var now = moment();
 var nowMilitary = moment().format("HH:mm");
 
 // gives parallax functionality
 $(document).ready(function(){
    $('.parallax').parallax();
 });
 
 // function that will dynamically change the display table on the html page with what the user imputs
 function tableDislpy(B){
 
    // will recieve the database object as an argument and creates a new variable... for cleanliness i could change all instances of that variable to B
    var trainObjectDisplay = B;
 
    // stuff for getting next train time and minutes until next train
    var newDateConverted = moment(B.val().arrival, "HH:mm").subtract(1, "years");
    var trainFreq = B.val().frequency;
 
    // Difference between the times
    var diffTime = moment().diff(moment(newDateConverted), "minutes");
 
    // Time apart (remainder)
    var tRemainder = diffTime % trainFreq;
 
    // Minute Until Train
    if (tRemainder != 0) {
        var tMinutesTillTrain = trainFreq - tRemainder;
    } else if (tRemainder === 0) {
        var tMinutesTillTrain = "BOARDING";
    }
 
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
 
    // creates a new table row element
    var newLine = $("<tr>");
 
    // these variables will be displayed by creating new table colomn elements and then displaying text of the variables they are fed
    var displayName = $("<td>").text(trainObjectDisplay.val().name);
    var displayDestination = $("<td>").text(trainObjectDisplay.val().destination);
    var displayFreq = $("<td>").text(trainObjectDisplay.val().frequency);
 
    // these next two are manipulated by minCalculator based on if arrivalBeforePresentTime is true or false
    var displayArrival = $("<td>").text(nextTrain);
    var displayMinAway = $("<td>").text(tMinutesTillTrain);
 
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
    var name = $("#nameForm").val().trim();
    var destination = $("#destForm").val().trim();
    var arrival = $("#timeForm").val().trim();
    var frequency = $("#freqForm").val().trim();
 
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
 
    // calls the minuteCalculator and passes the data base object as an argument
    tableDislpy(trainDataBaseObject);
 
 });