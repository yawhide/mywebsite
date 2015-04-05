'use strict';

angular.module('mainApp.mainCtrl', [])

.controller('MainCtrl', function ($scope, $http){
  $scope.bonified = false;
  $scope.projectyawhide = false;
  $scope.chatpush = false;
  $scope.textnow = false;
  $scope.sideBarClosed = true;

  $scope.closeSideBar = function (){
    $scope.sideBarClosed = !$scope.sideBarClosed;
  }
})


