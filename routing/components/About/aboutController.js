angular.module('ICC')
.controller('aboutController', ['$scope', function($scope) {
  $scope.scrollTo= (id)=>{
      window.scrollTo(0, $(id).offset().top-50);
    }
  }]);