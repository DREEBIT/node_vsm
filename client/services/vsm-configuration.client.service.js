//Components service used to communicate Components REST endpoints
(function () {
    'use strict';

    angular
        .module('vsm')
        .factory('VsmConfigurationService', VsmConfigurationService);

    VsmConfigurationService.$inject = ['$resource'];

    function VsmConfigurationService($resource) {
        return $resource('api/vsm-configuration', {
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
})();