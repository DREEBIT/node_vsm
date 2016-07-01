(function () {
    'use strict';

    angular
        .module('vsm')
        .run(menuConfig);

    menuConfig.$inject = ['Menus'];

    function menuConfig(Menus) {

        // Add menu entry
        // menuId, title, state, position, icon class
        Menus.addMenuItem(
            'sidebar',
            'Settings',
            'app.settings',
            1000,
            'fa fa-cog'
        );

        // Add sub item
        // menuId, title, parent state, state, position, icon class
        Menus.addSubMenuItem(
            'sidebar',
            'VSM Configuration',
            'app.settings',
            'app.settings.vsm-configuration',
            0,
            'fa fa-cloud'
        );
    }
})();
