(function () {
    'use strict';

    angular
        .module('app', ['ui.router', 'ngMessages'])
        .config(config)
        .run(run);

    function config($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
        // set variable to control behaviour on initial app load
        window.initialLoad = true;

        $locationProvider.html5Mode(true);

        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/?:page',
                templateUrl: function (stateParams) {
                    return window.initialLoad ? null :
                        '/?xhr=1' + (stateParams.page ? '&page=' + stateParams.page : '');
                }
            })
            .state('contact', {
                url: '/contact',
                templateUrl: '/contact?xhr=1',
                controller: 'Contact.IndexController',
                controllerAs: 'vm'
            })
            .state('contact-thanks', {
                url: '/contact-thanks',
                templateUrl: '/contact-thanks?xhr=1'
            });

        // mark all requests from angular as ajax requests
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    }

    function run($rootScope, $timeout, $location, $window) {
        // initialise google analytics
        $window.ga && $window.ga('create', 'UA-30211492-1', 'auto');

        $rootScope.$on('$stateChangeSuccess', function () {
            // hide mobile nav
            $rootScope.showNav = false;

            // track pageview
            var urlWithoutHash = $location.url().split('#')[0];
            $window.ga && $window.ga('send', 'pageview', urlWithoutHash);

            // jump to top of page if not initial page load
            if (!window.initialLoad) {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            }

            $timeout(function () {
                // run syntax highlighter plugin
                SyntaxHighlighter.highlight();
            });

            window.initialLoad = false;
        });
    }

})();