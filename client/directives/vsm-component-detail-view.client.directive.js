(function () {
    'use strict';

    angular
        .module('vsm')
        .directive('vsmComponentDetailView', vsmComponentDetailView);

    vsmComponentDetailView.$inject = [/*Example: '$state', '$window' */];

    function vsmComponentDetailView(/*Example: $state, $window */) {
        return {
            templateUrl: 'modules/vsm/client/views/vsm-component-detail-view.client.view.html',
            scope: {
                vsmComponent: '=component'
            },
            restrict: 'E',
            link: function postLink(scope, element, attrs) {

            },
            controller: function($scope, $filter) {
                $scope.hasComponentImage = function () {
                    if ($scope.vsmComponent && $scope.vsmComponent.componentImage && $scope.vsmComponent.componentImage.linkTemplate) {
                        return true;
                    }

                    return false;
                };

                $scope.getComponentImage = function () {
                    return $scope.vsmComponent.componentImage.linkTemplate.replace('{{modifiers}}', 'w100-h100-cfill/');
                };

                $scope.blacklist = function (item) {
                    var blacklist = [
                        'product',
                        'manufacturer',
                        'image',
                        'catalogNo',
                        'status'
                    ];
                    return blacklist.indexOf(item.index) == -1;
                };
                
                $scope.getFormatedAttributeValue = function (attribute, vsmComponent) {
                    if (!vsmComponent[attribute.index]) {
                        return '-'
                    }

                    switch (attribute.type) {
                        case 'date':
                            return $filter('date')(vsmComponent[attribute.index]);
                            break;
                        case 'float':
                            return $filter('number')(vsmComponent[attribute.index]);
                            break;
                        case 'exp':
                            return vsmComponent[attribute.index];
                            break;
                        case 'bool':
                            if (vsmComponent[attribute.index] === false) {
                                return 'No';
                            }
                            if (vsmComponent[attribute.index] === true) {
                                return 'Yes';
                            }
                            break;
                        case 'client':
                            return vsmComponent[attribute.index].name;
                            break;
                        default:
                            return vsmComponent[attribute.index];
                            break;

                    }
                };
            }
        };
    }
})();
