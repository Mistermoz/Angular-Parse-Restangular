(function () {
	'use strict';

	angular.module('app').directive('back', backHistory);

	function backHistory ($window) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                $window.history.back();
            });
        }
    };
  }
})();