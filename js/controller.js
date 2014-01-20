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

var producerControllers = angular.module('producerControllers', []);


producerControllers.controller('ProducerListCtrl',['$scope','$http',
    function($scope,$http) {
        $scope.producers = datas;
        angular.extend($scope, {
            defaults: {
                scrollWheelZoom: false
            }
        });
    }]);

producerControllers.controller('ProducerDetailCtrl',['$scope','$routeParams',
    function($scope,$routeParams) {
        $scope.producers = datas[$routeParams.id];
    }]);

producerControllers.controller('AddProducerController', ['$scope','$routeParams', '$location',
    function($scope,$routeParams, $location) {
        $scope.addProducer = function($routeParams){
            // validation
            datas.push({id: datas[2].id + 1, name: $scope.newProducer.name, type: $scope.newProducer.type});
            alert(datas[3].name);
            $location.path('/');
        }
    }]);
