(function () {
	'use strict';

	angular.module('app').controller('BrandsController', BrandsController);
	function BrandsController (BrandModel, $scope, Restangular, $http, $rootScope, $location, SweetAlert, $routeParams) {
		var that = this;

    $scope.myImage='';
    $scope.myCroppedImage='';
    that.allBrands = [];

    var handleFileSelect = function(evt) {

      var file = evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.myImage = evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };

    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

    if($location.path() == '/brands') {
      BrandModel.getList().then(function (brands) {
        if($rootScope.role === 'administrador') {
          that.allBrands = brands;
        }else {
          angular.forEach(brands, function (brand, key1) {
            angular.forEach($rootScope.Userbrands , function (userBrand, key2) {
              if(brand.name === userBrand) {
                that.allBrands.push(brand);
              }
            });
          });
        }
        
        $rootScope.isLoading = false;
      });
    }

    if($location.path() == '/brands/add') {
      that.brandAdd = {};
      that.showView = true;
      $rootScope.isLoading = false;

      that.add = function (isValid) {
        var that = this, fd = '';
        $rootScope.isLoading = true;

        if(isValid) {
          var img =  $scope.myCroppedImage.replace(/^data:image\/(png|jpeg);base64,/, '');

          fd = {__ContentType : "image/jpeg", base64 : img};

          Restangular.one('files/pic.jpg').customPOST(fd, undefined, undefined, {'Content-Type': 'text/plain'}).then(function (response) {
            that.brandAdd.image = {"name": response.url, "__type": "File"};
            that.brandAdd.createdBy = $rootScope.name;
            BrandModel.post(that.brandAdd).then(function (brand) {
              $location.path('/brands');
              $rootScope.isLoading = false;
            }, function (error) {
              console.log(error);
              $rootScope.isLoading = false;
            });
          }, function (error) {
            console.log(error);
            $rootScope.isLoading = false;
          });
        }else {
          $rootScope.isLoading = false;
        }
      };
    }

    if($location.path().indexOf("/brands/view") > -1 ) {
      that.brandView = {};
      that.editImage = false;

      BrandModel.one($routeParams.objId).get().then(function (brandObejct) {
        that.brandView = brandObejct;
        that.showView = true;
        $rootScope.isLoading = false;
      }, function (error) {
        console.log(error);
      });

      that.edit = function (isValid) {
        $rootScope.isLoading = true;

        if(isValid) {
          if(that.editImage && $scope.myCroppedImage !== '') {
            var img =  $scope.myCroppedImage.replace(/^data:image\/(png|jpeg);base64,/, ''), fd = '';

            fd = {__ContentType : "image/jpeg", base64 : img};

            Restangular.one('files/pic.jpg').customPOST(fd, undefined, undefined, {'Content-Type': 'text/plain'}).then(function (response) {
              that.brandView.image = {"name": response.url, "__type": "File"};
              that.brandView.put().then(function (rsp) {
                $scope.myCroppedImage = '';
                $scope.myImage = '';
                that.editImage = false;
                $rootScope.isLoading = false;
                SweetAlert.swal("Edición Satisfactoria");
              }, function (error) {
                console.log(error);
                $rootScope.isLoading = false;
              });
            }, function (error) {
              console.log(error);
              $rootScope.isLoading = false;
            });
          }else {
              that.brandView.put().then(function (rsp) {
                SweetAlert.swal("Edición Satisfactoria");
                $rootScope.isLoading = false;
            }, function (error) {
              $rootScope.isLoading = false;
              console.log(error);
            });
          }
        }else {
          $rootScope.isLoading = false;
        }
      };
    }

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
          BrandModel.one(obj).remove().then(function (response) {
            console.log(response);
            that.allBrands.splice(idx, 1);
            SweetAlert.swal("Booyah!");
          }, function (error) {
            console.log(error);
          });
        }
      });
      e.preventDefault();
    };

    that.verBrand = function (e, objId) {
      $rootScope.isLoading = true;

      $location.path('/brands/view/' + objId);
      e.preventDefault();
    };
	}
})();