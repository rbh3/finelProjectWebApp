angular.module('ICC')
    .controller('viewResults', ['$rootScope','$location', '$scope', function ($rootScope, $location, $scope) {
        let self = this;
        self.labels=[];
        self.prediction=[];
        self.sortValue = "";

        self.init = function(){
            if(!$rootScope.viewResults){
                $location.path("/");
                return;
            }
            self.results=$rootScope.viewResults.itemsFormatted;

            self.results.forEach((item)=> {
                self.labels.includes(item.actualType) ? {} : self.labels.push(item.actualType);
                self.prediction.includes(item.predictedType) ? {} : self.prediction.push(item.predictedType);
            });  
            self.shouldShowCellTitle= ()=> !!$rootScope.viewResults.headers.cellTitle;
            self.shouldShowCellLabel= ()=> !!$rootScope.viewResults.headers.actualType;
        }
        self.sortByConfidence = ()=> {self.sortValue= self.sortValue === "" ? "-'confidence'" : ""}

        self.filterMyData = function (input, searchParam) {

            if (searchParam == '')
                 return true;
       
            return angular.equals(input, searchParam);
       }

        // self.getFilter= ()=>{
        //     if($scope.FilterTitle != 'Cell Title' && $scope.FilterLabel != 'Actual Type')
        //         return $scope.FilterTitle && $scope.FilterLabel;
        //     if($scope.FilterTitle != 'Cell Title' && $scope.FilterLabel == 'Actual Type')
        //         return $scope.FilterTitle;
        //     if($scope.FilterTitle == 'Cell Title' && $scope.FilterLabel != 'Actual Type')
        //         return $scope.FilterLabel;
        // }
//             var table_data = '<table class="table table-bordered table-striped">';
//             table_data += '<tr>';
//             table_data += '<td>Cell No</td>';
//             table_data += $rootScope.viewResults.headers.cellTitle ? '<td>Cell Title</td>' : ''
//             table_data += $rootScope.viewResults.headers.actualType ? '<td>Actual Type</td>' : ''
//             table_data += '<td>Prediction Type</td>' 
//             table_data += '<td>Confidence</td>' 
//             table_data += '</tr>';
//             for(let cell_count=0; cell_count<$rootScope.viewResults.itemsFormatted.length; cell_count++)
//             {
//                 table_data += '<tr>';
//                 table_data += '<td>'+$rootScope.viewResults.itemsFormatted[cell_count].num+'</td>';
//                 table_data += $rootScope.viewResults.headers.cellTitle ? '<td>'+$rootScope.viewResults.itemsFormatted[cell_count].cellTitle+'</td>' : '';
//                 table_data += $rootScope.viewResults.headers.actualType ? '<td>'+$rootScope.viewResults.itemsFormatted[cell_count].actualType+'</td>' : '';
//                 table_data += '<td>'+$rootScope.viewResults.itemsFormatted[cell_count].predictedType+'</td>';
//                 table_data += '<td>'+$rootScope.viewResults.itemsFormatted[cell_count   ].confidence+'</td>';
//             }
//            angular.element(document.querySelector('#table')).html(table_data);
//         }
}]);
