angular.module('ICC')
    .controller('confMatrix', ['$rootScope','$location', '$scope', function ($rootScope, $location, $scope) {
        let self = this;
        self.typesMap = {
            'b': 1,
            'b1ab': 2,
            'dc': 3,
            'gn': 4,
            'mf': 5,
            'nk': 6,
            'nkt': 7,
            't4': 8, 
            't8': 9,
            'tgd': 10,
            'treg': 11, 
            'other': 12
        }
        self.conf_mat = [
            ['', 'B', 'B1ab', 'DC', 'GN', 'MF', 'NK', 'NKT', 'T4', 'T8', 'Tgd', 'Treg', 'Other'],
            ['B', 0,0,0,0,0,0,0,0,0,0,0,0],
            ['B1ab', 0,0,0,0,0,0,0,0,0,0,0,0],
            ['DC', 0,0,0,0,0,0,0,0,0,0,0,0],
            ['GN', 0,0,0,0,0,0,0,0,0,0,0,0],
            ['MF', 0,0,0,0,0,0,0,0,0,0,0,0],
            ['NK', 0,0,0,0,0,0,0,0,0,0,0,0],
            ['NKT', 0,0,0,0,0,0,0,0,0,0,0,0],
            ['T4', 0,0,0,0,0,0,0,0,0,0,0,0],
            ['T8', 0,0,0,0,0,0,0,0,0,0,0,0],
            ['Tgd', 0,0,0,0,0,0,0,0,0,0,0,0],
            ['Treg', 0,0,0,0,0,0,0,0,0,0,0,0],
            ['Other', 0,0,0,0,0,0,0,0,0,0,0,0]
        ];
                
        self.init = function(){
            if(!$rootScope.viewResults){
                $location.path("/");
                return;
            }
            
            self.results=$rootScope.viewResults.itemsFormatted;

            self.results.forEach((item)=> {
                self.conf_mat[self.typesMap[item.actualType]][self.typesMap[item.predictedType]] += 1;
            });  
        }

        self.getColor = function (item, i) {
            if (item===0 && i===0)
                return '';
            if (item===i)
                return 'confGreen';
            if (item===0)
                return 'confBlue';
            if (i===0)
                return 'confOrange';
            if (self.conf_mat[item][i] !== 0 && item!==i)
                return 'confRed';
        };
}]);
