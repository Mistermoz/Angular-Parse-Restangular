(function () {
  'use strict';

  angular.module('app').factory('RoleModel', RoleModel);

  function RoleModel(Restangular) {
    return Restangular.service('roles');
  }
})();