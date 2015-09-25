(function () {
	'use strict';

	angular.module('app').controller('ProjectsController', ProjectsController);

	function ProjectsController(ProjectModel, $cookies, $location, $rootScope, Restangular, $routeParams, $scope, SweetAlert) {
		var that = this;

		that.proj = {};
		that.brand = $routeParams.brand;
		that.brandId = $routeParams.id;
		that.allProjects = [];
		$rootScope.isLoading = false;

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

		if($location.path().indexOf("/projects/add") > -1)  {
      $rootScope.isLoading = false;

      that.add = function (isValid) {
        var that = this, fd = '';
        $rootScope.isLoading = true;

        if(isValid) {
					var img =  $scope.myCroppedImage.replace(/^data:image\/(png|jpeg);base64,/, '');

	        fd = {__ContentType : "image/jpeg", base64 : img};

	        Restangular.one('files/pic.jpg').customPOST(fd, undefined, undefined, {'Content-Type': 'text/plain'}).then(function (response) {
	          that.proj.image = {"name": response.url, "__type": "File"};
	          that.proj.createdBy = $rootScope.name;
	          that.proj.brand = {"__type":"Pointer","className":"Brands","objectId": that.brandId};
	          ProjectModel.post(that.proj).then(function (brand) {
	            $location.path('/projects/' + that.brand + '/id/' + that.brandId + '');
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

    if($location.path().indexOf("/projects/view") > -1)  {
      that.projView = {};
      that.editImg = false;

      ProjectModel.one($routeParams.pid).get().then(function (projectObejct) {
        that.projView = projectObejct;
        $rootScope.isLoading = false;
      }, function (error) {
        console.log(error);
      });

      that.edit = function (isValid) {
        var that = this, fd = '';
        $rootScope.isLoading = true;

        if(isValid) {
        	if(that.editImg && $scope.myCroppedImage !== '') {
						var img =  $scope.myCroppedImage.replace(/^data:image\/(png|jpeg);base64,/, '');

		        fd = {__ContentType : "image/jpeg", base64 : img};

		        Restangular.one('files/pic.jpg').customPOST(fd, undefined, undefined, {'Content-Type': 'text/plain'}).then(function (response) {
		          that.projView.image = {"name": response.url, "__type": "File"};
		          that.projView.put().then(function (rsp) {
	              $scope.myCroppedImage = '';
	              $scope.myImage = '';
	              that.editImg = false;
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
						that.projView.put().then(function (rsp) {
              $scope.myCroppedImage = '';
              $scope.myImage = '';
              that.editImg = false;
              $rootScope.isLoading = false;
              SweetAlert.swal("Edición Satisfactoria");
            }, function (error) {
              console.log(error);
              $rootScope.isLoading = false;
            });
						$rootScope.isLoading = false;
					}
				}
      };
    }

		$scope.$on('$viewContentLoaded', function() {
	    if(that.index) {
	      Restangular.all('classes/Projects').getList({include: "brand"}).then(function (projects) {
	      	angular.forEach(projects, function (value, key) {
	      		if(value.brand.name === that.brand) {
	      			that.allProjects.push(value);
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
          ProjectModel.one(obj).remove().then(function (response) {
            that.allProjects.splice(idx, 1);
            SweetAlert.swal("Projecto Borrado exitosamente.");
          }, function (error) {
            console.log(error);
          });
        }
      });
      e.preventDefault();
    };
	}
})();