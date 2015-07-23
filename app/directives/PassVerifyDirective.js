(function (){
	'use strict';

	angular.module('app').directive('passVerify', PassVerifyDirective);

	function PassVerifyDirective () {
		return {
      require: "ngModel",
      scope: {
          otherModelValue: "=compareTo"
      },
      link: function(scope, element, attributes, ngModel) {
          ngModel.$validators.compareTo = function(modelValue) {
              return modelValue == scope.otherModelValue;
          };

          scope.$watch("otherModelValue", function() {
              ngModel.$validate();
          });
      }
    };
	}
})();