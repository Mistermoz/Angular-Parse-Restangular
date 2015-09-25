(function () {
	'use strict';

	angular.module('app').controller('BannersController', BannersController);

	function BannersController(BannerModel, $cookies, $location, $rootScope, Restangular, $scope, $routeParams, SweetAlert) {
		var that = this;

		$rootScope.isLoading = false;

		$scope.myImage='';
    $scope.myCroppedImage='';

		that.brand = $routeParams.brand;
		that.brandId = $routeParams.bid;
		that.project = $routeParams.project;
		that.projectId = $routeParams.pid;
		that.medio = $routeParams.medio;
		that.medioId = $routeParams.mid;
		that.bannerName = $routeParams.banner;
		that.bannerId = $routeParams.bnid;

		that.bannerLoad = false;
		that.folder = '';

		if($location.path().indexOf("/banners/add") > -1)  {
      $rootScope.isLoading = false;

      that.add = function (isValid) {
        var that = this, fd = '';
        $rootScope.isLoading = true;

        if(isValid) {
			 		that.bannerAdd.width = that.bWidth;
			 		that.bannerAdd.height = that.bHeight;
					that.bannerAdd.createdBy = $rootScope.name;
          that.bannerAdd.medio = {"__type":"Pointer","className":"Medios","objectId": that.medioId};
          BannerModel.post(that.bannerAdd).then(function (brand) {
            $location.path('/banners/' + that.brand + '/id/' + that.brandId + '/' + that.project + '/id/' + that.projectId + '/' + that.medio + '/id/' + that.medioId + '');
            $rootScope.isLoading = false;
          }, function (error) {
            console.log(error);
            $rootScope.isLoading = false;
          });
				}else {
					$rootScope.isLoading = false;
				}
      };
    }

    if($location.path().indexOf("/banners/view") > -1)  {
    	that.bannerView = {};

      BannerModel.one($routeParams.bnid).get().then(function (bannerObejct) {
        that.bannerView = bannerObejct;
        $rootScope.isLoading = false;
      }, function (error) {
        console.log(error);
      });

      that.edit = function (isValid) {
        var that = this, fd = '', medidas = 0;
        $rootScope.isLoading = true;

        if(isValid) {
        	medidas = that.bannerView.description.split('x');
					that.bWidth = medidas[0];

					if(medidas[1] !== undefined) {
						that.bHeight = medidas[1];
					}
			 		that.bannerView.width = that.bWidth;
			 		that.bannerView.height = that.bHeight;

			 		that.bannerView.put().then(function (rsp) {
          	$rootScope.isLoading = false;
          	SweetAlert.swal("Edición Satisfactoria");
		      }, function (error) {
		        console.log(error);
		        $rootScope.isLoading = false;
		      });
				}else {
					$rootScope.isLoading = false;
				}
      };
    }

    $scope.$on('$viewContentLoaded', function() {
	    if(that.index) {
	    	that.allBanners = [];

	      Restangular.all('classes/Banners').getList({include: "medio"}).then(function (banners) {
	      	angular.forEach(banners, function (value, key) {
	      		if(value.medio.name === that.medio) {
	      			that.allBanners.push(value);
	      		}
	      	});
	        $rootScope.isLoading = false;
	      });
	    }
		});

		that.descriptionKeyUp = function () {
			var that = this;

			that.bWidth = 200;
			that.bHeight = 200;
			var medidas = 0;

			medidas = that.bannerAdd.description.split('x');
			that.bWidth = medidas[0];

			if(medidas[1] !== undefined) {
				that.bHeight = medidas[1];
			}
		};

		that.getFolder = function (message) {
			var that = this, messageJSON = JSON.parse(message);

			that.bannerView.folder = 'assets/files/' + messageJSON.folder + '/' + that.bannerView.description + '.html';
		};

		that.delete = function (e, obj, idx) {
      var that = this;

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
          BannerModel.one(obj).remove().then(function (response) {
            that.allBanners.splice(idx, 1);
            SweetAlert.swal("Banner Borrado exitosamente.");
          }, function (error) {
            console.log(error);
          });
        }
      });
      e.preventDefault();
    };
	}
})();