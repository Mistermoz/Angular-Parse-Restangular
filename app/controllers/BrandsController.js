(function () {
	'use strict';

	angular.module('app').controller('BrandsController', BrandsController);
	function BrandsController (BrandModel, $scope) {
		var that = this;

		BrandModel.getList().then(function (brands) {
			that.allBrands = brands;
		});

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

		that.add = function () {

		};
	}
})();