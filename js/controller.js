var datas = [
	{
		id: 1,
		name: "Producteur de patates",
		type: "agro"
	},
	{
		id: 2,
		name: "Producteur d'alcool",
		type: "boisson"
	},
	{
		id: 3,
		name: "Producteur de fruits",
		type: "agro"
	}
];

var semaine = [
    {id:1,label:"lundi"},
    {id:2,label:"mardi"},
    {id:3,label:"mercredi"},
    {id:4,label:"jeudi"},
    {id:5,label:"vendredi"},
    {id:6,label:"samedi"},
    {id:7,label:"dimanche"}];
var categories = ["Fruits","Légumes","Truffes","Volailles"];
var merchantTypes = ["Producteur", "Marché", "Magasin"];
var producerControllers = angular.module('producerControllers', []);

producerControllers.controller('ProducerListCtrl',['$scope','$http',
    function($scope,$http) {
        $http.get({url: '/producteurs'}).
            success(function(data, status, headers, config) {
                $scope.producers = data;
            }).
            error(function(data, status, headers, config) {
                $scope.producers = datas;
            });
    }]);

producerControllers.controller('ProducerSearchCtrl',['$scope','$http',
    function($scope,$http) {
        $scope.semaine = semaine;
        $scope.categories = categories
        $scope.merchantTypes = merchantTypes;
        $scope.producers = datas;
        $scope.selectedDays = {};
        $scope.selectedCategory = {};
        $scope.selectedMerchantType = {};

        angular.extend($scope, {
            defaults: {
                scrollWheelZoom: false
            }
        });

        $scope.search = function(){
            var queryParams;
            console.log($scope);
            console.log($scope.selectedDays);
            console.log($scope.selectedMerchantType);
            console.log($scope.selectedCategory);
        };

    }]);

producerControllers.controller('ProducerDetailCtrl',['$scope','$routeParams',
    function($scope,$routeParams) {
        $scope.producers = datas[$routeParams.id];
    }]);

producerControllers.controller('AddProducerController', ['$scope', '$http', '$routeParams', '$location',
    function($scope,  $http, $routeParams, $location) {

        $scope.addProducer = function($routeParams){

            var producteurCoordonnees = {latitude: $scope.newProducer.latitude,
                                         longitude: $scope.newProducer.longitude};

            var producteur = {id: null,
                              nom: $scope.newProducer.name,
                              description: $scope.newProducer.description,
                              raison_sociale: $scope.newProducer.raison_sociale,
                              coordonnees: producteurCoordonnees};

            console.log(producteur);
            console.log($http);
            $http.post({url: '/producteur/add', data: producteur}).
                success(function(data, status, headers, config) {
                    // success
                }).
                error(function(data, status, headers, config) {

                });

            //datas.push({id: datas[2].id + 1, name: $scope.newProducer.name, type: $scope.newProducer.type});
            $location.path('/');
        }
    }]);
