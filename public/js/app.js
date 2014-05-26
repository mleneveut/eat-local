angular.module('cdApp', ['ngRoute', 'producerControllers', "leaflet-directive"]);

var cdApp = angular.module('cdApp');
cdApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/admin/ajouter', {
                templateUrl: 'partials/producerAdd.html',
                controller: 'AddProducerController'
            }).
            when('/admin/producers', {
                templateUrl: 'partials/list.html',
                controller: 'ProducerListCtrl'
            }).
            when('/map', {
                templateUrl: 'partials/map.html',
                controller: 'ProducerSearchCtrl'
            }).
            when('/ajouter', {
                templateUrl: 'partials/producerAdd.html',
                controller: 'AddProducerController'
            }).
            when('/about', {
                templateUrl: 'partials/about.html'
            }).
            when('/producers/:producerId', {
                templateUrl: 'partials/detail.html',
                controller: 'ProducerDetailCtrl'
            }).
            when('/admin', {
                templateUrl: 'partials/admin.html'
            })
        .otherwise({redirectTo: '/map'});
}]);