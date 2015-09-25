(function () {
	'use strict';

	angular.module('app').controller('LoginController', LoginController);

	function LoginController(UserModel, Restangular, $cookies, $location, $rootScope, SweetAlert) {
		var that = this;

		$rootScope.isLoading = false;
		// that.user.name = 'Claudio Donoso';
		// that.user.username = 'test@test.com';
		// that.user.password = '1234567890';

		that.submit = function (isValid) {
			var that = this;
			$rootScope.isLoading = true;

			if(isValid) {
				var params = '?username=' + that.user.username + '&password=' +  that.user.password + '';
				Restangular.all('login').get(params, {}, {"Content-Type": "application/json; charset=utf-8"}).then(function (user) {
					$cookies.put('login', user.sessionToken + '&' + user.objectId);
					$rootScope.name = user.name;
					$rootScope.role = user.role;
		      if(user.role === 'suscriptor') {
		      	$rootScope.Userbrands = user.brands;
		      }
					$rootScope.login = true;
					$rootScope.isLoading = false;

					$location.path('/');
				}, function (response) {
					console.log(response);
					SweetAlert.swal("Error", "Usuario o email inválidos!", "warning");
					$rootScope.isLoading = false;
				});
			}
		};
	}
})();
