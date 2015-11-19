 // by dribehance <dribehance.kksdapp.com>
 // EventHandle
 angular.module("kkshop").factory("appServices", function($rootScope, $window, $location, errorServices, toastServices) {
     var routeChangeStart = function(e) {
         // do something white routechangestart,eg:
         // toastServices.show();
     }
     var routeChangeSuccess = function(e, currentRoute, prevRoute) {
         // do something white routechangesuccess,eg:
         toastServices.hide();
         errorServices.hide();
         navBarHandler(e, currentRoute, prevRoute);
     }
     var routeChangeError = function(e, currentRoute, prevRoute) {
         // do something white routechangesuccess,eg:
         // $rootScope.back();
     }
     var navBarHandler = function(e, currentRoute, prevRoute) {
         // handle navbar
         // var _navbars_b = ["/index", "/licai", "/me", "/", "/signin"];
         // if (!_navbars_b.contains($location.path())) {
         //     $rootScope.navbar.bottom = false;
         // } else {
         //     $rootScope.navbar.bottom = true;
         // }
     }
     var onBackKeyDown = function() {
         $rootScope.$apply(function() {
             $rootScope.back();
         });
     }
     return {
         init: function() {
             // handle android backkeydown
             document.addEventListener("backbutton", onBackKeyDown, false);
             // backaction
             $rootScope.back = function() {
                 $window.history.back();
             }

             // init navbar 
             $rootScope.navbar = {
                 top: true,
                 bottom: false
             };

             // {2:rootScope} binding
             $rootScope.$on("$routeChangeStart", routeChangeStart);
             $rootScope.$on("$routeChangeSuccess", routeChangeSuccess);
             $rootScope.$on("$routeChangeError", routeChangeError);
         }
     }
 });
