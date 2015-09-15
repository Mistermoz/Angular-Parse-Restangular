(function () {
	'use strict';

	angular.module('app').controller('UsersController', UsersController);

	function UsersController(UserModel, BrandModel, Restangular, $cookies, $location, $rootScope, $routeParams, RoleModel) {
		var that = this;
		that.user = {};

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
					
					UserModel.post(that.user).then(function (response) {
						if(response.objectId !== null) {
		          $rootScope.isLoading = false;
		          $location.path('/users');
		        }else {
		          that.error('Error en envío, por favor intente nuevamente');
		        }
					}, function (error) {
						that.error('Error en envío, por favor intente nuevamente');
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

					if(that.user.role === 'administrador') {

			      RoleModel.one('itoxnE7j4Y').get().then(function (roleObejct) {
			      	data = roleObejct;
			      	data.users = {
			          "__op": "AddRelation",
			          "objects": [
			            {
			              "__type": "Pointer",
			              "className": "_User",
			              "objectId": $routeParams.objId
			            }
			          ]
			      	};

			      	data.put().then( function (rsp) {
			      		console.log(rsp);
			      	}, function (error) {
			      		console.log(error);
			      	});
			      });
					}
					
					// that.user.put().then(function (rsp) {
     //          if(that.user.role === 'Administrador') {
					// 			rel = { "users": {
					//           "__op": "AddRelation",
					//           "objects": [
					//             {
					//               "__type": "Pointer",
					//               "className": "_User",
					//               "objectId": $routeParams
					//             }
					//           ]
					//         }
					//       };

					//       RoleModel.one('itoxnE7j4Y').get().then(function (roleObejct) {
					//       	console.log(roleObejct);
					//       });
					// 		}

     //          $rootScope.isLoading = false;
     //      }, function (error) {
     //        $rootScope.isLoading = false;
     //        console.log(error);
     //      });
				}else {
					$rootScope.isLoading = false;
				}
			};
		}
	}
})();
