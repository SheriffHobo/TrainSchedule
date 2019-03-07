var config = {
    apiKey: "AIzaSyARoZlhBsxEOy5FG73z7V25UH4R3tpfr6I",
    authDomain: "trainschedulehomework-ddf3b.firebaseapp.com",
    databaseURL: "https://trainschedulehomework-ddf3b.firebaseio.com",
    projectId: "trainschedulehomework-ddf3b",
    storageBucket: "trainschedulehomework-ddf3b.appspot.com",
    messagingSenderId: "892044864535"
};
firebase.initializeApp(config);

var database = firebase.database();

function currentTime() {
    var current = moment().format('HH:mm');
    $(".time").text(current);
    setTimeout(currentTime, 1000);
  };

  currentTime();

$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    var train = $("#traininput").val().trim();
    var destination = $("#destinput").val().trim();
    var time = $("#timeinput").val().trim();
    var frequency = $("#freqinput").val().trim();

    var newTrain = {
        type: "train",
        train: train,
        destination: destination,
        time: time,
        frequency: frequency
    };

    database.ref().push(newTrain);

    $("#train").val("");
    $("#destinput").val("");
    $("#timeinout").val("");
    $("#freqinput").val("");
});

database.ref().on("child_added", function (childSnapshot) {
    // console.log(childSnapshot.val());

    var trainName = childSnapshot.val().train;
    var trainDest = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().time;
    var trainFreq = childSnapshot.val().frequency;
    var key = childSnapshot.key;
    // console.log("Frist Train Time from Child snapshot: " + trainTime);
    // console.log("Train Frequency from Child snapshot: " + trainFreq);

    var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
    // console.log("Firt Time Converted: " + firstTimeConverted);

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    var tRemainder = diffTime % trainFreq;
    // console.log("Remainder of time aprt: " + tRemainder);

    var tMinutesTillTrain = trainFreq - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    var nextArrival = moment().add(tMinutesTillTrain, "minutes");
    // console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));

    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFreq),
        $("<td>").text(moment(nextArrival).format("HH:mm")).attr("id", "refresh"),
        $("<td>").text(tMinutesTillTrain).attr("id", "refresh"),
        $("<td>").text("X").attr("data-value", key).attr("class", "delete btn btn-sm btn-outline-danger")
    );

    $("#schedtable").append(newRow);
});

$(document).on("click", ".delete", function() {
    keyref = $(this).attr("data-value");
    database.ref().child(keyref).remove();
    location.reload();
  });

  setInterval(function() {
    location.reload();
  }, 60000);