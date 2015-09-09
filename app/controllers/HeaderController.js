(function () {
	'use strict';

	angular.module('app').controller('HeaderController', HeaderController);

	function HeaderController ($rootScope, Restangular, $cookies, $location, stateLogin) {
		var that = this;

		that.logout = function () {
			var that = this;

			stateLogin.logout();
		};
	}
})();