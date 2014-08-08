'use strict';

var app = angular.module('mainApp', [
  'ngRoute',
  'mainApp.factory',
  'mainApp.directives',
  'mainApp.mainCtrl',
  'ui.bootstrap'
])
.config(function ($routeProvider, $locationProvider){
  $routeProvider
    .when('/', {templateUrl: 'partials/main.html', controller: 'MainCtrl'})
    .otherwise({templateUrl: 'partials/main.html', controller: 'MainCtrl'});
})