angular.module('citiesApp',)
    .controller('regCtrl', ['$http','$rootScope',  '$location', 'setHeadersToken', 'localStorageModel', function ($http,$rootScope, $location, setHeadersToken, localStorageModel) {
        let self = this;

        self.cats = [
            {id: 1, text: 'Shopping'},
            {id: 2, text: 'Nightclub'},
            {id: 3, text: 'Resturants'},
            {id: 4, text: 'Attractions'}
          ];
        self.selectedCategories = [];

        self.questions1 = ["What is the name of your first pet?", "What is your high school name?"];
        self.questions2 = ["What is the name of your grandmother?", "What is your favorite sport team?"];

        //XML countries
        self.getXMLcountries = function () {
            var i;
            var xmlDoc = $rootScope.myXML.responseXML;
            var cntrs = [];
            var x = xmlDoc.getElementsByTagName("Country");
            for (i = 0; i < x.length; i++) {
                cntrs.push(x[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue.toString());
            }
            self.Countries = cntrs;
        }
        //End of XML countries

        //At least 2 categories
        this.chooseCat = function (cat) {
            var index = self.selectedCategories.indexOf(cat);
            if (index == -1) {
                self.selectedCategories.push(cat);
            }
            else {
                self.selectedCategories.splice(index, 1);
            }
        }

        self.submitForm = function () {
            let user = {
                Username : self.Username,
                Password : self.Password,
                Fname : self.Fname,
                Lname : self.Lname,
                City : self.City,
                Country : self.Country,
                Email : self.Email,
                categories : self.selectedCategories,
                Q1 : self.Q1,
                A1 : self.A1,
                Q2 : self.Q2,
                A2 : self.A2
            }
            $http.post("http://localhost:3000/users/", user)
                .then(function (response) {
                    if (response.data === "Username already exists, please choose another") {
                        alert(response.data)
                        return
                    }
                    else if (response.status === 200) {
                        alert(self.Username + "  was succefully added!")
                        $location.path("/Login")
                        return
                    }
                }, function (response) {
                    //Second function handles error
                    alert("Something went wrong");
                    return
                });
        }


    }]);