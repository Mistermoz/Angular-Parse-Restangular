(function () {
	'use strict';

	angular.module('app').controller('MediosController', MediosController);

	function MediosController(MedioModel, $cookies, $location, $rootScope, Restangular, $routeParams, $scope, SweetAlert) {
		var that = this;

		$rootScope.isLoading = true;

		$scope.myImage='';
    $scope.myCroppedImage='';

		that.brand = $routeParams.brand;
		that.brandId = $routeParams.bid;
		that.project = $routeParams.project;
		that.projectId = $routeParams.pid;
		that.medioName = $routeParams.medio;
		that.medioId = $routeParams.mid;
		
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

		if($location.path().indexOf("/medios/add") > -1)  {
      $rootScope.isLoading = false;

      that.add = function (isValid) {
        var that = this, fd = '';
        $rootScope.isLoading = true;

        if(isValid) {
					var img =  $scope.myCroppedImage.replace(/^data:image\/(png|jpeg);base64,/, '');

	        fd = {__ContentType : "image/jpeg", base64 : img};

	        Restangular.one('files/pic.jpg').customPOST(fd, undefined, undefined, {'Content-Type': 'text/plain'}).then(function (response) {
	          that.medioAdd.image = {"name": response.url, "__type": "File"};
	          that.medioAdd.createdBy = $rootScope.name;
	          that.medioAdd.project = {"__type":"Pointer","className":"Projects","objectId": that.projectId};
	          MedioModel.post(that.medioAdd).then(function (brand) {
	            $location.path('/medios/' + that.brand + '/id/' + that.brandId + '/' + that.project + '/id/' + that.projectId + '');
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

    if($location.path().indexOf("/medios/view") > -1)  {
      that.medioView = {};
      that.editImage = false;

      MedioModel.one($routeParams.mid).get().then(function (medioObejct) {
        that.medioView = medioObejct;
        $rootScope.isLoading = false;
      }, function (error) {
        console.log(error);
      });

      that.edit = function (isValid) {
        var that = this, fd = '';
        $rootScope.isLoading = true;

        if(isValid) {
        	if(that.editImage && $scope.myCroppedImage !== '') {
						var img =  $scope.myCroppedImage.replace(/^data:image\/(png|jpeg);base64,/, '');

		        fd = {__ContentType : "image/jpeg", base64 : img};

		        Restangular.one('files/pic.jpg').customPOST(fd, undefined, undefined, {'Content-Type': 'text/plain'}).then(function (response) {
		          that.medioView.image = {"name": response.url, "__type": "File"};
		          that.medioView.put().then(function (rsp) {
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
						that.medioView.put().then(function (rsp) {
              $scope.myCroppedImage = '';
              $scope.myImage = '';
              that.editImage = false;
              $rootScope.isLoading = false;
              SweetAlert.swal("Edición Satisfactoria");
            }, function (error) {
              console.log(error);
              $rootScope.isLoading = false;
            });
					}
				}else {
					$rootScope.isLoading = false;
				}
      };
    }

		$scope.$on('$viewContentLoaded', function() {
	    if(that.index) {
	    	that.allMedios = [];

	      Restangular.all('classes/Medios').getList({include: "project"}).then(function (medios) {
	      	angular.forEach(medios, function (value, key) {
	      		if(value.project.name === that.project) {
	      			that.allMedios.push(value);
	      		}
	      	});
	        $rootScope.isLoading = false;
	      });
	    }
		});

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
          MedioModel.one(obj).remove().then(function (response) {
            that.allMedios.splice(idx, 1);
            SweetAlert.swal("Medio Borrado exitosamente.");
          }, function (error) {
            console.log(error);
          });
        }
      });
      e.preventDefault();
    };
	}
})();