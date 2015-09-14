(function () {
	'use strict';

	angular
	.module('app', [ 'ngCookies' , 'ngRoute', 'ui.bootstrap', 'restangular', 'ngAnimate', 'checklist-model', 'ngImgCrop', 'oitozero.ngSweetAlert'])
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
			})
			.when('/brands/add', {
				templateUrl: 'app/views/brands/add.html',
				controller: 'BrandsController',
				controllerAs: 'brands'
			})
			.when('/brands/view', {
				templateUrl: 'app/views/brands/view.html',
				controller: 'BrandsController',
				controllerAs: 'brands'
			})
			.when('/brands', {
				templateUrl: 'app/views/brands/index.html',
				controller: 'BrandsController',
				controllerAs: 'brands'
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
	})
	.run(function ($location, $rootScope, stateLogin) {
		$rootScope.$on('$routeChangeStart', function(next, current) {
			stateLogin.state();
		});
	});
})();
