(function () {
  'use strict';

  angular.module('app').factory('FunctionModel', FunctionModel);

  function FunctionModel(Restangular) {
    return Restangular.service('functions');
  }
})();