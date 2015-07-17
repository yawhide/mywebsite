var $griffy = document.querySelector('.time--griffy')
var $sally = document.querySelector('.time--sally')
var $oneeye = document.querySelector('.time--oneeye')
var $robot = document.querySelector('.time--robot')
var $griffyCountDown = document.querySelector('.countdown--griffy')
var $sallyCountDown = document.querySelector('.countdown--sally')
var $oneeyeCountDown = document.querySelector('.countdown--oneeye')
var $robotCountDown = document.querySelector('.countdown--robot')
var $volume = document.querySelector('.master-volume')
var $mute = document.querySelector('.master-mute')
var bossSpawnWarningSuffix = ' spawns in less then 5 minutes'
var bossStrArr = ['griffy', 'cargo', 'red one eye', 'mark 52 alpha']
var volumeSection = [
  { name: 'griffy', muted: false},
  { name: 'sally', muted: false},
  { name: 'oneeye', muted: false},
  { name: 'robot', muted: false},
]
var muteAll

if (!'speechSynthesis' in window) {
  for (var i = 0; i < volumeSection.length; i++) {
    document.querySelector('.section--' + volumeSection[i].name + ' .volume').style.display = 'none'
    document.querySelector('.section--' + volumeSection[i].name + ' .mute').style.display = 'none'
  }
  $volume.style.display = 'none'
  $mute.style.display = 'none'
  document.querySelector('.volume-text').style.display = 'none'
}

init()

function init(){
  var griffyNextSpawn = TIMERS.griffy.time
  var sallyNextSpawn = TIMERS.sally.time
  var oneeyeNextSpawn = TIMERS.oneeye.time
  var robotNextSpawn = TIMERS.robot.time

  startTimer(griffyNextSpawn, $griffyCountDown, 'griffy')
  startTimer(sallyNextSpawn, $sallyCountDown, 'cargo')
  startTimer(oneeyeNextSpawn, $oneeyeCountDown, 'red one eye')
  startTimer(robotNextSpawn, $robotCountDown, 'mark 52 alpha')

  if(localStorage['muteAll'] && localStorage['muteAll'] === 'true'){
    muteAll = true
  } else {
    muteAll = false
  }

  if(muteAll){
    $volume.style.display = 'none'
  } else {
    $mute.style.display = 'none'
  }

  for (var i = 0; i < volumeSection.length; i++) {
    var volumeIcon = document.querySelector('.section--' + volumeSection[i].name + ' .volume')
    var muteIcon = document.querySelector('.section--' + volumeSection[i].name + ' .mute')
    if((localStorage[volumeSection[i].name] && localStorage[volumeSection[i].name] === 'true') || muteAll){
      volumeIcon.style.display = 'none'
      volumeSection[i].muted = true
    } else {
      muteIcon.style.display = 'none'
    }
    volumeIcon.onclick = toggleVolume
    muteIcon.onclick = toggleVolume
  }

  $mute.onclick = toggleMasterVolume
  $volume.onclick = toggleMasterVolume
}

function alertUser(boss){
  alert('Boss ' + boss + ' is about to spawn!!!!')
}

function startTimer(duration, display, boss) {
  var start = Date.now(),
      diff,
      minutes,
      seconds,
      speech;
  if (!muteAll && 'speechSynthesis' in window) {
    speech = new SpeechSynthesisUtterance(boss + bossSpawnWarningSuffix)
  }
  function timer() {
    // get the number of seconds that have elapsed since
    // startTimer() was called
    diff = duration - (((Date.now() - start) / 1000) | 0);
    if(diff < 1){
      setTimeout(function(){
        window.location.reload()
      }, 5000)
    } else if (diff === 5*60 && speech && !volumeSection[getFromVolumeSection(boss)].muted){
      window.speechSynthesis.speak(speech)
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

function getFromVolumeSection(boss){
  for (var i = 0; i < volumeSection.length; i++) {
    if(volumeSection[i].name === boss)
      return i
  }
}

function updateLocalStorage(){
  for (var i = 0; i < volumeSection.length; i++) {
    localStorage[volumeSection[i].name] = volumeSection[i].muted
  };
}

function toggleVolume(){
  var status = this.className
  var boss = this.parentElement.className.split('--')[1]
  var volumeSectionIndex = getFromVolumeSection(boss)
  if(status === 'volume'){
    volumeSection[volumeSectionIndex].muted = true
    document.querySelector('.section--' + volumeSection[volumeSectionIndex].name + ' .volume').style.display = 'none'
    document.querySelector('.section--' + volumeSection[volumeSectionIndex].name + ' .mute').style.display = 'inline-block'
    localStorage[volumeSection[volumeSectionIndex].name] = true
  } else {
    volumeSection[volumeSectionIndex].muted = false
    document.querySelector('.section--' + volumeSection[volumeSectionIndex].name + ' .volume').style.display = 'inline-block'
    document.querySelector('.section--' + volumeSection[volumeSectionIndex].name + ' .mute').style.display = 'none'
    localStorage[volumeSection[volumeSectionIndex].name] = false
    if($mute.style.display === '' || $mute.style.display === 'inline-block'){
      $volume.style.display = 'inline-block'
      $mute.style.display = 'none'
      localStorage['muteAll'] = false
      updateLocalStorage()
    }
  }
}

function toggleMasterVolume(){
  var status = this.className.split(' ')[1]
  for (var i = 0; i < volumeSection.length; i++) {
    document.querySelector('.section--' + volumeSection[i].name + ' .volume').style.display = status === 'master-mute' ? 'inline-block' : 'none'
    document.querySelector('.section--' + volumeSection[i].name + ' .mute').style.display = status === 'master-mute' ? 'none' : 'inline-block'
    volumeSection[i].muted = status === 'master-mute' ? false : true
    updateLocalStorage()
  }
  $volume.style.display = status === 'master-mute' ? 'inline-block' : 'none'
  $mute.style.display = status === 'master-mute' ? 'none' : 'inline-block'
  localStorage['muteAll'] = status !== 'master-mute'
}

// 11:35 pm   tortoise
// 10:05 am tortoise

// 11:45pm robot guy spawned

