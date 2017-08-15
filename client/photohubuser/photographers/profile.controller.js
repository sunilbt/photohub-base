(function () {
    'use strict';

    angular
        .module('app')
        .controller('Photographers.ProfileController', Controller);

    function Controller($scope, $stateParams, $location, UserService, PhotographerService, AlertService) {
        var vm = this;
        vm.profile = {};
        vm.userrating = 0;
        vm.btnshow = true;
        
        vm.sum = 0;
        vm.average = 0;
        vm.averagerating = 0;

        vm.rateNow = rateNow;

        $scope.readOnly = true;

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
                UserService.GetCurrent().then(function (user) {
                    vm.user = user;
                    vm.profile.starrating.forEach(function(data){
                        if(data.userid == vm.user._id){
                            vm.btnshow = false;
                        }
                    });
                });

                
            } else {
                // initialise with defaults
                
            }

        }


        //function pulls the rating values as the user clicks on the stars on UI
        $scope.onItemRating = function(rating){
            vm.userrating = rating;
        };
        
        //on button click, push the values to the database
        function rateNow(){
            if(vm.profile._id){

                vm.addrating = [{
                    stars: vm.userrating,
                    userid: vm.user._id
                }];

                vm.profile.starrating.forEach(function(data){
                    vm.sum += parseInt(data.stars, 10);
                });
                vm.average = (vm.sum + vm.userrating) / (vm.profile.starrating.length + 1);
                vm.averagerating = Math.round(vm.average);
                
                vm.profile.starrating = vm.profile.starrating.concat(vm.addrating);
                vm.profile.averagerating = vm.averagerating;
 
                PhotographerService.Save(vm.profile).then(function(){
                    vm.btnshow = false;
                });
                
            }
        }


    }

})();