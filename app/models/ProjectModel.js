(function () {
  'use strict';

  angular.module('app').factory('ProjectModel', ProjectModel);

  function ProjectModel(Restangular) {
    return Restangular.service('classes/Projects');
  }
})();