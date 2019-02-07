angular.module('citiesApp')
.controller('LoginController', ['$http','$scope','$location','setHeadersToken','localStorageModel','bringFavorites',function($http,$scope,$location,setHeadersToken,localStorageModel,bringFavorites) {
  let self=this;
  $scope.questions1=  ["What is the name of your first pet?", "What is your high school name?"];
  $scope.questions2=  ["What is the name of your grandmother?", "What is your favorite sport team?"];

  self.submitForm=function()
  {
    if(self.user.userName===""|| self.user.password==="")
      {
        return
      }
      $http.post("http://localhost:3000/users/authenticate",self.user)
      .then(function (response) {
        if(response.data==="bad values"){
            alert("can't login")
            return
        }
        if(response.data.success===false){
          alert(response.data.message)
          return
      }
        //First function handles success
        tok=response.data.token
        setHeadersToken.set(tok)
        setHeadersToken.setUser(self.user.userName)
        localStorageModel.addLocalStorage('token', tok)

        ///FORWORD TO POI PAGE!!!!
        $location.path('/')



    }, function (response) {
        //Second function handles error
        alert("Something went wrong");
        return
    });
  }


  self.register=function(){
    $location.path('/reg')
  }
  

  self.Forgot=function() {
    var x = document.getElementById("forgot-page");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
    document.getElementById("a2").value=""
    document.getElementById("a1").value=""
    document.getElementById("user").value=""
  }

  self.submitForgetForm=function()
  {
      $http.post("http://localhost:3000/users/retrievePassword",self.forgotuser)
      .then(function (response) {
        if(response.data==="Not Found")
          alert("Failed to retrive password, data mismatched")
        else if(response.data==="user not found")
        {
          alert("User not found")
        }else
        {
          alert("Your password is: " +response.data)
        }
        self.Forgot();
    }, function (response) {
        //Second function handles error
        alert("Something went wrong");
        return
    });
  }
}]);
