var moment = require('moment')
var nodemailer = require('nodemailer')

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

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'lowcbturm@gmail.com',
    pass: 'lascannon'
  }
});

var startOfToday = moment().startOf('day')
var timeBuffer = moment().subtract(5, 'm')

function getClosestTime(arrayOfTimes, givenTime){
  var shortestTimeIndex
  var shortestTime
  var now = givenTime || moment()
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
        var timeRightNow = givenTime || Date.now()
        var time = (arrayOfTimes[i].toDate() - timeRightNow)/1000 | 0
        checkBadResponse(time, arrayOfTimes)
        return {
          time: time,
          timezone: new Date().getTimezoneOffset()/60,
          arrayOfTimes: arrayOfTimes[i].toDate(),
          dateNow: timeRightNow,
        }
      }
    }
  }
  console.error('could not find time, using first moment but added a day', now._d)
  // arrayOfTimes.forEach(function (i){
  //   console.error(i._d)
  // })
  var timeRightNow = givenTime || Date.now()
  var time = (moment(arrayOfTimes[0]).add(1, 'd').toDate() - timeRightNow)/1000 | 0
  checkBadResponse(time, arrayOfTimes)
  return {
    time: time,
    timezone: new Date().getTimezoneOffset()/60,
    arrayOfTimes: arrayOfTimes[0].toDate(),
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

function updateTimes(givenTime){
  var now = givenTime || moment()
  if(!startOfToday.isSame(now.startOf('day'))){
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

function checkBadResponse(time, arrayOfTimes){
  if((time < 0 || !time || time > 90*60*1000) && timeBuffer.isBefore(moment())){
    transporter.sendMail({
      from: 'lowcbturm@gmail.com',
      to: 'ert.mcscrad@gmail.com',
      subject: 'wrong time given!',
      text: time + '\n\n' + JSON.stringify(arrayOfTimes) + '\n\n' + new Date().toString()
    })
    timeBuffer = moment().add(5, 'm')
  }
}

module.exports = {
  updateTimes: updateTimes,
  getNextSpawn: getNextSpawn,
  getClosestTime: getClosestTime,
  griffyTimersEst: griffyTimersEst,
  sallyTimersEst: sallyTimersEst,
  oneeyeTimersEst: oneeyeTimersEst,
  robotTimersEst: robotTimersEst,
}
