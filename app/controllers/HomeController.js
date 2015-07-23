(function () {
	'use strict';

	angular.module('app').controller('HomeController', HomeController);

	function HomeController(UserModel, $cookies, $location, $rootScope, Restangular) {
		var that = this;

		that.user = {};

		// UserModel.post(that.user).then(function (response) {
		//  console.log(response);
		// });

		$rootScope.token = $cookies.get('login');

		if($rootScope.token === undefined) {
				that.title = 'Angular';
				$location.path('/login');
		}else {
			if($rootScope.name === undefined) {
				var data = $rootScope.token.split('&');
				Restangular.all('users/me').customGET(false,false, {"X-Parse-Session-Token": "" + data[0] + ""}).then(function (user) {
		      that.title = user.name;
		    }, function (response){
		    });
			}else {
				that.title = $rootScope.name;
			}	
		}
	}
})();
