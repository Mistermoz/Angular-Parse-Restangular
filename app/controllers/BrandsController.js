(function () {
	'use strict';

	angular.module('app').controller('BrandsController', BrandsController);
	function BrandsController (BrandModel, $scope, Restangular, $http, $rootScope, $location, SweetAlert, $routeParams) {
		var that = this;

    $scope.myImage='';
    $scope.myCroppedImage='';

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
        that.allBrands = brands;
        $rootScope.isLoading = false;
      });
    }

    if($location.path() == '/brands/add') {
      that.name = '';
      that.description = '';
      that.showView = true;
      $rootScope.isLoading = false;

      that.add = function () {
        var that = this, fd = '';
        $rootScope.isLoading = true;

        var img =  $scope.myCroppedImage.replace(/^data:image\/(png|jpeg);base64,/, '');

        fd = {__ContentType : "image/jpeg", base64 : img};

        Restangular.one('files/pic.jpg').customPOST(fd, undefined, undefined, {'Content-Type': 'text/plain'}).then(function (response) {
          var newBrand = {"name": that.name, "description": that.description, image: {"name": response.url, "__type": "File"}, createdBy: $rootScope.name};
          BrandModel.post(newBrand).then(function (brand) {
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
      };
    }

    if($location.path().indexOf("/brands/view") > -1 ) {
      that.view = {};
      that.editImage = false;

      BrandModel.one($routeParams.objId).get().then(function (brandObejct) {
        that.view = brandObejct;
        that.showView = true;
        $rootScope.isLoading = false;
      }, function (error) {
        console.log(error);
      });

      that.edit = function () {
        $rootScope.isLoading = true;

        if(that.editImage && $scope.myCroppedImage !== '') {
          var img =  $scope.myCroppedImage.replace(/^data:image\/(png|jpeg);base64,/, ''), fd = '';

          fd = {__ContentType : "image/jpeg", base64 : img};

          Restangular.one('files/pic.jpg').customPOST(fd, undefined, undefined, {'Content-Type': 'text/plain'}).then(function (response) {
            that.view.image = {"name": response.url, "__type": "File"};
            that.view.put().then(function (rsp) {
              $scope.myCroppedImage = '';
              $scope.myImage = '';
              that.editImage = false;
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
            that.view.put().then(function (rsp) {
              console.log(rsp);
              $rootScope.isLoading = false;
          }, function (error) {
            $rootScope.isLoading = false;
            console.log(error);
          });
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
         closeOnConfirm: false}, 
      function(response){ 
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