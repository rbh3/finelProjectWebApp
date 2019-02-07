angular.module('citiesApp')
    .controller('uplodeFile', ['$scope','$location', '$rootScope', function($scope, $location,$rootScope){
    $scope.convert='yes';
    $scope.uploadFile = function(){
        let form ={
            file: $scope.myFile,
            start_row: $scope.start_row,
            end_row:  $scope.end_row,
            platform:  $scope.platform,
            convert: $scope.convert
        }
        if( $scope.convert === 'no'){
            form.conversion_file= $scope.conversion_file
            form.conv_start_row=$scope.conv_start_row
            form.conv_end_row=$scope.conv_end_row
            form.id_col=$scope.id_col
            form.symbol_col=$scope.symbol_col
        }
        console.dir(form.file)
        $rootScope.form=form;
        $location.path('/res')
    };
}]);
