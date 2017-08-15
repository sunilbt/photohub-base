(function () {
    'use strict';

    angular
        .module('app', ['ui.router', 'ui.bootstrap', 'checklist-model', 'GoogleMapsNative', 'ngMaterial', 'jkAngularRatingStars'])
        .config(config)
        .run(run);

    function config($locationProvider, $stateProvider, $urlRouterProvider, gmLibraryProvider) {
        // default route
        $urlRouterProvider.otherwise("/photographers");

        $stateProvider
            .state('photographers', {
                url: '/photographers',
                templateUrl: 'photographers/index.view.html',
                controller: 'Photographers.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'photographers' }
            })
            .state('photographers/profile',{
                url: '/photographers/profile/:_id',
                templateUrl: 'photographers/profile.view.html',
                controller: 'Photographers.ProfileController',
                controllerAs: 'vm',
                data: { activeTab: 'photographers'}
            })
            .state('photographers/booking', {
                url: '/photographers/booking/:_id',
                templateUrl: 'photographers/booking.view.html',
                controller: 'Photographers.BookingController',
                controllerAs: 'vm',
                data: { activeTab: 'photographers' }
            })
            .state('maplocator',{
                url: '/maplocator',
                templateUrl: 'maplocator/index.view.html',
                controller: 'Maplocator.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'maplocator'}
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.view.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            });

            gmLibraryProvider.configure({
			    language: 'en',
			    url: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDTIkmGEdVxsurnPrZpsQnmAq57Up2Hmec&' // need to keep the `&` at end of string, if my memories are right
		    });
    }

    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });
})();