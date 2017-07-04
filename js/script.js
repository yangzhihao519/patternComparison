var trial_nr = -2; // 2 practice trial
var user = getUserId();
var itemPos = "";
var visGroup = "";
var nrTrials = 2; // 2 formal trial
var phase = "";
var currentPatterns = {};
var clickedTime;
var createdTime;
var reactionTime;

//shuffle orders
function shuffle(array) {
    var j, x, i;
    for (i = array.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = array[i - 1];
        array[i - 1] = array[j];
        array[j] = x;
    }
}

// Create User Id
function getUserId() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

// Initialise patterns for training
var trainingPatternsArray = [
    {pattern1: "0-pattern-1", pattern2: "0-pattern-2", isSame: false, size: 8},
    {pattern1: "0-pattern-1", pattern2: "0-pattern-1", isSame: true, size: 8}
];

shuffle(trainingPatternsArray);

// Initialise patterns for experiment
var experimentPatternsArray = [
    {pattern1: "1-pattern-1", pattern2: "1-pattern-2", isSame: false, size: 8},
    {pattern1: "2-pattern-1", pattern2: "2-pattern-1", isSame: true, size: 8}
];

shuffle(experimentPatternsArray);

// Show patterns
function showPatterns() {
    $('.message').hide();

    trial_nr++;
    if (trial_nr <= nrTrials) {
        document.getElementById("patterns-message").innerHTML = "Are these two patterns the same of different?";
        $('#patterns').show();
        createdTime = Date.now();

        if (trial_nr <= 0) {
            phase = "training";
            // show the two patterns
            currentPatterns = trainingPatternsArray[-trial_nr];
        }
        else {
            phase = "experiment";
            // show the two patterns
            currentPatterns = experimentPatternsArray[trial_nr-1];
        }
        console.log(currentPatterns);
        document.getElementById("pattern-1").innerHTML = "<img src=\"images/"+currentPatterns.pattern1+ ".jpg\"></img>";
        document.getElementById("pattern-2").innerHTML = "<img src=\"images/"+currentPatterns.pattern2+ ".jpg\"></img>";
    }
    else {
        sendData();
    }
};

captureMouse = []

// Get results and show feedback
function makeDecision(decision){
    clickedTime = Date.now();
    reactionTime = (clickedTime - createdTime);
    document.getElementById("feedback-message").innerHTML = "Reaction time:  " + reactionTime + " ms";
    $('#patterns').hide();
    $('#feedback').show();

    // right or wrong?
    var isRight = 0;
    if(decision === "same"){
        if(currentPatterns.isSame){
            isRight = 1;
        }else{
            //
        }
    }else if(decision === "different"){
        if(!currentPatterns.isSame){
            isRight = 1;
        }else{
            //
        }
    }else{
        //
    }

    captureMouse.push({
            participant: user,
            phase: phase,
            trialNo: trial_nr,
            reactionTime: reactionTime,
            pattern1: currentPatterns.pattern1,
            pattern2: currentPatterns.pattern2,
            patternSize: currentPatterns.size,
            patternIsSame: currentPatterns.isSame,
            isRight: isRight
    });
}

// Send collected data to downloadable csv file.
function sendData() {
    $('.result').hide();
    var jsonObject = JSON.stringify(captureMouse);

    var csv = '"ParticipantID", "Phase", "TrialNo", "ReactionTime", "Pattern1", "Pattern2", "PatternSize", "PatternIsSame", "IsRight",\n';
    csv += ConvertToCSV(jsonObject);

    var a = document.createElement('a');
    a.textContent = 'Download your data.';
    a.download = "results.csv";
    a.href = 'data:text/csv;charset=utf-8,' + escape(csv);
    $("#complete-area").append(a);
    $('#complete-area').show();
}

// Converts JSON object to CSV file.
function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}
