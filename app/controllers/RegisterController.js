(function () {
	'use strict';

	angular.module('app').controller('RegisterController', RegisterController);

	function RegisterController(UserModel, BrandModel, Restangular, $cookies, $location, $rootScope) {
		var that = this;

		that.brands = {};

		that.getBrands = function (role) {
			if(role === 'suscriptor') {
				BrandModel.getList().then(function (brands) {
					that.brands = brands;
				});
			}
		};
	}
})();
