var $chartName = $(chtNam);
			var $activityName = $(nam);
			var $hours = $(hours);
			var $chartTwo = $(chartTwo);
			//Dropdown Vars
			var $dropdown = $(dropdown);
			var namelist = [];
			var optList = [];
			//Load vals
			var chartVals = [];
			
			//d3 Code
			var dataset = [];
			var width = 440;
			var height = 230;
			//d3 Pie
			var radius = Math.min(width, height) / 2;

			var color = d3.scale.category20();

			var svg = d3.select('#chart')
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.append('g')
				.attr('id', "pic")
				.attr('transform', 'translate(' + (width / 2.5) + ',' + (height / 2) + ')');

			var arc = d3.svg.arc()
				.outerRadius(radius)
				.innerRadius(radius / 1.8);

			var pie = d3.layout.pie()
				.value(function(d) { return d.duration; })
				.sort(null);


			//Pie Legend vars
			var legendRect = 30;
			var legendSpacing = 4; 

			//d3 Bar
			var margin = {top: 20, right: 20, bottom: 30, left: 40},
				barwidth = width - margin.left - margin.right,
				barheight = height - margin.top - margin.bottom;

			var x = d3.scale.ordinal()
				.rangeRoundBands([0, barwidth], .4);

			var y = d3.scale.linear()
				.range([barheight, 0]);

			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");

			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left")
			    .ticks(10);

			var chart2 = d3.select("#chartTwo")
				.append('svg')
				.attr("id", "bartChart")
				.attr("width", barwidth + margin.left + margin.right)
				.attr("height", barheight + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
				.attr("id", "chrt2");


			// pie functions
			function gphPie() {
				$(pic).children().remove();
				var path = svg.selectAll('path')
				.data(pie(dataset))
				.enter()
				.append('path')
				.attr('d', arc)
				.attr('fill', function(d, i) {
					return color(d.data.activity)
				});
			}
			function mkLeg(){
				var legend = svg.selectAll('legend')
				.data(color.domain())
				.enter()
				.append('g')
				.attr('class', 'legend')
				.attr('transform', function(d, i) {
					var height = legendRect + legendSpacing;
					var offset = height * color.domain().length / 2;
					var horiz = 4.5 * legendRect;
					var vert = i * height - offset;
					return 'translate(' + horiz + ',' + vert + ')';
				});

				legend.append('rect')
					.attr('width', legendRect)
					.attr('height', legendRect)
					.style('fill', color)
					.style('stroke', color);

				legend.append('text')
					.attr('x', legendRect + legendSpacing)
					.attr('y', legendRect - legendSpacing)
					.text(function(d){ return d; })
			}
			function mkPie() {
				gphPie();
				mkLeg();
			}

			//bar functions
			function domainer(data) {
				x.domain(data.map(function(d) { return d.activity;}));
				y.domain([0, d3.max(data, function(d) { return d.duration;})]);
			}
			function grphBar() {
				$(chrt2).children().remove();
				domainer(dataset);
				chart2.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + barheight + ")")
					.call(xAxis);

				chart2.append("g")
					.attr("class", "y axis")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 6)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("Duration in Hours");

				chart2.selectAll(".bar")
					.data(dataset)
					.enter().append("rect")
					.attr("class", "bar")
					.attr("x", function(d) { return x(d.activity); })
					.attr("width", x.rangeBand())
					.attr("y", function(d) { return y(d.duration); })
					.attr("height", function(d) { return barheight - y(d.duration); });
				
			}

			function mkTitle() {
				$(".chrt1Head").children().remove();
				$(".chrt1Head").append("<h2 class='chartHead'>" + $(dropdown).val() + "</h2>");
			}

			function mkPic() {
				mkPie();
				grphBar();

				mkTitle();

				

			} 

			function addDat() {
				var dPop = {};
				dPop.chartName = $(chtNam).val();
				dPop.activity = $(nam).val();
				dPop.duration = Number($(hours).val());
				resetChart();
				dataset.push(dPop);
				console.log(dataset);
				
				mkPic();
				
			}
			function resetChart() {
				dataset.length = 0;
				$(pic).children().remove();
				$(chrt2).children().remove();
				$(".chrt1Head").children().remove();
			}


			function dupLess(arr) {
				var i,
			        len=arr.length,
				    obj={};

				for (i=0;i<len;i++) {
			    	obj[arr[i]]=0;
			  	}
			    for (i in obj) {
			    	optList.push(i);
			    }
			}
			function mkOpt(arr) {
				for(var i = 0; i <= arr.length; i++) {
					$(dropdown).append("<option>" + arr[i] + "</option>")
				}
			}
			


			$.ajax({
				type: 'GET',
				url: 'api/charts',
				success: function(chartdat) {
					var i,
					j,
					k,
				    obj={};

					for(i = 0; i <= chartdat.length - 1; i++){
						console.log(namelist.push(chartdat[i].chartName));
					}
					for (j=0;j<namelist.length;j++) {
			    		console.log(obj[namelist[j]]=0);
				  	}
				    for (j in obj) {
				    	optList.push(j);
				    }
				    for(k = 0; k <= optList.length - 1; k++) {
						$(dropdown).append("<option>" + optList[k] + "</option>");
					}
					
				}
			})

			
			$(save).on('click', function(){
				var JSONObject = {"chartName": $chartName.val(), "activity": $activityName.val(), "duration": $hours.val()};

				$.ajax({
					type: "POST",
					url: 'api/charts',
					dataType: 'json',
					data: JSONObject,
					success: function(newChart) {
						console.log("We win");
					}
				});

			});

			$(del).on('click', function() {
				var dat = [];
				$.ajax({
					type: "GET",
					url: "api/charts",
					success: function(delDat){
						var c;
						var delVal = $(dropdown).val();
						dat.length = 0;
						for(c = 0; c <= delDat.length -1; c++){
							if(delDat[c].chartName == delVal) {
								dat.push(delDat[c]._id);
							}
							
						}
						console.log(dat);
						for(var t = 0; t <= dat.length - 1; t++){
							$.ajax({
								type: "DELETE",
								url: "api/charts/" + dat[t],
								success: function() {
									console.log("Deleted")
								}

							})
						}
						location.reload();

					}

				});
				
				

			})

			$(load).on('click', function() {
				$.ajax({
					type: "GET",
					url: 'api/charts',
					success: function(loadDat) {
						var popdat = {};
						color = d3.scale.category20();
						dataset.length = 0;
						for(var n = 0; n <= loadDat.length - 1; n++){
							if(loadDat[n].chartName == $(dropdown).val()){
								dataset.push(loadDat[n]);
								
							}
							
						}
						mkPic();

						color.domain().length = 0; 


					}

				});
			});
			$(dat).click(addDat);
			$(reset).click(resetChart);