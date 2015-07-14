var $griffy = document.querySelector('.time--griffy')
var $sally = document.querySelector('.time--sally')
var $griffyCountDown = document.querySelector('.countdown--griffy')
var $sallyCountDown = document.querySelector('.countdown--sally')
var $oneeye = document.querySelector('.time--oneeye')
var $robot = document.querySelector('.time--robot')
var $oneeyeCountDown = document.querySelector('.countdown--oneeye')
var $robotCountDown = document.querySelector('.countdown--robot')

init()

function init(){
  var griffyNextSpawn = TIMERS.griffy.time
  var sallyNextSpawn = TIMERS.sally.time //? TIMERS.sally.time : 1000
  var oneeyeNextSpawn = TIMERS.oneeye.time //? TIMERS.oneeye.time : 1000
  var robotNextSpawn = TIMERS.robot.time //? TIMERS.robot.time : 1000

  startTimer(griffyNextSpawn, $griffyCountDown)
  startTimer(sallyNextSpawn, $sallyCountDown)
  startTimer(oneeyeNextSpawn, $oneeyeCountDown)
  startTimer(robotNextSpawn, $robotCountDown)

}

function alertUser(boss){
  alert('Boss ' + boss + ' is about to spawn!!!!')
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
      setTimeout(function(){
        window.location.reload()
      }, 5000)
    } else {

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

// 11:35 pm   tortoise
// 10:05 am tortoise

// 11:45pm robot guy spawned

