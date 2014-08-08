'use strict';

angular.module('portalApp.accountCtrl', [])

.controller('BillingCtrl', function ($scope, $http, $location, UserData){
  if(!!window.sessionUsername){
    $scope.subscription = {};

    $scope.$on('$locationChangeStart', function (event, newLoc, oldLoc){
      switch($location.path()){
        case '/changeaddress':
          $scope.sideBarCss = 'addr';
          break;
        case '/changecc':
          $scope.sideBarCss = 'cc';
          break;
        case '/changeplan':
          $scope.sideBarCss = 'plan';
          break;
        case '/changepassword':
          $scope.sideBarCss = 'pass';
          break;
        case '/changemsg':
          $scope.sideBarCss = 'msg';
          break;
        case '/microphone':
          $scope.sideBarCss = 'microphone';
          break;
        default:
          $scope.sideBarCss = 'profile';
          break;
      }
    });

    var setSubscriptionDetails = function (data){
      if(data.length === 0){
        // $scope.errorMsg['error_code'] = 'You do you have any plans on record.';
        // $scope.errorGeneral = true;
        $scope.noSubscription = true;
      } else {
        $scope.subscription.accountType = data[0].plan.name;

        $scope.subscription.maxData = data[0].plan.data;
        $scope.subscription.maxMinutes = data[0].plan.credits;
        $scope.subscription.data = data[0].data_usage;
        $scope.subscription.percent = Math.ceil(data[0].data_usage / data[0].plan.data * 100);
        // $scope.periodStart = moment(data[0].period_start).format('MMMM Do, YYYY');

        $scope.subscription.periodEnd = data[0].period_end === '-0001-11-30T00:00:00+0000' ? false : moment(data[0].period_end).format('MMMM Do, YYYY');
      }
    }

    var setBillingDetails = function (data){
      $scope.billing = _.clone(data);
      if(data.type === 'Diners Club'){
        $scope.ccNumber = 'XXXX-XXXX-XX'+data.last4.substring(0, 2) +'-'+data.last4.substring(2);
      } else if (data.type === 'American Express'){
        $scope.ccNumber = 'XXXX-XXXXXX-X'+data.last4;
      } else {
        $scope.ccNumber = 'XXXX-XXXX-XXXX-' + data.last4;
      }
      $scope.billing.exp_month =  data.exp_month < 10 ? ('0' + data.exp_month.toString()) : data.exp_month;
      $scope.billing.exp_year = data.exp_year % 100;
    }

    var setProfileDetails = function (data){
      data.phone_number = data.phone_number ? data.phone_number.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3") : 'N/A';
      $scope.profile = _.clone(data);
    }

    var handleError = function (err, stat){
      if(stat === 401){
        window.location.href = '/logout'
      }
      else if (stat === 500){
        $scope.errorMsg = 'There was an error getting your account information. Please try again later.';
        $scope.errorGeneral = true;
      }
      else if(err.error_code === 'NOT_FOUND'){

      } else{
        $scope.errorStatus = stat;
        $scope.errorMsg = err.message ? err.message : 'There was an error getting your account information. Please try again later.';
        $scope.errorGeneral = true;
      }
      $scope.billing = true;
    }

    UserData.getSubscriptions()
      .success(setSubscriptionDetails)
      .error(handleError);

    UserData.getBilling()
      .success(setBillingDetails)
      .error(handleError);

    UserData.getProfile()
      .success(setProfileDetails)
      .error(handleError);

    $scope.$on('updatedBilling', function (){
      UserData.getBilling().success(setBillingDetails);
    });

    $scope.$on('updatedSubscriptions', function (){
      UserData.getSubscriptions().success(setSubscriptionDetails);
    });

    $scope.$on('updatedProfile', function (){
      UserData.getProfile().success(setProfileDetails);
    });
  } else {
    window.location.href = '/logout';
  }
  $scope.changeSideBarCss = function (str){
    if(!$scope.noSubscription){
      $scope.sideBarCss = str;
      switch(str){
        case 'plan':
          $location.path('/changeplan')
          break;
        case 'cc':
          $location.path('/changecc')
          break;
        case 'addr':
          $location.path('/changeaddress')
          break;
      }
    }
  }
})
.controller('ChangeProfileCtrl', function ($scope, $http, $timeout, UserData){

  var setProfileData = function (data){
    $scope.originalEmail = data.email;
    $scope.profile = {first_name: data.first_name, last_name: data.last_name, email: data.email};
    $scope.doneHttp = true;
  }

  var handleError = function (err, stat){
    if(stat === 401)
      window.location.href = '/logout';
    else if (stat === 500){
      $scope.errorMsg = 'There was an error getting your account information. Please try again later.';
      $scope.errorGeneral = true;
    }
    else{
      $scope.errorStatus = stat;
      $scope.errorMsg = err.message;
      $scope.errorGeneral = true;
    }
  }

  UserData.getProfile()
    .success(setProfileData)
    .error(handleError);

  $scope.changeProfile = function (isValid){
    if(isValid){
      $scope.loading = true;
      $http.post('/api/users/'+ window.sessionUsername +'?http_method=PATCH', 
      'json='+JSON.stringify($scope.profile),
      { headers: {'Content-Type':'application/x-www-form-urlencoded;'}}
      )
        .success(function (res){
          _gaq.push(['_trackEvent', 'Account Info', 'change_profile']);
          $scope.loading = false;
          $scope.msg = 'Your profile information was successfully changed.';
          UserData.refreshProfile();
          $timeout(function (){$scope.msg = ''}, 5000)
        })
        .error(function (errorChangeProfile, statusChangeProfile){
          $scope.loading = false;
          $scope.errorStatus = statusChangeProfile;
          $scope.errorMsg = errorChangeProfile.error_code === 'SIGNATURE_INVALID' ? 'You are using invalid characters. Please try again.' : 'There was an error getting your account information. Please try again later. ' + errorChangeProfile.message;
          $scope.errorGeneric = true;
        });
    }
  };
})
.controller('ChangeAddrCtrl', function ($scope, $http, $timeout, UserData, StatesUSA){

  $scope.states = StatesUSA.regularStates;

  var setBillingAddr = function (data){
    var splitName = data.name !== null ? data.name.split(' ') : ['', ''];

    $scope.bill = _.clone(data);
    $scope.bill.first_name = splitName[0];
    $scope.bill.last_name = splitName[1];
    $scope.bill.address_state = StatesUSA.statesAbbreviated[data.address_state];
    $scope.doneHttp = true;
  }

  var handleError = function (err, stat){
    if(stat === 401)
      window.location.href = '/logout';
    else if (stat === 500){
      $scope.errorMsg = 'There was an error getting your account information. Please try again later.';
      $scope.errorGeneral = true;
    }
    else{
      $scope.errorStatus = stat;
      $scope.errorMsg = err.message;
      $scope.errorGeneral = true;
    }
  }

  UserData.getBilling()
    .success(setBillingAddr)
    .error(handleError);

  $scope.checkZip = function (){
    if(typeof($scope.addrForm.zipcode.$viewValue) !== 'undefined'){
      if($scope.addrForm.zipcode.$viewValue.length !== 5)
        $scope.addrForm.zipcode.$setValidity('zipLength', false);
      else
        $scope.addrForm.zipcode.$setValidity('zipLength', true);  
    } else
      $scope.addrForm.zipcode.$setValidity('zipLength', false);
  }
  
  $scope.changeAddr = function (isValid){
    if(isValid){
      $scope.loading = true;
      var data = {
        name: $scope.bill.first_name + " " + $scope.bill.last_name,
        address_line1: $scope.bill.address_line1,
        address_line2: $scope.bill.address_line2 || "",
        address_city: $scope.bill.address_city,
        address_state: StatesUSA.statesAbbreviatedReverse[$scope.bill.address_state],
        address_zip: $scope.bill.address_zip,
        address_country: "USA"
      }
      $http.post('/api/users/' + window.sessionUsername + '/billing' +'?http_method=PATCH', 
        'json=' + JSON.stringify(data),
          { headers: {'Content-Type':'application/x-www-form-urlencoded;'}}
          )
        .success(function (res){
          $scope.loading = false;
          $scope.msg = 'Your billing address information was successfully changed.';
          UserData.refreshBilling();
          $timeout(function (){$scope.msg = ''}, 5000)
        })
        .error(function (errorChangeAddr, statusChangeAddr){
          if(statusChangeAddr === 401)
            window.location.href = '/logout';
          else if (statusChangeAddr === 500){
            $scope.errorMsg = 'There was an error getting your account information. Please try again later.';
            $scope.errorGeneral = true;
          }
          else{
            $scope.loading = false;
            $scope.errorStatus = statusChangeAddr;
            $scope.errorMsg = errorChangeAddr.message;
            $scope.errorGeneric = true;
          }
        })
    }
  }
})
.controller('ChangePassCtrl', function ($scope, $http, UserData, $timeout, $route){

  $scope.$watch('newPass2', function (newVal, old){
    if(newVal === $scope.newPass)
       $scope.passwordForm.newPass2.$setValidity('match', true)
     else
       $scope.passwordForm.newPass2.$setValidity('match', false)
  })

  if(sessionStorage.getItem('successMsg') === 'pass'){
    $scope.msg = 'Your password was successfully changed.';
    $timeout(function (){$scope.msg = ''}, 5000)
    sessionStorage.removeItem('successMsg');
  }

  $scope.changePass = function (isValid){
    if(isValid){
      $scope.loading = true;
      $http.post('/api/users/'+ window.sessionUsername +'?http_method=PATCH', 
        'json='+JSON.stringify({old_password: $scope.oldPass, password: $scope.newPass}),
        { headers: {'Content-Type':'application/x-www-form-urlencoded;'}}
        )
        .success(function (res){
          $scope.loading = false;
          sessionStorage.setItem('successMsg', 'pass');
          $route.reload()
        })
        .error(function (errorChangePass, statusChangePass){
          if(statusChangePass === 401)
            window.location.href = '/logout';
          else{
            $scope.loading = false;
            $scope.errorStatus = statusChangePass;
            $scope.errorMsg = errorChangePass.error_code === 'PERMISSION_DENIED' ? 'Incorrect old password. Please enter your current password.' : 'There was an error getting your account information. Please try again later.';
            $scope.errorGeneric = true;
          }
        });
    }
  }
})
.controller('ChangeCCCtrl', function ($scope, $http, UserData, $timeout, $route, GenerateMonthYear){
  $scope.months = GenerateMonthYear.months;
  $scope.years = GenerateMonthYear.years;

  
  $scope.checkCCLength = function (){
    if(typeof($scope.ccForm.cc.$viewValue) !== 'undefined'){
      if ($.payment.validateCardNumber($scope.cc.number))
        $scope.ccForm.cc.$setValidity('ccLength', true);
      else
        $scope.ccForm.cc.$setValidity('ccLength', false);
    } else
      $scope.ccForm.cc.$setValidity('ccLength', false);
  }
  $scope.checkCvvLength = function (){
    if(typeof($scope.ccForm.cvv.$viewValue) !== 'undefined'){
      if($scope.ccForm.cvv.$viewValue.length < 3 || $scope.ccForm.cvv.$viewValue.length > 4)
        $scope.ccForm.cvv.$setValidity('cvvLength', false);
      else
        $scope.ccForm.cvv.$setValidity('cvvLength', true);
    } else
      $scope.ccForm.cvv.$setValidity('cvvLength', false);
  }

  if(sessionStorage.getItem('successMsg') === 'cc'){
    $scope.msg = 'Your credit card information was successfully changed.';
    $timeout(function (){$scope.msg = ''}, 5000)
    sessionStorage.removeItem('successMsg');
  }

  $scope.changeCC = function (isValid){
    if(isValid){
      $scope.loading = true;
      var data = _.clone($scope.cc);
      data.exp_month = $scope.months.indexOf(data.exp_month) + 1;
      //$scope.cc.exp_month = data.exp_month;

      UserData.getBilling()
        .success(function (billingInfo){
          data.address_city = billingInfo.address_city;
          data.address_country = billingInfo.address_country;
          data.address_line1 = billingInfo.address_line1;
          data.address_line2 = billingInfo.address_line2;
          data.address_state = billingInfo.address_state;
          data.address_zip = billingInfo.address_zip;
          data.name = billingInfo.name;
          
          Stripe.card.createToken(data, function (statusCreateToken, createTokenReponse){
            if(statusCreateToken === 200){
              $http.put('/api/users/' + window.sessionUsername + '/billing',
                'json=' + JSON.stringify({stripe_token: createTokenReponse.id}),
                { headers: {'Content-Type':'application/x-www-form-urlencoded;'}}
                )
              .success(function (res){
                $scope.loading = false;
                UserData.refreshBilling();
                sessionStorage.setItem('successMsg', 'cc')
                $route.reload();
              })
              .error(function (errorChangeCC, statusChangeCC){
                $scope.loading = false;
                $scope.errorStatus = statusChangeCC;
                $scope.errorMsg = errorChangeCC.message;
                $scope.errorGeneric = true;
              });
            } else if (statusCreateToken === 401){
              window.location.href = '/logout';
            } else {
              $scope.loading = false;
              $scope.errorStatus = statusCreateToken;
              $scope.errorMsg = createTokenReponse.error.message;
              $scope.errorGeneric = true;
              $scope.$apply();
            }
          });
        })
        .error(function (errorGetBillInfo, statusGetBillInfo){
          if(statusGetBillInfo === 401)
            window.location.href = '/logout';
          else if (statusGetBillInfo === 500){
            $scope.errorMsg = 'There was an error getting your account information. Please try again later.';
            $scope.errorGeneral = true;
          }
          else{
            $scope.loading = false;
            $scope.errorStatus = errorGetBillInfo;
            $scope.errorMsg = errorGetBillInfo.message;
            $scope.errorGeneric = true;
          }
        });
      }
    }
})
.controller('ChangePlanCtrl', function ($scope, $http, $timeout, $route, UserData){
  
  var updatePlan = function (data){
    if(data.length === 0){
      $scope.errorMsg = 'You do not have any plans on record.';
      $scope.errorGeneric = true;
    } else {
      $scope.planName = data[0].plan.name;
      $scope.planId = data[0].plan.id;
      $scope.subId = data[0].id;
    }
    $scope.doneHttp = true;
  }

  var setPlanPrice = function (data){
    var planIds = [];
    for (var i = data.length - 1; i >= 0; i--) {
      switch(data[i].name){
        case 'Tall':
          $scope.tallPrice = (data[i].price / 100).toFixed(2);
          break;
        case 'Grande':
          $scope.grandePrice = (data[i].price / 100).toFixed(2);
          break;
        case 'Venti':
          $scope.ventiPrice = (data[i].price / 100).toFixed(2);
          break;
      }
    }
  }

  var handleError = function (err, stat){
    if(stat === 401)
      window.location.href = '/logout';
    else if (stat === 500){
      $scope.errorMsg = 'There was an error getting your account information. Please try again later.';
      $scope.errorGeneral = true;
    }
    else{
      $scope.errorStatus = stat;
      $scope.errorMsg = err.message;
      $scope.errorGeneral = true;
    }
  }

  UserData.getSubscriptions()
    .success(updatePlan)
    .error(handleError);

  UserData.getPlan()
    .success(setPlanPrice)
    .error(handleError);

  var getPlanId = function (name, arr){
    for (var i = arr.length - 1; i >= 0; i--) {
      if(arr[i].name === name)
        return arr[i].id;
    }
  }

  $scope.planSelected = function (input){
    $scope.newPlanName = input;
  }

  if(sessionStorage.getItem('successMsg') === 'plan'){
    $scope.msg = 'Your plan was successfully changed.';
    $timeout(function (){$scope.msg = ''}, 5000)
    sessionStorage.removeItem('successMsg');
  }

  $scope.changePlan = function (){
    $scope.loading = true;
    UserData.getPlan()
      .success(function (plans){
        $http.post('/api/users/' + window.sessionUsername + '/subscriptions/' + $scope.subId + '?http_method=PATCH',
          "json=" + JSON.stringify(
            {plan_id: getPlanId($scope.newPlanName, plans)}),
          {
            headers: {'Content-Type':'application/x-www-form-urlencoded;'}
          })
          .success(function (success){
            $scope.loading = false;
            UserData.refreshSubscriptions();
            sessionStorage.setItem('successMsg', 'plan');
            $route.reload();
          })
          .error(function (errorChangePlan, statusChangePlan){
            $scope.loading = false;
            if(statusChangePlan == 400)
              $scope.error400 = true;
            else if(statusChangePlan === 401)
              window.location.href = '/logout';
            else if (statusChangePlan === 500){
              $scope.errorMsg = 'There was an error getting your account information. Please try again later.';
              $scope.errorGeneral = true;
            }
            else{
              $scope.errorStatus = statusChangePlan;
              $scope.errorMsg = errorChangePlan.message;
              $scope.errorGeneric = true;
            }
          })
      })
      .error(function (errorGettingPlan, statusGettingPlan){
        $scope.loading = false;
        $scope.errorStatus = statusGettingPlan;
        $scope.errorMsg = errorGettingPlan.message;
        $scope.errorGeneric = true;
      })
  }
})
.controller('ChangeMsgCtrl', function ($scope, $http, UserData){

  $scope.sounds = window.SESSION_SETTINGS.soundsEnabled;

  var setMsgSettings = function (data){
    $scope.emailNotif = data.forward_messages === 1 ? true : false;
  }

  var handleError = function (err, stat){
    if(stat === 401)
      window.location.href = '/logout';
    else if (stat === 500){
      $scope.errorMsg = 'There was an error getting your account information. Please try again later.';
      $scope.errorGeneral = true;
    }
    else{
      $scope.errorStatus = stat;
      $scope.errorMsg = err.message;
      $scope.errorGeneral = true;
    }
  }

  UserData.getProfile()
    .success(setMsgSettings)
    .error(handleError);

  $scope.changeSound = function (){
    window.SESSION_SETTINGS.soundsEnabled = !$scope.sounds;
    $http.post('/changeSettings', window.SESSION_SETTINGS)
  }

  $scope.changeEmailNotif = function (){
    $http.post('/api/users/' + window.sessionUsername + '?http_method=PATCH',
      "json=" + JSON.stringify(
        {forward_messages: $scope.emailNotif ? 0: 1}),
      {
        headers: {'Content-Type':'application/x-www-form-urlencoded;'}
      })
        .success(function (success){
          UserData.refreshProfile();
        })
        .error(function (errorChangePlan, statusChangePlan){
          if(statusChangePlan === 401){
            window.location.href = '/logout';
          } else if (statusChangePlan === 500){
            $scope.errorMsg = 'There was an error getting your account information. Please try again later.';
            $scope.errorGeneral = true;
          } else {
            $scope.errorStatus = statusChangePlan;
            $scope.errorMsg = errorChangePlan.message;
            $scope.errorGeneric = true;
          }
        })
  }
})
.controller('MicrophoneCtrl', function ($scope, $http, $modal){

  $scope.calling = window.SESSION_SETTINGS.callingEnabled;

  $scope.openModal = function(){
    $scope.options = {
      backdrop: 'static',
      backdropClick: true,
      dialogFade: true,
      templateUrl: 'partials/micSettingsModal.html',
      controller: ModalInstanceCtrl,
      resolve: {}
    };

    var modalInstance = $modal.open($scope.options);
    modalInstance.result
      .then(function (){
        window.SESSION_SETTINGS.callingEnabled = $scope.calling;
        $http.post('/changeSettings', window.SESSION_SETTINGS)
      })
  }

  $scope.disableCalling = function (){
    window.SESSION_SETTINGS.callingEnabled = false;
    $http.post('/changeSettings', window.SESSION_SETTINGS);
    $scope.calling = false;
  }

})
.controller('ChangeBillHistCtrl', function ($scope, $http){
  
});

var ModalInstanceCtrl = function ($scope, $modalInstance, $modal, $http) {

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};



