var config = {
    apiKey: "AIzaSyBr3rq3hytpOQhA2dK_txJ5AKYD2RQaRYU",
    authDomain: "fir-alpha-omega.firebaseapp.com",
    databaseURL: "https://fir-alpha-omega.firebaseio.com",
    projectId: "fir-alpha-omega",
    storageBucket: "fir-alpha-omega.appspot.com",
    messagingSenderId: "192089995703"
  };
 
  // Get a reference to the database service
  firebase.initializeApp(config);
  // Create a variable to reference the database
  var database = firebase.database();
 
 //on click function to generate new line in table
$("#add").on("click", function() {
    event.preventDefault();

    var name = $("#nameForm").val().trim()
    var destination = $("#destForm").val().trim()
    var arrival = $("#timeForm").val().trim()
    var frequency = $("#freqForm").val().trim()

    timeCalculation(arrival, frequency);

    // var arrival = moment.unix(startDate).format("MM/DD/YYYY")

    // var empMonths = moment().diff(moment(startDate, "X"), "months");


    database.ref().push({
        name: name,
        destination: destination,
        arrival: arrival,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});
// ___________________________________________________________________________________________________________________________________________
 //listening event when data changes in database. undates html
 database.ref().on("child_added", function(childSnapshot){
    
    console.log(childSnapshot.val().name)
    console.log(childSnapshot.val().destination)
    console.log(childSnapshot.val().arrival)
    console.log(childSnapshot.val().frequency)
 
    // console.log(moment(childSnapshot.val().startDate).diff(moment(), "months"));
 
    // var months = moment(childSnapshot.val().startDate).diff(moment(), "months") * -1
 
    // var total = months * childSnapshot.val().monthlyRate
 
    var newLine = $("<tr>")
    
 
    var newName = $("<td>").text(childSnapshot.val().name);
    var newDestination = $("<td>").text(childSnapshot.val().destination);
    var newFreq = $("<td>").text(childSnapshot.val().frequency);
    var newArrival = $("<td>").text("placeholder");
    var minAway = $("<td>").text("placeholder")
   
 
    newLine.append(newName)
    newLine.append(newDestination)
    newLine.append(newFreq)
    newLine.append(newArrival)
    newLine.append(minAway)
    
 
    $("#trainInfoDisplay").append(newLine)
 
    $("#nameForm").val("");
    $("#destForm").val("");
    $("#timeForm").val("");
    $("#freqForm").val("");
 });

 function timeCalculation(x , y){
     

 };

