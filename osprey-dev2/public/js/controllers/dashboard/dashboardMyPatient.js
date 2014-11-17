'use strict';

angular.module('dashboardMyPatientModule', ['splashPageService', 'ui.bootstrap', 'nvd3ChartDirectives'])

	// inject the Todo service factory into our controller
	.controller('dashboardMyPatientController', ['$scope',
										'$http', 
										'$location', 
										'splashFactory', 
	function($scope, $http, $location, splashFactory) {
		// Toggles for Account Settings
		$scope.pdfGenerator = function() {
			$scope.applyCSS();
			var tmp = document.getElementById("lineChart");
			var svg = tmp.getElementsByTagName("svg")[0];
			var svg_xml = (new XMLSerializer).serializeToString(svg);

			canvg('canvas', svg_xml, { ignoreMouse: true, ignoreAnimation: true });
			var canvas = document.getElementById("canvas");
			var img    = canvas.toDataURL("image/png");

			var doc = new jsPDF();
            doc.text(20, 20, $scope.selectedRow.patientName );
            doc.text(20, 40, String($scope.selectedRow.age) ); 
            doc.text(20, 60, $scope.selectedRow.email ); 
            doc.text(20, 80, $scope.selectedRow.parentName ); 
            doc.addImage(img, 'png', 15, 100, 180, 160);
            doc.save($scope.selectedRow.patientName.concat('.pdf'));
		}

		$scope.exampleData = [
            {
                "key": "Series 1",
                "values": [ [ 1 , 0], [ 2 , 93.388148670744],[ 3 , 20]]
            }];

        $scope.applyCSS = function() {
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
        	});
        }



	}]);

