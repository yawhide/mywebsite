function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}
function startTimer(duration, display) {
    var start = Date.now(),
        diff,
        minutes,
        seconds;
    function timer() {
        // get the number of seconds that have elapsed since
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            start = Date.now() + 1000;
        }
    };
    // we don't want to wait a full second before the timer starts
    timer();
    setInterval(timer, 1000);
}

function getClosestTime(arrayOfTimes){
  var shortestTimeIndex
  var shortestTime
  var now = moment()
  var nowAsArray = moment().toArray()
  for (var i = 0; i < arrayOfTimes.length; i++) {
    var current = arrayOfTimes[i]
    if(now < current){
      if(i == 0){
        var before = arrayOfTimes.length - 1
        var after = i + 1
      } else if (i == arrayOfTimes.length - 1){
        var before = i - 1
        var after = 0
      } else {
        var before = i - 1
        var after = i + 1
      }
      if(current.isBetween(arrayOfTimes[before], arrayOfTimes[after])){
        return arrayOfTimes[i]
      }
    }
  }
  return -1
}

function startTimer(duration, display) {
  var start = Date.now(),
      diff,
      minutes,
      seconds;
  function timer() {
    // get the number of seconds that have elapsed since
    // startTimer() was called
    diff = duration - (((Date.now() - start) / 1000) | 0);
    if(diff < 1){

    }

    // does the same job as parseInt truncates the float
    minutes = (diff / 60) | 0;
    seconds = (diff % 60) | 0;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (diff <= 0) {
      // add one second so that the count down starts at the full duration
      // example 05:00 not 04:59
      start = Date.now() + 1000;
    }
  };
  // we don't want to wait a full second before the timer starts
  timer();
  setInterval(timer, 1000);
}

// when countdown gets to 0, show SPAWNED for 5 minutes
// then recalc and continue
