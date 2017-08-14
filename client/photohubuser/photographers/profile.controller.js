(function () {
    'use strict';

    angular
        .module('app')
        .controller('Photographers.ProfileController', Controller);

    function Controller($scope, $stateParams, $location, PhotographerService, AlertService) {
        var vm = this;
        vm.profile = {};

        vm.rateNow = rateNow;

        initController();

        function initController() {
            vm.loading = 0;

            if ($stateParams._id) {
                vm.loading += 1;
                PhotographerService.GetById($stateParams._id)
                    .then(function (post) {
                        vm.loading -= 1;
                        vm.profile = post;
                    });
            } else {
                // initialise with defaults
                
            }
        }

        $scope.rate = 4;
        $scope.max = 5;
        $scope.isReadonly = false;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

        function rateNow(){
            
        }

        

    }

})();