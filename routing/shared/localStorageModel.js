angular.module("ICC")
    .service('localStorageModel', ['localStorageService', function (localStorageService) {

        var self = this;

        self.addLocalStorage = function (key, value) {
            var dataVal = localStorageService.get(key);
            console.log(dataVal)
            if (!dataVal) {
                if (localStorageService.set(key, value)) {
                    console.log("data added")
                }
                else
                    console.log('failed to add the data');
            }
            else
                self.updateLocalStorage(key,value)
        }

        self.removeToken=function(key){
            localStorageService.remove(key)
        }

        self.getLocalStorage = function (key) {
            return localStorageService.get(key)
        }

        self.updateLocalStorage = function (key, value) {
            localStorageService.remove(key);
            localStorageService.set(key, value);
        }

    }]);