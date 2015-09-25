(function () {
  'use strict';

  angular.module('app').directive('validFile', validFile);

  function validFile ($window, $rootScope, $location) {
    return {
      require:'ngModel',
      link:function(scope,el,attrs,ngModel){
        el.bind('change',function(){
          scope.$apply(function(){
            ngModel.$setViewValue(el.val());
            ngModel.$render();
          });
        });
      }
    };
  }
})();