(function () {
	'use strict';

	angular.module('app').controller('LoginController', LoginController);

	function LoginController(UserModel, Restangular, $cookies, $location, $rootScope) {
		var that = this;

		// that.user.name = 'Claudio Donoso';
		// that.user.username = 'test@test.com';
		// that.user.password = '1234567890';

		that.submit = function (isValid) {
			var that = this;

			if(isValid) {
				var params = '?username=' + that.user.username + '&password=' +  that.user.password + '';
				Restangular.all('login').get(params, {}, {"Content-Type": "application/json; charset=utf-8"}).then(function (user) {
					$cookies.put('login', user.sessionToken + '&' + user.objectId);
					$rootScope.name = user.name;
					$rootScope.login = true;

					$location.path('/');
				}, function (response) {
					console.log(response);
				});
			}
		};
	}
})();
