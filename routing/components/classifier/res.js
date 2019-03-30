angular.module('ICC')
    .controller('res', ['$rootScope','$location', '$scope', function ($rootScope, $location, $scope) {
        let self = this;
        self.uploadFileToUrl = function(){
            try{
                form=$rootScope.form;
                if(!form){
                    document.getElementById('warn').style.display = "block";
                    document.getElementById('load').style.display = "none";
                    document.getElementById('graph').style.display = "none";
                    return
                }
                else{
                    document.getElementById('load').style.display = "block";
                    document.getElementById('warn').style.display = "none";
                    document.getElementById('graph').style.display = "none";
                }
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
                f.append('isLabeled',form.isLabeled)
                f.append('isTitled',form.isTitled)
                fetch("http://127.0.0.1:5000/uploader",{
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    mode: "cors", // no-cors, cors, *same-origin
                    body: f, // body data type must match "Content-Type" header
                })
                .then(async function (response) {
                    if(!response.ok)
                    {
                        throw response;
                    }
                    const jsonString=await response.text().then(s=>s);
                    const res=JSON.parse(jsonString); 
                    $rootScope.results=res;
                    google.charts.load('current', {'packages':['corechart']});
                    google.charts.setOnLoadCallback(self.drawChart);
                    self.isLoading=false;
                })
                .catch(async (response)=> {
                    //error   
                    self.isLoading=false;
                    try{
                    msg= await response.json()
                    } catch(e){
                        msg={errMsg:'Internal Error'};
                    }
                    $rootScope.form = undefined;
                    alert("Something went wrong.\n"+ msg.errMsg+ "\nPlease Try Again") 
                    $scope.$apply(function () { $location.path('/')} );
                    return;
                });
        }catch(Exception){
            self.isLoading=false;
            console.log(response)
            $rootScope.form = undefined;
            alert("Something went wrong. Please Try Again")
            $scope.$apply(function () { $location.path('/')} );
            return;
        }
    }

    self.drawChart= () => {
            document.getElementById('graph').style.display = "block";
            document.getElementById('load').style.display = "none";
            var resultArray = $rootScope.results.output
            var confidenceArray =  $rootScope.results.confidence
            document.getElementById('CellsNo').innerText = "Number of Cells: "+ $rootScope.results.CellsNo ;
            if ($rootScope.form.isLabeled)
                document.getElementById('Precision').innerText = "Classification Precision: "+ Number($rootScope.results.Precision*100).toFixed(3)+"%" ;
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
            var options = {
                'title':'Distribution of Cell Types',
                'titleTextStyle': {
                    fontSize: 18,
                    bold:true,
                    italic:false
                },
                'width':'80%',
                'height':'50%',
                backgroundColor: 'transparent'
            };
            var chart = new google.visualization.PieChart(document.getElementById('piechart'));
            chart.draw(data, options);

            var optionsConf = {
                'title':'Distribution of Confidence Levels',
                'titleTextStyle': {
                    fontSize: 18,
                    bold:true,
                    italic:false
                },
                'vAxis':{
                    'title': 'Number of Cells',
                    'titleTextStyle': {
                        italic:false,
                        bold:true
                    }
                },
                'hAxis':{
                    'title': 'Confidence Level',
                    'titleTextStyle': {
                        italic:false,
                        bold:true
                    }
                },
                'legend':'none', 'width':'80%', 'height':'50%',  backgroundColor: 'transparent'};
            var chart = new google.visualization.ColumnChart(document.getElementById('confidance'));
            chart.draw(dataConf, optionsConf);
    };

    self.convertToCSV = (objArray) => {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','
    
                line += array[i][index];
            }
            str += line + '\r\n';
        }
        return str;
    }
    
    self.exportCSVFile= (headers, items, fileTitle) => {
        if (headers) {
            items.unshift(headers);
        }
        // Convert Object to JSON
        var jsonObject = JSON.stringify(items);
        var csv = self.convertToCSV(jsonObject);
        var exportedFilenmae = fileTitle + '.csv' || 'export.csv';
    
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, exportedFilenmae);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportedFilenmae);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
    
    self.download= (isView)=>{
      var headers = {
          num: 'Cell No', // remove commas to avoid errors
          cellTitle:  $rootScope.results.Titles.length > 0 ? 'Cell Title' : undefined,
          actualType: $rootScope.results.actual.length > 0 ?  'Actual Type': undefined,
          predictedType: "Prediction Type",
          confidence: "Confidence"
      };
      itemsNotFormatted=[];
      
      for(i in  $rootScope.results.output)
          itemsNotFormatted.push({ 
                  predictedType:  $rootScope.results.output[i],
                  actualType: $rootScope.results.actual.length > 0 ? $rootScope.results.actual[i].trim() : undefined,
                  cellTitle: $rootScope.results.Titles.length > 0 ? $rootScope.results.Titles[i].trim() : undefined,
                  confidence:  $rootScope.results.confidence[i]
          });
    
      var itemsFormatted = [];
      // format the data
      itemsNotFormatted.forEach((item,index) => {
          itemsFormatted.push({
              num: index+1,
              cellTitle: item.cellTitle,
              actualType: item.actualType,
              predictedType: item.predictedType,
              confidence: item.confidence
          });
      });
      const fn=$rootScope.form.file.name.split('.')[0]
      var fileTitle = fn+'_predicted';
    
      if(isView){
        self.refToViewResults(headers, itemsFormatted)
        return;
      }
      self.exportCSVFile(headers, itemsFormatted, fileTitle);
    }

    self.refToViewResults = (headers, itemsFormatted) =>{
        const viewResults= {headers, itemsFormatted}
        $rootScope.viewResults=viewResults
        $location.path("/viewRes");
    }

    self.refToUp = () =>{
        $location.path("/");
    }
}]);
