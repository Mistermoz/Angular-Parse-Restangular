(function () {
	'use strict';

	angular.module('app').directive('emailValidator', emailValidator);

	function emailValidator () {
		return {
			restrict: 'A',
			require: 'ngModel',

			link: function (scope, element, attr, ctrl) {
				function customValidator (ngModelValue) {
					if(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(ngModelValue)) {
						ctrl.$setValidity('emailValid', true);
					} else {
						ctrl.$setValidity('emailValid', false);
					}

					return ngModelValue;
				}

				ctrl.$parsers.push(customValidator);
			}
		};
	}
})();