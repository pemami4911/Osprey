'use strict';

angular.module('dashboardMyPatientModule', ['splashPageService', 'ui.bootstrap', 'nvd3ChartDirectives'])

	// inject the Todo service factory into our controller
	.controller('dashboardMyPatientController', ['$scope',
										'$http', 
										'$location', 
										'splashFactory', 
	function($scope, $http, $location, splashFactory) {
		$scope.Math = window.Math;
		$scope.caloriesBurned = 0;
		$scope.caloriesConsumed = 0;
		$scope.exampleData = [
            {
                "key": "Calories Burned",
                "values": [ ]
            },
            {
                "key": "Caloried Consumed",
                "values": [  ]
            }
        ];
        $scope.child = {};
        for (var i = 0; i < $scope.loggedUser.children.content.length; i++) {
        	if ($scope.selectedRow.patientName == $scope.loggedUser.children.content[i].name) {
        		$scope.child = $scope.loggedUser.children.content[i];
        	}
        }
        $scope.child.fitbit.sort(function(a, b){
        	var ams = Date.UTC	(a.timestamp.substr(0, 4), 
        						(a.timestamp.substr(5, 2) - 1), 
        						a.timestamp.substr(8, 2));
        	var bms = Date.UTC	(b.timestamp.substr(0, 4), 
        						(b.timestamp.substr(5, 2) - 1), 
        						b.timestamp.substr(8, 2));
        	return (ams - bms);
        });
        for (var i = 0; i < $scope.child.fitbit.length; i++) {
        	var ms = (Date.UTC($scope.child.fitbit[i].timestamp.substr(0, 4), 
        							($scope.child.fitbit[i].timestamp.substr(5, 2) - 1), 
        							$scope.child.fitbit[i].timestamp.substr(8, 2)));
        	$scope.exampleData[0].values.push([ms, $scope.child.fitbit[i].calories]);
        	$scope.caloriesBurned += $scope.child.fitbit[i].calories;
        	var cal = $scope.child.fitbit[i].calories * (.5 + Math.random())
        	$scope.caloriesConsumed += cal;
        	$scope.exampleData[1].values.push([ms, cal]);
        }

        d3.select("#render-me");

        d3.select('svg')
		  	.append("text")
		  	.attr("x", 460)             
		  	.attr("y", 30)
			.attr("text-anchor", "middle")  
			.text($scope.child.name);

		d3.selectAll('circle.nv-legend-symbol')
			.style("fill", '#00FF00');

			console.log(d3.selectAll('circle.nv-legend-symbol'));



		// Toggles for Account Settings
		$scope.pdfGenerator = function() {
			$scope.applyCSS(function(){
				var tmp = document.getElementById("lineChart");
				var svg = tmp.getElementsByTagName("svg")[0];
				var svg_xml = (new XMLSerializer).serializeToString(svg);

				canvg('canvas', svg_xml, { ignoreMouse: true, ignoreAnimation: true });
				var canvas = document.getElementById("canvas");
				var img    = canvas.toDataURL("image/png", 1.0);
				console.log(dataurl);
				var doc = new jsPDF();
				doc.setFontSize(20);
				doc.addImage(dataurl, 'png', 89, 8, 30, 11);
				doc.text(84, 25, "Patient Report");
				doc.setFontSize(10);
				doc.setFont("courier");
	            doc.text(30, 40, "Patient: " + $scope.selectedRow.patientName );
	            doc.text(30, 45, "Age: " + String($scope.selectedRow.age) ); 
	            doc.text(30, 50, "Parent Name: " + $scope.selectedRow.parentName ); 
	            doc.text(30, 55, "Parent E-mail: " + $scope.selectedRow.email ); 

	            doc.text(125, 40, "Days: " + $scope.ospreyDays() ); 
	            doc.text(125, 45, "Calories Burned: " + Math.round($scope.caloriesBurned) ); 
	            doc.text(125, 50, "Calories Consumed: " + Math.round($scope.caloriesConsumed) ); 
	            doc.addImage(img, 'png', 0, 60, 210, 70);

	            doc.save($scope.selectedRow.patientName.concat('.pdf'));
			});
		}

        $scope.applyCSS = function(callback) {
        	$.get('/nvd3css', function(data){
        		for (var i = 0; i < data.length; i++) {
        			if (data[i].type == 'rule') {
	        			for (var j = 0; j < data[i].selectors.length; j++){
	        				for (var k = 0; k < data[i].declarations.length; k++) {
	        					var selector = data[i].selectors[j];
	        					var prop = data[i].declarations[k].property;
	        					var value = data[i].declarations[k].value ;
	        					var newCSS = {};
	        					newCSS[prop] = value;
	        					$(selector).css(newCSS);
	        				}

	        			}
	        		}
        		}

        		callback();
        	});
        }

        $scope.xAxisTickFormatFunction = function(){
	        return function(d){
	            return d3.time.format('%x')(new Date(d));
	        }
	    }
	    $scope.yAxisTickFormatFunction = function(){
                return function(d){
                    return d3.format('d')(d);
                }
            }
	    $scope.xFunction = function(){
            return function(d) {
                return d[0];
            }
        };
        $scope.yFunction = function(){
            return function(d) {
                return d[1];
            }
        }
        $scope.colorFunction = function() {
            return function(d, i) {
            	if (i == 0)
            		return '#00FF00'
            	else
                	return '#FF0000'
            };
        }
        $scope.ospreyDays = function() {
        	var end = new Date($scope.child.fitbit[$scope.child.fitbit.length-1].timestamp.substr(0, 4), 
        					($scope.child.fitbit[$scope.child.fitbit.length-1].timestamp.substr(5, 2) - 1), 
        					 $scope.child.fitbit[$scope.child.fitbit.length-1].timestamp.substr(8, 2), 0, 0, 0, 0);
        	var start = new Date($scope.child.fitbit[0].timestamp.substr(0, 4), 
        					($scope.child.fitbit[0].timestamp.substr(5, 2) - 1), 
        					 $scope.child.fitbit[0].timestamp.substr(8, 2), 0, 0, 0, 0);
        	return ((end - start) / (1000 * 60 * 60 * 24)) + 1;
        }


	    var dataurl = 'data:image/png;base64,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'
	}]);

