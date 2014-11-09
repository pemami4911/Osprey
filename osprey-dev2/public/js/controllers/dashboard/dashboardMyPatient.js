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
        	// html
        	$(".chartWrap").css({"margin": '0', padding: '0', overflow: 'hidden'});

        	// svg
        	$("svg").css({
        		'-webkit-touch-callout': 'none',
			 	'-webkit-user-select': 'none',
			  	'-khtml-user-select': 'none',
			 	'-moz-user-select': 'none',
			  	'-ms-user-select': 'none',
			  	'user-select': 'none',
			  /* Trying to get SVG to act like a greedy block in all browsers */
			  	display: 'block',
			  	width:'100%',
				height:'100%'
			});
        	$("svg text").css({font: 'normal 12px Arial'});
        	$("svg .title").css({font: 'bold 14px Arial'});
        	$(".nvd3 .nv-background").css({fill: 'white', 'fill-opacity': '0'});
        	$(".nvd3.nv-noData").css({'font-size': '18px', 'font-weight': 'bold'});

        	//brush
        	$(".nv-brush .extent").css({'fill-opacity': '.125', 'shape-rendering': 'crispEdges'});

        	//legend
        	$(".nvd3 .nv-legend .nv-series").css({cursor: 'pointer'});
        	$(".nvd3 .nv-legend .disabled circle").css({'fill-opacity': '0'});

        	//axes
        	$(".nvd3 .nv-axis").css({'pointer-events':'none'});
        	$(".nvd3 .nv-axis path").css({
        		'fill': 'none',
				'stroke': '#000',
				'stroke-opacity': '.75',
				'shape-rendering': 'crispEdges'
        	});
        	$(".nvd3 .nv-axis path.domain").css({'stroke-opacity': '.75'});
        	$(".nvd3 .nv-axis.nv-x path.domain").css({'stroke-opacity': '0'});
        	$(".nvd3 .nv-axis line").css({
        		'fill': 'none',
				'stroke': '#e5e5e5',
				'shape-rendering': 'crispEdges'
        	});
        	$(".nvd3 .nv-axis .zero line, .nvd3 .nv-axis line.zero").css({'stroke-opacity': '.75'});
        	$(".nvd3 .nv-axis .nv-axisMaxMin text").css({'font-weight': 'bold'});
        	$(".nvd3 .x  .nv-axis .nv-axisMaxMin text, .nvd3 .x2 .nv-axis .nv-axisMaxMin text, .nvd3 .x3 .nv-axis .nv-axisMaxMin text").css({'text-anchor': 'middle'});

        	// brush
        	$(".nv-brush .resize path").css({'fill': '#eee', 'stroke': '#666'});

			// line CSS
			$(".nvd3 .nv-groups path.nv-line").css({'fill':'none', 'stroke-width': '1.5px'});
			$(".nvd3 .nv-groups path.nv-line.nv-thin-line").css({'stroke-width': '1px'});
			$(".nvd3 .nv-groups path.nv-area").css({'stroke':'none'});
			$(".nvd3 .nv-line.hover path").css({'stroke-width':'6px'});
			$(".nvd3.nv-line .nvd3.nv-scatter .nv-groups .nv-point").css({'fill-opacity': '0', 'stroke-opacity':'0'});
			$(".nvd3.nv-scatter.nv-single-point .nv-groups .nv-point").css({'fill-opacity': '.5', 'stroke-opacity': '.5'});
			$(".with-transitions .nvd3 .nv-groups .nv-point").css({
				transition: 'stroke-width 250ms linear, stroke-opacity 250ms linear',
				'-moz-transition': 'stroke-width 250ms linear, stroke-opacity 250ms linear',
 				'-webkit-transition': 'stroke-width 250ms linear, stroke-opacity 250ms linear'
			});
			$(".nvd3.nv-scatter .nv-groups .nv-point.hover, .nvd3 .nv-groups .nv-point.hover").css({
				'stroke-width': '7px',
				'fill-opacity': '.95',
				'stroke-opacity': '.95'
			});
			$(".nvd3 .nv-point-paths path").css({
				'stroke': '#aaa',
			 	'stroke-opacity': '0',
			  	'fill': '#eee',
			  	'fill-opacity': '0'
			});
			$(".nvd3 .nv-indexLine").css({
				cursor: 'ew-resize'
			});
        }



	}]);

