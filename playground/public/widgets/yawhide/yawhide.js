function yawhide(userid, htmlId) {
  var key = "41c6f4d7e7fa08239679468a09080ad3";
  var directionsKey = "AIzaSyC8xiyNAJNA0FoDT3vDhY-3u8Pw5PMdCN0";
  var directionsKey2 = "AIzaSyA-i_vsXh70AM-djMpuSy8_1DVmtQiygP4";

  function makeURL(webSvc) {
    if (server === "localhost") {
      return "file://E:/Dropbox/cs349/a4/a4/widgets/yawhide/" + webSvc + ".json";
    } else {
      return "https://" + server + "/api/v1/student/" + webSvc + "/" + userid
    }
  }
  function daysBetween(first, second) {

    // Copy date parts of the timestamps, discarding the time parts.
    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
    var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

    // Do the math.
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = two.getTime() - one.getTime();
    var days = millisBetween / millisecondsPerDay;

    // Round down.
    return Math.floor(days);
}

  var uwApi = "https://api.uwaterloo.ca/v2";
  var $el = $(htmlId);
  var $view;
  var buildings;
  var buildingCodes = [];
  var courseCodes;
  var templates = {};
  var currentTerm;
  var tenMin = 600000;
  var fifteenMin = 900000;
  var twentyMin = 600000*2;
  var thirtyMin = 600000*3;
  var FABContainerOffset;
  var addedBackArrowListener = false;

  var model = {
    views: [],
    midterms: [
      // catalog
      // subject code
      // TST date
      // TST time
      // TST room
      // section
    ],
    exams: [
      // catalog
      // subjectCode
      // date
      // startTime
      // endTime
      // loc
    ],
    section: [],
    currentCoords: {},


    init: function(){
      var that = this;
      // get building lat/long
      
      this.getBuildLocs()
        .then(function (response){
          if(response.meta.status === 200){
            buildings = response.data;
            buildings.sort(function (a, b){
              if (a.building_code < b.building_code) return -1;
              if (a.building_code > b.building_code) return 1;
              return 0;
            })
            var lastitem;
            var newBuildings = [];
            for (var i = 0; i < buildings.length; i++) {
              if(buildings[i].latitude && buildings[i].longitude &&
                buildings[i].building_code !== lastitem){
                newBuildings.push(buildings[i]);
                buildingCodes.push(buildings[i].building_code)
                lastitem = buildings[i].building_code;
              }
            };
            buildings = newBuildings;
          } else {
            // could not get current term ID
            console.error("Buildings list, " + response.meta.message);
          }
        })
        .then(this.getCourseCodes)
        .then(function (response){
          if(response.meta.status === 200){
            courseCodes = response.data;
          } else {
            // could not get current term ID
            console.error("Buildings list, " + response.meta.message);
          }
        })
        .then(this.getCurrentTermID)
        .then(function (response){
          if(response.meta.status === 200){
            currentTerm = response.data.current_term.toString();
          } else {
            // could not get current term ID
            console.error("Terms list, " + response.meta.message);
          }
        })
        .then(this.getMyInfo)
        .then(function (d){
          that.getCurrentTermInfo(d);
        })
        .then(function (){
          that.formatExams();
        })      
    },
    getBuildings: function (){
      return buildings;
    },
    getMyInfo: function (){
      return $.get(makeURL("stdCourseDetails"));
    },
    getBuildLocs: function (){
      return $.ajax({
        url: uwApi + "/buildings/list.json?key=" + key,
        type: "GET"
      })
    },
    getCourseCodes: function (){
      return $.ajax({
        url: uwApi + "/codes/subjects.json?key=" + key,
        type: "GET"
      })
    },
    getGMapsApi: function (){
      return $.ajax({
        url: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC8xiyNAJNA0FoDT3vDhY-3u8Pw5PMdCN0",
        type: "GET"
      })
    },
    getCurrentTermID: function (){
      return $.ajax({
        url: uwApi + "/terms/list.json?key=" + key,
        type: "GET"
      })
    },
    getCurrentTermInfo: function (d){
      var array = d.result.terms;
      for (var i = array.length - 1; i >= 0; i--) {
        if(array[i].term === currentTerm){
          //this.formatMidterms(array[i].courses);
          //break;
          var arr = array[i].courses;
          for (var i = arr.length - 1; i >= 0; i--) {
            var index = this.hasMidterm(arr[i]);
            if(index){
              var ob = {};
              var tstInfo = arr[i].sections[index].meets[0];
              ob.catalog = arr[i].catalog;
              ob.subjectCode = arr[i].subjectCode;
              ob.date = new Date(new Date().getFullYear() + '/' + tstInfo.meetDates);
              ob.time = tstInfo.meetTimes;
              ob.room = tstInfo.room;
              ob.section = arr[i].sections[0].sectionCode;

              var tmpOb = {};
              tmpOb[ob.catalog] = arr[i].sections[0].sectionCode;
              this.section.push(tmpOb);
              this.midterms.push(ob);
            }
          };
        }
      };
    },
    formatMidterms: function (array){
      for (var i = array.length - 1; i >= 0; i--) {
        var index = this.hasMidterm(array[i]);
        if(index){
          var ob = {};
          var tstInfo = array[i].sections[index].meets[0];
          ob.catalog = array[i].catalog;
          ob.subjectCode = array[i].subjectCode;
          ob.date = new Date(new Date().getFullYear() + '/' + tstInfo.meetDates);
          ob.time = tstInfo.meetTimes;
          ob.room = tstInfo.room;
          ob.section = array[i].sections[0].sectionCode;

          var tmpOb = {};
          tmpOb[ob.catalog] = array[i].sections[0].sectionCode;
          this.section.push(tmpOb);
          this.midterms.push(ob);
        }
      };
    },
    hasMidterm:function (course){
      for (var i = course.sections.length - 1; i >= 0; i--) {
        if(course.sections[i].componentCode === "TST")
          return i;
      };
      return false;
    },
    formatExams: function (){
      var that = this;
      var promises = [];
      for (var i = this.midterms.length - 1; i >= 0; i--) {
        promises.push(this.loadCourseData(this.midterms[i].subjectCode, this.midterms[i].catalog));
      };
      Promise.all(promises)
        .then(function (arr){
          that.addExams(arr);
        })
        .then(function (){
          that.addLatLongToExams();
        })
        .then(function (){
          var prom = [];
          for (var i = that.exams.length - 1; i >= 0; i--) {
            prom.push(that.getDirections(i));
          };
          Promise.all(prom)
            .then(function (arrOfProm){
              that.renderSummaryView();
            })
            .catch(function (err){
              throw "making directions failed, error given: " + err;
            })
        })
        .catch(function (){
          throw "loadCourseData failed to load from /courses/CS/438/examschedule";
        })
    },
    getIndexBySection: function (sectionArr, catalog){
      for (var i = sectionArr.length - 1; i >= 0; i--) {
        for (var j= this.section.length - 1; j >= 0; j--) {
          if(sectionArr[i].section === this.section[j][catalog])
            return i;
        };
      };
      return 0;
    },
    loadCourseData: function (subject, catalog) {
      var that = this;
      var url = "https://api.uwaterloo.ca/v2/courses/" + subject + "/" + catalog + "/examschedule.json?key=" + key;
      return $.ajax({
        url: url,
        type: "GET"
      });
    },
    addExams: function (arrayOfResults){
      console.log("Length: " + arrayOfResults.length);
      for (var i = arrayOfResults.length - 1; i >= 0; i--) {
        var d = arrayOfResults[i];
        if (d.meta.status === 200) {
          // get the index of sections array, defaults to 0
          var index = this.getIndexBySection(d.data.sections, d.data.course.split(" ")[1]);
          this.exams.push({
            catalog: d.data.course.split(" ")[1],
            subjectCode: d.data.course.split(" ")[0],
            date: new Date(d.data.sections[index].date + " " + d.data.sections[index].start_time),
            startTime: d.data.sections[index].start_time,
            endTime: d.data.sections[index].end_time,
            loc: d.data.sections[index].location.split(" ")[0]
          });

          //that.updateViews("course");
        } else {
          //that.course = {};
          //that.updateViews("error");
          console.error("Failed to read course data." + JSON.stringify(d.meta));
        }
      }
    },
    addLatLongToExams: function (){
      for (var i = buildings.length - 1; i >= 0; i--) {
        for (var j = this.exams.length - 1; j >= 0; j--) {
          if(this.exams[j].loc === buildings[i].building_code){
            this.exams[j].latitude = buildings[i].latitude;
            this.exams[j].longitude = buildings[i].longitude;
          }
        };
      };
    },
    getCurrentPosition: function (){
      var that = this;
      var promise = new Promise(function (resolve, reject){
        navigator.geolocation.getCurrentPosition(
          function (position){
            that.currentCoords = position.coords;
            resolve(position.coords);
          }, function (err){
            //console.error('ERROR(' + err.code + '): ' + err.message);
            reject(err);
          }, 
          { enableHighAccuracy: true , timeout: 5000, maximumAge: 0}
          );
      })
      return promise;
    },
    getDirections: function (index){
      var that = this;
      var p = new Promise(function (resolve, reject){
        that.getCurrentPosition()
        .then(function (position){
          var request = {
            origin: position.latitude+","+position.longitude,
            destination: that.exams[index].latitude+","+that.exams[index].longitude,
            travelMode: google.maps.TravelMode.TRANSIT,
            transitOptions: {arrivalTime: new Date(that.exams[index].date.getTime() - fifteenMin)},
            unitSystem: google.maps.UnitSystem.METRIC,
            provideRouteAlternatives: true
          };
          directionsApi.route(request, function (result, status){
            console.log(result);
            if(status == google.maps.DirectionsStatus.OK){
              resolve(that.formatDirections(result, index))
            }
          });
        })
        .catch(function (err){
          if(err.message === "User denied Geolocation"){
            throw "Please turn on your GPS and try again: " + err;
          }
          
          reject(err);
        })
      })
      return p;
    },
    formatDirections: function (data, index, cb){
      var fastestRouteIndex = 0;
      if(data.status === "OK"){
        var bestTimeSoFar = 100000000000;
        for (var i = 0; i < data.routes.length; i++) {
          if(data.routes[i].legs[0].duration.value < bestTimeSoFar){
            fastestRouteIndex = i;
            bestTimeSoFar = data.routes[i].legs[0].duration.value;
          }
        };
        this.exams[index].travelInfo = data.routes[fastestRouteIndex].legs[0];
        if(cb)
          cb();
        return "";
      } else {
        throw "Error in formatDirections with : " + JSON.stringify(data);
      }
    },
    renderSummaryView: function (){
      $view.children().remove();
      var arrayOfExams = JSON.parse(localStorage.getItem("yawhideExams"))
      if(arrayOfExams){
        for (var i = arrayOfExams.length - 1; i >= 0; i--) {
          var exam = JSON.parse(arrayOfExams[i]);
          exam.date = new Date(exam.date);
          this.exams.push(exam)
        };
      }
      this.exams.sort(function (a, b){
        return a.date > b.date;
      })
      for (var i = 0; i < this.exams.length; i++) {
        var ob = {
          subject: this.exams[i].subjectCode + " " + this.exams[i].catalog,
          date: this.exams[i].date.toDateString(),
          loc: this.exams[i].loc,
          departureTime: this.exams[i].travelInfo.departure_time ? 
                          this.exams[i].travelInfo.departure_time.text
                          : this.exams[i].travelInfo.duration.text,
          curLoc: this.currentCoords.latitude + ","+this.currentCoords.longitude,
          destLoc: this.exams[i].latitude+','+this.exams[i].longitude
        }
        var t = Mustache.render(templates.summaryView, ob);
        $view.append(t);
      };

      if($('.FABContainer').length === 0){
        $el.append(templates.floatingActionButton);
        this.addOnEvents();
      }
    },
    addOnEvents: function (){
      var that = this;
      $("#yawhide .FAB").on("mouseenter", function (){
        $("#yawhide .FABTextContainer").css("opacity", 100);
      })
      $("#yawhide .FAB").on("mouseleave", function (){
        $("#yawhide .FABTextContainer").css("opacity", 0);
      })
      $("#yawhide .FAB").on("click", function (e){
        e.preventDefault();
        var container = $(this);
        if(container.hasClass('fabRed')){
          container.addClass('fabGreen').removeClass("fabRed")
          $('.FABIcon').fadeTo(100, 0);
          $('.DoneIcon').fadeTo('slow', 1);
          $('.FABText').text('Save');
          $('.FABContainer').css('padding-left', '11px');

          if(that.isScrollBar()){
            fabContainerOffset = parseInt($('.FABContainer').css('right'));
            $('.FABContainer').css('right', (fabContainerOffset+17)+'px');
          }
          $('.backArrow').fadeTo(1, 0.5);
          that.renderCreateView();

        } else {
          var formData = that.validateCreateForm();
          if(formData){
            container.removeClass('fabGreen').addClass('fabRed')
            $('.DoneIcon').fadeTo('fast', 0);
            $('.FABIcon').fadeTo('fast', 1);
            $('.backArrow').fadeTo('slow', 0);

            var buildingCoords = that.lookUpBuilding(formData.loc);
            if(!buildingCoords){
              throw "Could not find coordinates for the building code: " 
                + formData.loc;
            }
            formData.latitude = buildingCoords.latitude
            formData.longitude = buildingCoords.longitude
            formData.date = new Date(formData.date + " " + formData.time);
            that.exams.push(formData);
            var index = that.exams.length -1;

            var request = {
              origin: that.currentCoords.latitude+","+that.currentCoords.longitude,
              destination: formData.latitude+","+formData.longitude,
              travelMode: google.maps.TravelMode.TRANSIT,
              transitOptions: {arrivalTime: new Date(formData.date.getTime() - fifteenMin)},
              unitSystem: google.maps.UnitSystem.METRIC,
              provideRouteAlternatives: true
            };
            directionsApi.route(request, function (result, status){
              console.log(result);
              if(status == google.maps.DirectionsStatus.OK){
                that.formatDirections(result, index, function (){
                  $('.FABText').text('Create');
                  $('.FABContainer').css('padding-left', '');
                  $('.FABContainer').css('right', fabContainerOffset+'px');
                  that.saveEvent(that.exams[index], function (){
                    that.renderSummaryView();
                  });
                })
              } else {
                throw "Directions API failed: " + JSON.stringify(request);
              }
            });
          }
        }
      })
    },
    renderCreateView: function (){
      var that = this;
      $view.children().remove();
      var ob = {};
      ob.courseCodes = courseCodes;
      ob.buildings = buildingCodes;
      var t = Mustache.render(templates.createView, ob);
      $view.append(t);
      if(!addedBackArrowListener){
        $("#yawhide .backArrow").on("click", function (e){
          e.preventDefault();
          $("#yawhide .FAB").removeClass('fabGreen').addClass('fabRed')
          $('#yawhide .DoneIcon').fadeTo('fast', 0);
          $('#yawhide .FABIcon').fadeTo('fast', 1);
          $('.FABText').text('Create');
          $('.FABContainer').css('padding-left', '');
          $('.backArrow').fadeTo('slow', 0);
          $('.FABContainer').css('right', fabContainerOffset+'px');
          that.renderSummaryView();
          addedBackArrowListener = true;
        })
        $('#yawhide .backArrow').on('mouseenter', function (){
          if($('.panel').length === 0)
            $(this).fadeTo('fast', 1);
        })
        $('#yawhide .backArrow').on('mouseleave', function (){
          if($('.panel').length === 0)
            $(this).fadeTo('fast', 0.5);
        })
      }
    },
    validateCreateForm: function (){
      var form = $('.form')
      var subject = form.find('select[name="subject"]')
      var course = form.find('input[name="course"]')
      var date = form.find('input[name="date"]')
      var building = form.find('select[name="building"]')
      var time = form.find('input[name="time"]')
      var room = form.find('input[name="room"]')
      var formData = {
        subjectCode: form.find('select[name="subject"]').val(),
        catalog: form.find('input[name="course"]').val(),
        date: form.find('input[name="date"]').val(),
        loc: form.find('select[name="building"]').val(),
        startTime: form.find('input[name="time"]').val(),
        room: form.find('input[name="room"]').val(),
        time: form.find('input[name="time"]').val()
      };
      var hasError = false;
      if(!subject.val()){
        subject.parent().addClass('has-error')
        hasError = true
      } else {
        subject.parent().removeClass('has-error')
      }
      if (!course.val() || !/^\+?[1-9]\d*$/.test(course.val())) {
        course.parent().addClass('has-error')
        hasError = true
      } else{
        course.parent().removeClass('has-error')
      }
      if (!date.val() 
          || daysBetween(new Date(), new Date(date.val())) < -1){
        date.parent().addClass('has-error')
        hasError = true
      } else {
        date.parent().removeClass('has-error')
      }
      if (!time.val() 
          || Number(time.val().split(":")[0]) < 8 
          || Number(time.val().split(":")[0]) > 22){
        time.parent().addClass('has-error')
        hasError = true
      } else {
        time.parent().removeClass('has-error')
      }
      if (!building.val()){
        building.parent().addClass('has-error')
        hasError = true
      } else {
        building.parent().removeClass('has-error')
      }
      if (!room.val()  || !/^\+?[1-9]\d*$/.test(room.val())){
        room.parent().addClass('has-error')
        hasError = true
      } else {
        room.parent().removeClass('has-error')
      }
      if(hasError)
        return null;
      return formData;
    },
    lookUpBuilding: function (code){
      var ob = {};
      for (var i = buildings.length - 1; i >= 0; i--) {
        if(buildings[i].building_code === code){
          ob.latitude = buildings[i].latitude;
          ob.longitude = buildings[i].longitude;
          return ob;
        }
      };
      return null;
    },
    isScrollBar: function(){
      return document.getElementById('yawhide').scrollHeight !== 
        $('#yawhide').height();
    },
    saveEvent: function (exam, cb){
      var e = JSON.stringify(exam);
      var arrayOfExams = JSON.parse(localStorage.getItem('yawhideExams'));
      if(!arrayOfExams)
        arrayOfExams = [];
      arrayOfExams.push(e)
      localStorage.setItem('yawhideExams', JSON.stringify(arrayOfExams));
      cb();
    }
  }

  var loadTemplates = function(location, storeTemplates) {

    $.get(location, "",
      function (d) {
        var templates = {};
        var chunks = d.split("@@@@");
        if (chunks.length % 2 != 0) {
              // Exceptions thrown in a callback aren't catchable
          throw "WARNING: loadTemplates expected an even number of strings in " 
            + location + " after splitting on '@@@@'.";
        } 

        for(var i=0; i<chunks.length; i = i+2) {
          templates[chunks[i].trim()] = chunks[i+1].trim();
        }

        storeTemplates(templates);
      }, "text")
      .fail(function (err) { console.log(err); console.log("error loading templates from " + location)});
  }

  loadTemplates("widgets/yawhide/templates.txt", function (t) {
    templates = t;
    $el.html(templates.baseHtml);
    $view = $('#yawhide .view');
    $el.append(templates.footer);

    
    loadScript();
    model.init();
   
  
      
      // Controllers

      // What happens when the user submits some data.
      //$("#storeJson_submit").click(function() {
      //  model.addData($("#storeJson_input").val());
      //});

      // What happens when the user clears data.
      //$("#storeJson_clear").click(function() {
      //  model.clearData();
      //});

      //model.addView(dataView.updateView);
      //model.addView(inputView.updateView);
      //model.getData();
  });

  window['yarhide'] = model;
  //$el.html("<h1>yawhide Widget</h1>");
} 
