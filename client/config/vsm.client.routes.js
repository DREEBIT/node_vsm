(function () {
    'use strict';

    angular
        .module('vsm')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider) {
        $stateProvider
            .state('app.settings.vsm-configuration', {
                url: '/vsm-configuration',
                templateUrl: 'modules/vsm/client/views/vsm-configuration.client.view.html',
                controller: 'VsmConfigurationController',
                controllerAs: 'vm',
                resolve: {
                    vsmConfigurationResolve: getVsmConfiguration
                },
                data: {
                    pageTitle: 'VSM Configuration'
                }
            });
    }

    getVsmConfiguration.$inject = ['VsmConfigurationService'];

    function getVsmConfiguration(VsmConfigurationService) {
        return VsmConfigurationService.get().$promise;
    }
})();
