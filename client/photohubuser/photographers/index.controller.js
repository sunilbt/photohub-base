(function () {
    'use strict';

    angular
        .module('app')
        .controller('Photographers.IndexController', Controller);

    function Controller($http, $scope, $window , PhotographerService) {
        var vm = this;

        vm.photographers = [];
        vm.sortOptions = {
            prices: [
                {id: 1, name: 'Price Highest to Lowest'},
                {id: 2, name: 'Price Lowest to Highest'}
            ]
        };
        vm.filterByGender = '';
        vm.profile = null;

       


        initController();

        function initController() {
            vm.loading = true;
            PhotographerService.GetAll()
                .then(function (posts) {
                    vm.loading = false;
                    vm.photographers = posts;
                });    
        }

/*        vm.itemFilter = function(item){
   
            var filters = vm.options.filter(function(element, idx, array){
                return element.selected;
            }) || [];
           
            var matched = true;
            filters.forEach(function(option) {
                matched = matched && item.categories.indexOf(option.name) >= 0;                
                console.log(item.categories);                
            });

            return matched;
        }*/

        //Mapped to the model to sort
        $scope.sortItem = {
            price: vm.sortOptions.prices[0]
        };
        
        //Watch the sorting model - when it changes, change the
        //ordering of the sort (descending / ascending)
        $scope.$watch('sortItem', function () {
            if ($scope.sortItem.price.id === 1) {
                $scope.reverse = true;
            } else {
                $scope.reverse = false;
            }
        }, true);

        

         $scope.categoryArray = [
            {
                name: 'Kids',
                on: false
            }, {
                name: 'Candid',
                on: false
            }, {
                name: 'Concept',
                on: false
            }, {
                name: 'Corporate',
                on: false
            }, {
                name: 'Documentary',
                on: false
            }, {
                name: 'Events',
                on: false
            }, {
                name: 'Fashion',
                on: false
            }, {
                name: 'Portfolio',
                on: false
            }, {
                name: 'Product',
                on: false
            }, {
                name: 'Short Films',
                on: false
            }, {
                name: 'Weddings',
                on: false
            },  {
                name: 'Others',
                on: false
            }
        ];

        $scope.languageArray = [{
                name: 'English',
                on: false
            },{
                name: 'Hindi',
                on: false
            },{
                name: 'Kannada',
                on: false
            },{
                name: 'Tamil',
                on: false
            },{
                name: 'Telugu',
                on: false
            },{
                name: 'Malayalam',
                on: false
            }, {
                name: 'Gujarathi',
                on: false
            }, {
                name: 'Marathi',
                on: false
            }, {
                name: 'Bengali',
                on: false
            }, {
                name: 'Urdu',
                on: false
            }, {
                name: 'Punjabi',
                on: false
            }
        ];

        $scope.showAll = true;

        $scope.checkChange = function() {
            var t ='';
            for(t in $scope.categoryArray){
                if($scope.categoryArray[t].on){
                    $scope.showAll = false;
                    return;
                }
            }
            $scope.showAll = true;
        };

        $scope.myFunc = function(a) {
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
        $scope.checkChangetwo = function() {
            var t ='';
            for(t in $scope.languageArray){
                if($scope.languageArray[t].on){
                    $scope.showAll2 = false;
                    return;
                }
            }
            $scope.showAll2 = true;
        };


        $scope.myFunc2 = function(b) {
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



        $scope.rate = 4;
        $scope.max = 5;
        $scope.isReadonly = true;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };



    }

})();