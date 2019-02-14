angular.module('ICC')
    .controller('indexController',['$rootScope', function ($rootScope) {
        self = this;

        self.showRes = ()=>
        {
            return $rootScope.form!=undefined;
        }
    }]);
