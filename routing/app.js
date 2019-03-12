let app = angular.module('ICC', ["ngRoute", 'LocalStorageModule']);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider)  {
    $locationProvider.hashPrefix('');

    $routeProvider
        .when('/help', {
        templateUrl: 'components/About/about.html',
        controller : 'aboutController as abtCtrl'
        })
        .when('/res', {
            templateUrl: 'components/classifier/res.html',
            controller : 'res as res'
        })
        .when('/', {
            templateUrl: 'components/classifier/uplodeFile.html',
            controller : 'uplodeFile as uplodeFile'
        })
        .otherwise({redirectTo: '/'});     
}]);