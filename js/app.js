angular.module('cdApp', ['ngRoute', 'producerControllers', "leaflet-directive"]);

var cdApp = angular.module('cdApp');
cdApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/admin/addProducer', {
                templateUrl: 'partials/admin/producerForm.html',
                controller: 'AddProducerController'
            }).
            when('/producers', {
                templateUrl: 'partials/list.html',
                controller: 'ProducerListCtrl'
            }).
            when('/map', {
                templateUrl: 'partials/map.html',
                controller: 'ProducerListCtrl'
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
            }).

            when('/admin/addProducer', {
                templateUrl: 'partials/admin/producerForm.html',
                controller: 'AddProducerController'
            })
        .otherwise({redirectTo: '/map'});
}]);