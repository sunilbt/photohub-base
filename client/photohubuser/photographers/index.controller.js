(function () {
    'use strict';

    angular
        .module('app')
        .controller('Photographers.IndexController', Controller);

    function Controller($http, $scope, $window , PhotographerService) {
        var vm = this;

        vm.photographers = [];
        vm.filterByGender = '';
        vm.profile = null;
        //rating read-only
        $scope.readOnly = true;
        $scope.totalItems = [];
        
        initController();

        function initController() {
            vm.loading = true;
            PhotographerService.GetAll()
                .then(function (posts) {
                    vm.loading = false;
                    vm.photographers = posts;                    
                });    
        }


        /*Category and Language array sorting functionality for the user home page */
        $scope.categoryArray = [{name: 'Kids',on: false}, {name: 'Candid',on: false }, { name: 'Concept', on: false}, { name: 'Corporate', on: false}, { name: 'Documentary', on: false}, { name: 'Events', on: false}, { name: 'Fashion', on: false}, { name: 'Portfolio', on: false}, { name: 'Product', on: false}, { name: 'Short Films', on: false}, { name: 'Weddings', on: false},  { name: 'Others', on: false}];
        $scope.languageArray = [{name: 'English', on: false },{name: 'Hindi', on: false },{ name: 'Kannada', on: false},{ name: 'Tamil', on: false},{ name: 'Telugu', on: false},{ name: 'Malayalam', on: false}, {name: 'Gujarathi', on: false}, {name: 'Marathi',on: false}, {name: 'Bengali', on: false}, {name: 'Urdu', on: false}, {name: 'Punjabi', on: false}];

        $scope.showAll = true;

        $scope.checkChangeCategory = function() {
            var t ='';
            for(t in $scope.categoryArray){
                if($scope.categoryArray[t].on){
                    $scope.showAll = false;
                    return;
                }
            }
            $scope.showAll = true;
        };

        $scope.categorySort = function(a) {
            if($scope.showAll) { return true; }

            var sel = false;
            var cat = '';
                for(cat in $scope.categoryArray){
                    var t = $scope.categoryArray[cat];
                    if(t.on){
                        if(a.categories.indexOf(t.name) == -1){
                            return false;
                        }else{
                            sel = true;
                        }
                    }           
                }
            return sel;
        };

        $scope.showAll2 = true;
        $scope.checkChangeLanguage = function() {
            var t ='';
            for(t in $scope.languageArray){
                if($scope.languageArray[t].on){
                    $scope.showAll2 = false;
                    return;
                }
            }
            $scope.showAll2 = true;
        };

        $scope.languageSort = function(b) {
            if($scope.showAll2) { return true; }

            var sel = false;
            var lan = '';
                for(lan in $scope.languageArray){
                    var t = $scope.languageArray[lan];
                    if(t.on){
                        if(b.languages.indexOf(t.name) == -1){
                            return false;
                        }else{
                            sel = true;
                        }
                    }           
                }
            return sel;
        };

        /*End of Category and Language sort functionality*/


        /*Setup filtering or pagination */
         $scope.sortType     = 'firstname'; // set the default sort type
         $scope.sortReverse  = false;  // set the default sort order

        /*End of filtering or pagination */

    }

})();