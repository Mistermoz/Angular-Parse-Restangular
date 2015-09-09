(function () {
	'use strict';

	angular.module('app').controller('RegisterController', RegisterController);

	function RegisterController(UserModel, BrandModel, Restangular, $cookies, $location, $rootScope) {
		var that = this;
		that.user = {};

		that.getBrands = function (role) {
			if(role === 'suscriptor') {
				BrandModel.getList().then(function (brands) {
					that.brands = brands;
				});
			}
		};

		that.submit = function (isValid) {
			var that = this;

			if(isValid) {
				that.user.username = that.user.name;
				
				UserModel.post(that.user).then(function (response) {

				}, function (response) {
					if(response.objectId !== null) {
	          console.log('ready');
	        }else {
	          that.error('Error en envío, por favor intente nuevamente');
	        }
				});
			}
		};
	}
})();
