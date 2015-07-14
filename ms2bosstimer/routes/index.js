var express = require('express');
var router = express.Router();
var moment = require('moment');

var griffyTimersEst = [
  moment().hours(0).minute(25).seconds(0),
  moment().hours(1).minute(25).seconds(0),
  moment().hours(2).minute(25).seconds(0),
  moment().hours(3).minute(25).seconds(0),
  moment().hours(4).minute(25).seconds(0),
  moment().hours(5).minute(25).seconds(0),
  moment().hours(6).minute(25).seconds(0),
  moment().hours(7).minute(25).seconds(0),
  moment().hours(8).minute(25).seconds(0),
  moment().hours(9).minute(55).seconds(0),
  moment().hours(11).minute(25).seconds(0),
  moment().hours(12).minute(55).seconds(0),
  moment().hours(14).minute(25).seconds(0),
  moment().hours(15).minute(55).seconds(0),
  moment().hours(17).minute(25).seconds(0),
  moment().hours(18).minute(55).seconds(0),
  moment().hours(20).minute(25).seconds(0),
  moment().hours(21).minute(55).seconds(0),
  moment().hours(23).minute(25).seconds(0),
]

var sallyTimersEst = [
  moment().hours(0).minutes(10).seconds(0),
  moment().hours(0).minutes(40).seconds(0),
  moment().hours(1).minutes(10).seconds(0),
  moment().hours(1).minutes(40).seconds(0),
  moment().hours(2).minutes(10).seconds(0),
  moment().hours(2).minutes(40).seconds(0),
  moment().hours(3).minutes(10).seconds(0),
  moment().hours(3).minutes(40).seconds(0),
  moment().hours(4).minutes(10).seconds(0),
  moment().hours(4).minutes(40).seconds(0),
  moment().hours(5).minutes(10).seconds(0),
  moment().hours(5).minutes(40).seconds(0),
  moment().hours(6).minutes(10).seconds(0),
  moment().hours(6).minutes(40).seconds(0),
  moment().hours(7).minutes(10).seconds(0),
  moment().hours(7).minutes(40).seconds(0),
  moment().hours(8).minutes(10).seconds(0),
  moment().hours(8).minutes(40).seconds(0),
  moment().hours(9).minutes(10).seconds(0),
  moment().hours(9).minutes(40).seconds(0),
  moment().hours(10).minutes(40).seconds(0),
  moment().hours(11).minutes(40).seconds(0),
  moment().hours(12).minutes(40).seconds(0),
  moment().hours(13).minutes(40).seconds(0),
  moment().hours(14).minutes(40).seconds(0),
  moment().hours(15).minutes(40).seconds(0),
  moment().hours(16).minutes(40).seconds(0),
  moment().hours(17).minutes(40).seconds(0),
  moment().hours(18).minutes(40).seconds(0),
  moment().hours(19).minutes(40).seconds(0),
  moment().hours(20).minutes(40).seconds(0),
  moment().hours(21).minutes(40).seconds(0),
  moment().hours(22).minutes(40).seconds(0),
  moment().hours(23).minutes(40).seconds(0),
]

var oneeyeTimersEst = [
  moment().hours(0).minute(5).seconds(0),
  moment().hours(0).minute(35).seconds(0),
  moment().hours(1).minute(5).seconds(0),
  moment().hours(1).minute(35).seconds(0),
  moment().hours(2).minute(5).seconds(0),
  moment().hours(2).minute(35).seconds(0),
  moment().hours(3).minute(5).seconds(0),
  moment().hours(3).minute(35).seconds(0),
  moment().hours(4).minute(5).seconds(0),
  moment().hours(4).minute(35).seconds(0),
  moment().hours(5).minute(5).seconds(0),
  moment().hours(5).minute(35).seconds(0),
  moment().hours(6).minute(5).seconds(0),
  moment().hours(6).minute(35).seconds(0),
  moment().hours(7).minute(5).seconds(0),
  moment().hours(7).minute(35).seconds(0),
  moment().hours(8).minute(5).seconds(0),
  moment().hours(8).minute(35).seconds(0),
  moment().hours(9).minute(5).seconds(0),
  moment().hours(9).minute(35).seconds(0),
  moment().hours(10).minute(5).seconds(0),
  moment().hours(11).minute(5).seconds(0),
  moment().hours(12).minute(5).seconds(0),
  moment().hours(13).minute(5).seconds(0),
  moment().hours(14).minute(5).seconds(0),
  moment().hours(15).minute(5).seconds(0),
  moment().hours(16).minute(5).seconds(0),
  moment().hours(17).minute(5).seconds(0),
  moment().hours(18).minute(5).seconds(0),
  moment().hours(19).minute(5).seconds(0),
  moment().hours(20).minute(5).seconds(0),
  moment().hours(21).minute(5).seconds(0),
  moment().hours(22).minute(5).seconds(0),
  moment().hours(23).minute(5).seconds(0),
]

