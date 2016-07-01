//Components service used to communicate Components REST endpoints
(function () {
    'use strict';

    angular
        .module('vsm')
        .factory('VsmService', VsmService);

    VsmService.$inject = ['$resource'];

    function VsmService($resource) {
        return $resource('api/vsm/:path', {
            path: '@path'
        });
    }
})();
