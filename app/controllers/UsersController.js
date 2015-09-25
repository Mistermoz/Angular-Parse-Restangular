(function () {
	'use strict';

	angular.module('app').controller('UsersController', UsersController);

	function UsersController(UserModel, BrandModel, Restangular, $cookies, $location, $rootScope, $routeParams, RoleModel, FunctionModel, SweetAlert) {
		var that = this, ck = $cookies.get('login').split('&');
		that.user = {};
		that.brands = {};

		that.verUser = function (e, objId) {
      $rootScope.isLoading = true;

      $location.path('/users/view/' + objId);
      e.preventDefault();
    };

    that.getBrands = function (role) {
			if(role === 'suscriptor') {
				BrandModel.getList().then(function (brands) {
					that.brands = brands;
				});
			}
		};
 
		that.delete = function (e, objId, index) {
			var that = this, user = {id : objId};
			$rootScope.isLoading = true;

			SweetAlert.swal({
         title: "Estas seguro?",
         text: "No podrás arrepentirte!",
         type: "warning",
         showCancelButton: true,
         confirmButtonColor: "#DD6B55",
         confirmButtonText: "Si, eliminar!",
         closeOnConfirm: false
       }, function(response){ 
        if(response) {
          Restangular.all('functions/deleteUser').customPOST(user,false, false, {"X-Parse-Session-Token": "" + ck[0] + ""}).then(function (response) {
					$rootScope.isLoading = false;
					that.allUsers.splice(index, 1);
					SweetAlert.swal("Usuario eliminado!");
				}, function (error) {
					console.log(error);
					$rootScope.isLoading = false;
				});
        }else {
        	$rootScope.isLoading = false;
        }
      });

			e.preventDefault();
		};

		if($location.path() == '/users') {
      UserModel.getList().then(function (users) {
        that.allUsers = users;
        $rootScope.isLoading = false;
      });
    }

    if($location.path() == '/users/add') {
    	$rootScope.isLoading = false;

			that.add = function (isValid) {
				var that = this;
				$rootScope.isLoading = true;

				if(isValid) {
					that.user.username = that.user.name;
					var ck = $cookies.get('login').split('&');
					UserModel.post(that.user, false, {"X-Parse-Session-Token": "" + ck[0] + ""}).then(function (response) {
						if(response.objectId !== null) {
		          $rootScope.isLoading = false;
		          Restangular.all('functions/addRoleUser').customPOST(that.user,false, false, {"X-Parse-Session-Token": "" + ck[0] + ""}).then(function (response) {
								$rootScope.isLoading = false;
								$location.path('/users');
							}, function (error) {
								console.log(error);
								$rootScope.isLoading = false;
							});
		        }else {
		          that.error= 'Error en envío, por favor intente nuevamente';
		          console.log(response);
		        }
					}, function (error) {
						that.error = 'Error en envío, por favor intente nuevamente';
						console.log(error);
						$rootScope.isLoading = false;
					});
				}else {
					$rootScope.isLoading = false;
				}
			};
		}

		if($location.path().indexOf("/users/view") > -1 ) {
			UserModel.one($routeParams.objId).get().then(function (userObejct) {
        that.user = userObejct;
        that.showView = true;
        $rootScope.isLoading = false;

        that.getBrands(userObejct.role);
      }, function (error) {
        console.log(error);
      });

      that.edit = function (isValid) {
				var that = this, data = {};
				$rootScope.isLoading = true;

				if(isValid) {
					that.user.username = that.user.name;
          Restangular.all('functions/modifyUser').customPOST(that.user,false, false, {"X-Parse-Session-Token": "" + ck[0] + ""}).then(function (response) {
						$rootScope.isLoading = false;
						$location.path('/users');
					}, function (error) {
						console.log(error);
						$rootScope.isLoading = false;
					});
				}else {
					$rootScope.isLoading = false;
				}
			};
		}
	}
})();
