//Components service used to communicate Components REST endpoints
(function () {
    'use strict';

    angular
        .module('vsm')
        .factory('VsmImportService', VsmImportService);

    VsmImportService.$inject = ['$resource'];

    function VsmImportService($resource) {
        return $resource('api/vsm-import/components');
    }
})();
