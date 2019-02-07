angular.module('citiesApp')
.controller('UnregisterController', ['$location','checkToken','$http', function($location,checkToken,$http) {
    let self=this;
    let serverUrl = 'http://localhost:3000/'
    
    self.init=function(){
        checkToken.check();
    }
    
    self.get3rand=function(){
      $http.get(serverUrl + "POI/Random3")
                .then(function (response) {
                    //First function handles success
                    self.random = response.data;
                }, function (response) {
                    self.random = response.data
                    //Second function handles error
                    // self.reg.content = "Something went wrong";
                });
    }

    self.getreg=function(){
        $http.get(serverUrl + "POI/reg/get2byCat/")
                  .then(function (response) {
                      //First function handles success
                      self.popular = response.data;
                  }, function (response) {
                      self.popular = response.data
                      //Second function handles error
                      // self.reg.content = "Something went wrong";
                  });
                  $http.get(serverUrl + "POI/reg/FavoritesByUsername/2")
                  .then(function (response) {
                      //First function handles success
                      if(response.data==="No Favorite"){
                          self.haveFav=false;
                          return;
                      }
                      else
                      {
                        self.haveFav=true;
                        self.fav = response.data;
                        if(self.fav.length==1)
                            self.fav[1]={
                                Name: "Add more favorites",
                                Picture: "/assets/img/nofav.jpg"
                            }
                      }
                  }, function (response) {
                      self.fav = response.data
                      //Second function handles error
                      // self.reg.content = "Something went wrong";
                  });
      }


    self.signUp=function(){
      $location.path('/Login')
    }

    self.goTo=function(name){
        $location.path('/poi/id/'+name)
    }
  }]);