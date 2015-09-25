(function () {
	'use strict';

	angular
	.module('app', [ 'ngCookies' , 'ngRoute', 'ui.bootstrap', 'restangular', 'ngAnimate', 'checklist-model', 'ngImgCrop', 'oitozero.ngSweetAlert', 'flow'])
	.config(function ($routeProvider, RestangularProvider, PARSE, flowFactoryProvider) {
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
			.when('/brands/add', {
				templateUrl: 'app/views/brands/add.html',
				controller: 'BrandsController',
				controllerAs: 'brands'
			})
			.when('/brands/view/:objId', {
				templateUrl: 'app/views/brands/view.html',
				controller: 'BrandsController',
				controllerAs: 'brands'
			})
			.when('/brands', {
				templateUrl: 'app/views/brands/index.html',
				controller: 'BrandsController',
				controllerAs: 'brands'
			})
			.when('/projects/:brand/id/:id', {
				templateUrl: 'app/views/projects/index.html',
				controller: 'ProjectsController',
				controllerAs: 'projects'
			})
			.when('/projects/add/:brand/id/:id', {
				templateUrl: 'app/views/projects/add.html',
				controller: 'ProjectsController',
				controllerAs: 'projects'
			})
			.when('/projects/view/:brand/id/:id/project/:pid', {
				templateUrl: 'app/views/projects/view.html',
				controller: 'ProjectsController',
				controllerAs: 'projects'
			})
			.when('/medios/:brand/id/:bid/:project/id/:pid', {
				templateUrl: 'app/views/medios/index.html',
				controller: 'MediosController',
				controllerAs: 'medios'
			})
			.when('/medios/add/:brand/:project/id/:pid', {
				templateUrl: 'app/views/medios/add.html',
				controller: 'MediosController',
				controllerAs: 'medios'
			})
			.when('/medios/view/:brand/:project/:medio/id/:mid', {
				templateUrl: 'app/views/medios/view.html',
				controller: 'MediosController',
				controllerAs: 'medios'
			})
			.when('/banners/:brand/id/:bid/:project/id/:pid/:medio/id/:mid', {
				templateUrl: 'app/views/banners/index.html',
				controller: 'BannersController',
				controllerAs: 'banners'
			})
			.when('/banners/add/:brand/:project/:medio/id/:mid', {
				templateUrl: 'app/views/banners/add.html',
				controller: 'BannersController',
				controllerAs: 'banners'
			})
			.when('/banners/view/:brand/:project/:medio/:banner/id/:bnid', {
				templateUrl: 'app/views/banners/view.html',
				controller: 'BannersController',
				controllerAs: 'banners'
			})
			.when('/users', {
				templateUrl: 'app/views/users/index.html',
				controller: 'UsersController',
				controllerAs: 'users'
			})
			.when('/users/add', {
				templateUrl: 'app/views/users/add.html',
				controller: 'UsersController',
				controllerAs: 'users'
			})
			.when('/users/view/:objId', {
				templateUrl: 'app/views/users/view.html',
				controller: 'UsersController',
				controllerAs: 'users'
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
		$rootScope.isLoading = true;
		
		$rootScope.$on('$routeChangeStart', function(next, current) {
			stateLogin.state();
		});
	});
})();
