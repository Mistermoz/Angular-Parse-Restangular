(function () {
  'use strict';

  angular.module('app').factory('BrandModel', BrandModel);

  function BrandModel(Restangular) {
    return Restangular.service('classes/Brands');
  }
})();