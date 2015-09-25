(function () {
	'use strict';

	angular.module('app').directive('back', backHistory);

	function backHistory ($window, $rootScope, $location) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                if(attrs.home) {
                  $location.path('/');
                  scope.$apply();
                }else {
                  $window.history.back();
                }

                if(attrs.noLoad !== true) {
                    $rootScope.isLoading = false;   
                }
            });
        }
    };
  }
})();