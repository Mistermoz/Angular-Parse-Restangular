(function () {
	'use strict';

	angular
	.module('app', [ 'ngCookies' , 'ngRoute', 'ui.bootstrap', 'restangular', 'ngAnimate'])
	.config(function ($routeProvider, RestangularProvider, PARSE) {
		$routeProvider
			.when('/', {
				templateUrl: 'app/views/home.html',
				controller: 'HomeController',
				controllerAs: 'home'
			})
			.when('/login', {
				templateUrl: 'app/views/login.html',
				controller: 'LoginController',
				controllerAs: 'login'
			})
			.when('/registro', {
				templateUrl: 'app/views/register.html',
				controller: 'RegisterController',
				controllerAs: 'register'
			});
		RestangularProvider
			.setBaseUrl('https://api.parse.com/1')
			.setDefaultHeaders({
				'X-Parse-Application-Id': PARSE.appId,
				'X-Parse-REST-API-Key': PARSE.apiKey
			})
			.setRestangularFields({ id: 'objectId' })
			.addResponseInterceptor(function(data, operation) {
				if (operation === 'getList') {
					return data.results;
				}

				return data;
			});
	});
})();
