(function () {
    'use strict';

    angular
        .module('app')
        .controller('Maplocator.IndexController', Controller);

    function Controller($scope, $window, PhotographerService) {
        var vm = this;
        vm.photographers = [];

        initController();

        function initController() {
            vm.loading = true;
            PhotographerService.GetAll()
                .then(function (posts) {
                    vm.loading = false;
                    vm.photographers = posts;
                });    

        }

        /*On click on the map marker, opens the user profile in a new tab */
        $scope.openProfile = function(userid){            
            $window.open('http://localhost:3030/photohubuser/#/photographers/profile/'+ userid, '_blank');            
        };

    }//end of controller

})();