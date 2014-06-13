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

var metersPerZoom = [156412, 78206, 39103, 19551, 9776, 4888, 2444, 1222, 610.984, 305.492, 152.746, 76.373, 38.187, 19093, 9.547, 4.773, 2.387, 1.193, 0.596, 0.298];

var producerControllers = angular.module('producerControllers', ['geolocation', 'leaflet-directive', 'ngTable']);

producerControllers.controller('ProducerListCtrl',
    function($scope, $http, $filter, ngTableParams) {
        $http.post('/api/search').
            success(function(data, status, headers, config) {
                $scope.tableParams = new ngTableParams({
                    page: 1,            // show first page
                    count: 20,          // count per page
                    sorting: {
                        nom: 'asc'     // initial sorting
                    }
                }, {
                    total: data.length, // length of data
                    getData: function($defer, params) {
                        // use build-in angular filter
                        var filteredData = params.filter() ?
                            $filter('filter')(data, params.filter()) :
                            data;
                        var orderedData = params.sorting() ?
                            $filter('orderBy')(filteredData, params.orderBy()) :
                            data;

                        params.total(orderedData.length); // set total for recalc pagination
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });
            }).
            error(function(data, status, headers, config) {
                $scope.producers = datas;
            });
    });

producerControllers.controller('ProducerSearchCtrl',['$scope','$http', "geolocation",
    function($scope,$http, geolocation) {
        $scope.semaine = semaine;
        $scope.categories = categories
        $scope.merchantTypes = merchantTypes;
        $scope.producers = datas;
        $scope.selectedDays = {};
        $scope.selectedCategory = {};
        $scope.selectedMerchantType = {};

        angular.extend($scope, {
	    center: {
		lat: 44.5,
		lng: -0.2,
		zoom: 8
	    },
	    defaults: {
		tileLayer: "http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg",
		tileLayerOptions: {
		    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>',
		    maxZoom: 18,
		    subdomains: "1234"
		}
	    }
	});
	$scope.markers = [];

        geolocation.getLocation().then(function(data){
            $scope.center.lat = data.coords.latitude;
            $scope.center.lng = data.coords.longitude;
            $scope.center.zoom= 14;
        });

        $scope.search = function(){
            var queryParams;
            console.log($scope.selectedDays);
            console.log($scope.selectedMerchantType);
            console.log($scope.selectedCategory);

            $scope.markers = [];

            var dist = $scope.getRange();

            $http({method: 'GET', url: 'http://localhost:8082/pois?geo=1&geo_lat='+$scope.center.lat+'&geo_lng='+$scope.center.lng+'&geo_dist='+dist}).
                success(function(data, status, headers, config) {
                    if(data) {
                        for(var i = 0; i < data.length; i++) {
                            var icon =  $scope.getIcon(data.categories);
                            var msg =  $scope.constructInfoBulle(data[i]);
                            $scope.markers.push({
                                lat: data[i].coordonnees[1], // $lat
                                lng: data[i].coordonnees[0], //$lng
                                focus: false,
                                message: msg, // $popup_msg = title + '<br />' + description + '<br />' + address
                                title: data[i].nom, // $title
                                icon: {
                                    iconUrl: icon, // $category (here, the category is 'divers')
                                    shadowUrl: 'img/marker-shadow.png',
                                    iconSize: [32, 42], // size of the icon
                                    iconAnchor: [16, 42], // point of the icon which will correspond to marker's location
                                    popupAnchor: [0, -30] // point from which the popup should open relative to the iconAnchor
                                }
                            });
                        }
                    }
                }).
                error(function(data, status, headers, config) {
                    alert('Erreur lors de la recherche : ' + status);
                });
        };
        $scope.getRange = function() {
            var range = metersPerZoom[$scope.center.zoom] * 1300 / 2; //get map's width instead of 1300

            return range;
        }
        $scope.getIcon = function(cats) {
            var icon = 'img/divers.png';
            if(cats) {
                for (var i = 0; i < cats.length; i++) {
                    switch (cats[i]) {
                        case 'Porc':
                        case 'Bovin':
                        case 'Brebis':
                            icon = 'img/viande.png';
                            break;
                        case 'Epicerie':
                            icon = 'img/magasin2.png';
                            break;
                        case 'Produits frais':
                            icon = 'img/legumes.png';
                            break;
                    }
                }
            }
            return icon;
        };

        $scope.constructInfoBulle = function(data) {
            var msg = '';
            var newLine = '<br />';
            var previous = false;
            if(data.nom) {
                if(previous) {
                    msg += newLine;
                }
                msg += data.nom;
                previous = true;
            }
            if(data.description) {
                if(previous) {
                    msg += newLine;
                }
                msg += data.description;
                previous = true;
            }
            if(data.address) {
                if(previous) {
                    msg += newLine;
                }
                msg += data.address;
                previous = true;
            }
            if(data.phone) {
                if(previous) {
                    msg += newLine;
                }
                msg += data.phone;
                previous = true;
            }
            return msg;
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
            $http.post('/producteur/add', {
                data: producteur
            }).
                success(function(data, status, headers, config) {
                    // success
                }).
                error(function(data, status, headers, config) {

                });

            //datas.push({id: datas[2].id + 1, name: $scope.newProducer.name, type: $scope.newProducer.type});
            $location.path('/');
        }
    }]);

