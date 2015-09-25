(function () {
  'use strict';

  angular.module('app').factory('BannerModel', BannerModel);

  function BannerModel(Restangular) {
    return Restangular.service('classes/Banners');
  }
})();