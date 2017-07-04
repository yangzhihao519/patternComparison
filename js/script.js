var user = getUserId();
var itemPos = "";
var visGroup = "";
var phase = "";
var currentPatterns = {};
var clickedTime;
var createdTime;
var reactionTime;
var trainingPerSize = 4;
var experimentPerSize = 20;
var trial_nr = -(trainingPerSize * 6); // 6 size from 5 to 10
var nrTrials = experimentPerSize * 6; // 6 size from 5 to 10

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

// Generate Patterns in each trials
var trainingPatternsArray = [];
var experimentPatternsArray = [];

function getPatterns(trainingPerSize, experimentPerSize){
    for(var i=5; i<=10; i++){
        // Training trials 
        var n = trainingPerSize/2;
        for(var j=1; j<=n; j++){
            // Different trials
            var trainingPatternDifferent = {
                pattern1: i+"-"+j+"-1", 
                pattern2: i+"-"+j+"-2", 
                isSame: false, 
                size: i
            }

            // Same trails
            var x = j+n;
            var trainingPatternSame = {
                pattern1: i+"-"+x+"-1", 
                pattern2: i+"-"+x+"-1", 
                isSame: true, 
                size: i
            }

            trainingPatternsArray.push(trainingPatternDifferent);
            trainingPatternsArray.push(trainingPatternSame);
        }

        // Experiment trials
        var m = experimentPerSize/2;
        for(var j=trainingPerSize+1; j<=m+trainingPerSize; j++){
            // Different trails
            var experimentPatternDifferent = {
                pattern1: i+"-"+j+"-1", 
                pattern2: i+"-"+j+"-2", 
                isSame: false, 
                size: i
            }

            // Same trails
            var x = j+m;
            var experimentPatternSame = {
                pattern1: i+"-"+x+"-1", 
                pattern2: i+"-"+x+"-1", 
                isSame: true, 
                size: i
            }

            experimentPatternsArray.push(experimentPatternDifferent);
            experimentPatternsArray.push(experimentPatternSame);
        }

        
    }
}

getPatterns(trainingPerSize, experimentPerSize); // number of training trials per size, number of experiment trials per size

console.log("trainingPatternsArray");
console.log(trainingPatternsArray);
console.log("experimentPatternsArray");
console.log(experimentPatternsArray);

shuffle(trainingPatternsArray);
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
        document.getElementById("pattern-1").innerHTML = "<img src=\"images/"+currentPatterns.pattern1+ ".png\"></img>";
        document.getElementById("pattern-2").innerHTML = "<img src=\"images/"+currentPatterns.pattern2+ ".png\"></img>";
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
    a.download = user+"-results.csv";
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
