(function () {
	'use strict';

	angular.module('app').factory('stateLogin', stateLogin);

	function stateLogin ($cookies, Restangular, $rootScope, $location) {
		var loginFunctions = {
			state: function () {
				if($cookies.get('login') === undefined) {
					$rootScope.login = false;
					$location.path('/login');

					return false;
				} else {
					if($rootScope.name === undefined) {
						var data = $cookies.get('login').split('&');
						Restangular.all('users/me').customGET(false,false, {"X-Parse-Session-Token": "" + data[0] + ""}).then(function (user) {
				      $rootScope.name = user.name;
				      $rootScope.login = true;
				      
				      if($location.path() == '/login') {
								$location.path('/');
							}

				    }, function (response){
				    });
					}else {
						$rootScope.login = true;

						if($location.path() == '/login') {
							$location.path('/');
						}
					}

					return true;
				}
			},

			logout: function () {
				var data = $cookies.get('login').split('&');
				Restangular.all('logout').post('', {}, {"Content-Type": "application/json; charset=utf-8", "X-Parse-Session-Token" : "" + data[0] +""}).then(function (user) {
					$cookies.remove('login');
					$rootScope.login = false;
					$rootScope.name = '';
					$location.path('/login');

				}, function (response) {
				});
			}
		};

		return loginFunctions;
	}
})();