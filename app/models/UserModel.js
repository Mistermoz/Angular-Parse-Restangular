(function () {
  'use strict';

  angular.module('app').factory('UserModel', UserModel);

  function UserModel(Restangular) {
    return Restangular.service('classes/_User');
  }
})();