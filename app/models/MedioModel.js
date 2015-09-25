(function () {
  'use strict';

  angular.module('app').factory('MedioModel', MedioModel);

  function MedioModel(Restangular) {
    return Restangular.service('classes/Medios');
  }
})();