var robotTimersEst = [
  moment().hours(0).minute(45).seconds(0),
  moment().hours(1).minute(45).seconds(0),
  moment().hours(2).minute(45).seconds(0),
  moment().hours(3).minute(45).seconds(0),
  moment().hours(4).minute(45).seconds(0),
  moment().hours(5).minute(45).seconds(0),
  moment().hours(6).minute(45).seconds(0),
  moment().hours(7).minute(45).seconds(0),
  moment().hours(8).minute(45).seconds(0),
  moment().hours(10).minute(15).seconds(0),
  moment().hours(11).minute(45).seconds(0),
  moment().hours(13).minute(15).seconds(0),
  moment().hours(14).minute(45).seconds(0),
  moment().hours(16).minute(15).seconds(0),
  moment().hours(17).minute(45).seconds(0),
  moment().hours(19).minute(15).seconds(0),
  moment().hours(20).minute(45).seconds(0),
  moment().hours(22).minute(15).seconds(0),
  moment().hours(23).minute(45).seconds(0),
]

var startOfToday = moment().startOf('day')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MS2 Boss Timers', times: JSON.stringify(getNextSpawn()), 'prefix': '/ms2bosstimers' });
});

function getClosestTime(arrayOfTimes){
  var shortestTimeIndex
  var shortestTime
  var now = moment()
  //console.log('now', now._d)
  for (var i = 0; i < arrayOfTimes.length; i++) {
    var current = arrayOfTimes[i]
    if(current.isAfter(now)){
      if(i == 0){
        var before = moment(arrayOfTimes[arrayOfTimes.length - 1]).subtract(1, 'd')
        var after = arrayOfTimes[i + 1]
      } else if (i == arrayOfTimes.length - 1){
        var before = arrayOfTimes[i - 1]
        var after = moment(arrayOfTimes[0]).add(1, 'd')
      } else {
        var before = arrayOfTimes[i - 1]
        var after = arrayOfTimes[i + 1]
      }
      //console.log(before.toDate(), after.toDate(), current._d)
      if(current.isBetween(before, after)){
        var time = (arrayOfTimes[i].toDate() - Date.now())/1000 | 0
        return {
          time: time,
          timezone: new Date(),
          arrayOfTimes: arrayOfTimes[i].toDate(),
          dateNow: Date.now(),
        }
      }
    }
  }
  console.error('could not find time', now._d)
  arrayOfTimes.forEach(function (i){
    console.error(i._d)
  })
  var time = (moment(arrayOfTimes[0]).add(1, 'd').toDate() - Date.now())/1000 | 0
  return {
    time: time
  }
}

function getNextSpawn(){
  return {
    griffy: getClosestTime(griffyTimersEst),
    sally: getClosestTime(sallyTimersEst),
    oneeye: getClosestTime(oneeyeTimersEst),
    robot: getClosestTime(robotTimersEst),
  }
}

function updateTimes(){
  if(!startOfToday.isSame(moment().startOf('day'))){
    increaseDay(griffyTimersEst)
    increaseDay(sallyTimersEst)
    increaseDay(oneeyeTimersEst)
    increaseDay(robotTimersEst)
  }
  setTimeout(updateTimes, 30*60*60*1000)
}

function increaseDay(arrayOfTimes){
  for (var i = 0; i < arrayOfTimes.length; i++) {
    arrayOfTimes[i].add(1, 'd')
  }
}

module.exports = router;
