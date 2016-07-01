(function () {
    'use strict';

    // Components controller
    angular
        .module('vsm')
        .controller('VsmConfigurationController', VsmConfigurationController);

    VsmConfigurationController.$inject = ['$scope', '$state', 'vsmConfigurationResolve', 'toaster', 'VsmService'];

    function VsmConfigurationController($scope, $state, vsmConfiguration, toaster, VsmService) {
        var vm = this;

        vm.vsmConfiguration = vsmConfiguration;
        vm.vsmConfigurationSuccess = false;
        vm.protocols = [
            { key: 'http', title: 'HTTP'},
            { key: 'https', title: 'HTTPS'},
            { key: 'smtp', title: 'SMTP'}
        ];
        vm.form = {};
        vm.save = save;
        vm.testConfiguration = testConfiguration;

        function testConfiguration() {
            VsmService.get({
                path: "auth/identity"
            }, function(identity) {
                vm.vsmConfigurationSuccess = true;
            }, function(error) {
                toaster.error(
                    error && error.data && error.data.message ? error.data.message : 'An error occurs'
                );
            });
        }

        function save() {
            vm.vsmConfiguration.$update(successCallback, errorCallback);
            vm.vsmConfigurationSuccess = false;

            function successCallback(res) {
                toaster.success(
                    'VSM Configuration was saved successfully'
                );
                vm.form.vsmConfigurationForm.$setPristine();
            }

            function errorCallback(res) {
                toaster.error(
                    'An error occurs'
                );
            }
        }
    }
})();
