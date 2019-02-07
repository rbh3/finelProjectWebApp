angular.module('citiesApp')
    .controller('indexController',['$rootScope','localStorageModel', function ($rootScope,localStorageModel) {

        self = this;
        $rootScope.userName="Guest"
        $rootScope.isConnected=false;
        $rootScope.localFav=[];

    }]);
