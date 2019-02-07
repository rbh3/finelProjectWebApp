angular.module('citiesApp')
    .controller('res', ['$rootScope','$location', function ($rootScope, $location) {
        let self = this;
        self.uploadFileToUrl = function(){
            try{
                form=$rootScope.form;
                if(!form){
                    document.getElementById('warn').style.display = "block";
                    return
                }
                else
                    document.getElementById('warn').style.display = "none";
                self.isLoading=true;
                let f= new FormData();
                f.append('file',form.file)
                f.append('start_row',form.start_row)
                f.append('end_row',form.end_row)
                f.append('platform',form.platform)
                f.append('convert',form.convert)
                if(form.convert === 'no'){
                    f.append('conversion_file',form.conversion_file)
                    f.append('conv_start_row',form.conv_start_row)
                    f.append('conv_end_row',form.conv_end_row)
                    f.append('id_col',form.id_col)
                    f.append('symbol_col',form.symbol_col)
                }
                fetch("http://127.0.0.1:5000/uploader",{
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    mode: "cors", // no-cors, cors, *same-origin
                    body: f, // body data type must match "Content-Type" header
                })
                .then(async function (response) {
                    
                    const jsonString=await response.text().then(s=>s);
                    const res=JSON.parse(jsonString); 
                    $rootScope.results=res;
                    google.charts.load('current', {'packages':['corechart']});
                    google.charts.setOnLoadCallback(self.drawChart);
                    self.isLoading=false;
                })
                .catch((response)=> {
                    //error   
                    self.isLoading=false;
                    console.log(response)
                    alert("Something went wrong. Please Try Again");
                    $location.path='/About'
                    return;
                });
        }catch(Exception){
            self.isLoading=false;
            console.log(response)
            alert("Something went wrong. Please Try Again");
            $location.url='/About'
            return;
        }
    }
        self.drawChart= () => {
            document.getElementById('graph').style.display = "block";
            document.getElementById('load').style.display = "none";
            var resultArray = $rootScope.results.output
            var confidenceArray =  $rootScope.results.confidence

            var counts = {};
            var conf = {};
            for(x in resultArray){
                counts[resultArray[x]] = (counts[resultArray[x]] || 0)+1;
            }
            for(confidence in confidenceArray){
                conf[confidenceArray[confidence]] = (conf[confidenceArray[confidence]] || 0)+1;
            }

            let pie=[['Cell Type', 'Apperance']];
            for( i in counts)
                pie.push([i,counts[i]]);

            let column=[["Element","Cells"]];
            const confSortedKeys=Object.keys(conf).sort(function(a,b){return a-b});
            for(let i=0;i<confSortedKeys.length;i++)
                column.push([confSortedKeys[i],conf[confSortedKeys[i]]]);
                
            // Display the chart inside the <div> element with id="piechart"
            var data = google.visualization.arrayToDataTable(pie);
            var dataConf= google.visualization.arrayToDataTable(column);
            // Optional; add a title and set the width and height of the chart
            var options = {'title':'Classifications', 'width':'50%', 'height':'40%'};
            var chart = new google.visualization.PieChart(document.getElementById('piechart'));
            chart.draw(data, options);

            var optionsConf = {'title':'Confidence Level', 'width':'50%', 'height':'40%'};
            var chart = new google.visualization.ColumnChart(document.getElementById('confidance'));
            chart.draw(dataConf, optionsConf);
        };
}]);
