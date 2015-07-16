var assert = require("assert")
var moment = require('moment')

var Timer = require('../lib/timer')
var updateTimes = Timer.updateTimes
var getClosestTime = Timer.getClosestTime
var griffyTimersEst = Timer.griffyTimersEst
var sallyTimersEst = Timer.sallyTimersEst
var oneeyeTimersEst = Timer.oneeyeTimersEst
var robotTimersEst = Timer.robotTimersEst

describe('hooks', function() {

  before(function() {
    // runs before all tests in this block
  });

  after(function() {
    // runs after all tests in this block
  });

  beforeEach('some description', function() {
    // runs before each test in this block
  });

  afterEach(function() {
    // runs after each test in this block
  });

  // test cases
  describe('Timer', function() {
    describe('#griffy', function () {
      it('should return true if time is inbetween two times', function (){
        var time = moment().hours(12).minutes(14)
        assert(griffyTimersEst[10].isBefore(time))
        assert(griffyTimersEst[11].isAfter(time))
      })
      it('should return correct time if its midday', function () {
        var time = moment().hours(12).minutes(14)
        var result = getClosestTime(griffyTimersEst, time)
        var remainingTime = (result.arrayOfTimes - time.toDate()) / 1000 | 0
        assert(griffyTimersEst[11].isSame(moment(result.arrayOfTimes)))
        assert(moment(result.arrayOfTimes).isAfter(time))
        assert(result.time == remainingTime)
      })
      it('should return correct remaining time if its almost midnight', function (){
        var time = moment().hours(23).minutes(35)
        var result = getClosestTime(griffyTimersEst, time)
        var remainingTime = (moment(result.arrayOfTimes).add(1, 'd').toDate() - time.toDate()) / 1000 | 0
        assert(griffyTimersEst[0].isSame(moment(result.arrayOfTimes)))
        assert(moment(result.arrayOfTimes).isBefore(time))
        assert(result.time == remainingTime)
      })
      it('should return remaining time if its early morning before first moment', function (){
        var time = moment().hours(0).minutes(2)
        var result = getClosestTime(griffyTimersEst, time)
        var remainingTime = (result.arrayOfTimes - time.toDate()) / 1000 | 0
        assert(griffyTimersEst[0].isSame(moment(result.arrayOfTimes)))
        assert(moment(result.arrayOfTimes).isAfter(time))
        assert(result.time == remainingTime)
      })
      it('should return remaining time if its early morning after first moment', function (){
        var time = moment().hours(0).minutes(55)
        var result = getClosestTime(griffyTimersEst, time)
        var remainingTime = (result.arrayOfTimes - time.toDate()) / 1000 | 0
        assert(griffyTimersEst[1].isSame(moment(result.arrayOfTimes)))
        assert(moment(result.arrayOfTimes).isAfter(time))
        assert(result.time == remainingTime)
      })
      it('should return remaining time if its almost midnight before last moment', function (){
        var time = moment().hours(23).minutes(8)
        var result = getClosestTime(griffyTimersEst, time)
        var remainingTime = (result.arrayOfTimes - time.toDate()) / 1000 | 0
        assert(griffyTimersEst[griffyTimersEst.length - 1].isSame(moment(result.arrayOfTimes)))
        assert(moment(result.arrayOfTimes).isAfter(time))
        assert(result.time == remainingTime)
      })
    });
  });
});
