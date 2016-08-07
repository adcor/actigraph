var $chartName = $(chtNam);
			var $activityName = $(nam);
			var $hours = $(hours);
			var $chartTwo = $(chartTwo);
			var $username = window.user;
			//Dropdown Vars
			var $dropdown = $(dropdown);

			var namelist = [];
			var optList = [];

			var memList = [];
			var chartList = [];
			//Load vals
			var chartVals = [];
			
			//d3 Code
			var dataset = [];
			var sorter = function(a, b) {
               if(a.activity < b.activity){
                 return -1;
               }
               if(a.activity > b.activity){
                 return 1;
               }
               return 0;
               };
			var width = 440;
			var height = 230;

			var nesty = d3.nest()
			                .key(function(){ return d.activity})
			                .entries(dataset);

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

			//Dataset Formatter
			function formatter(arr){
			  var fin = [];
			  var test = [];
			  var pusher;
			  var sorted = arr.sort(function compare(a,b) {
			    if (a.activity < b.activity)
			      return -1;
			    if (a.activity > b.activity)
			      return 1;
			    return 0;
			  });
			  for(var i = 0; i < arr.length; i++){
			    if(arr[i+1] === undefined || arr[i].activity === arr[i+1].activity){
			      test.push(arr[i]);
			    }

			    else {
			      test.push(arr[i])
			      pusher = test.reduce(function(a, b) { return {activity: a.activity, duration: a.duration + b.duration}})
			      fin.push(pusher);  
			      test = [];
			      pusher = [];
			    }
			  }
			  pusher = test.reduce(function(a, b) { return {activity: a.activity, duration: a.duration + b.duration}})
			  fin.push(pusher);
			  console.log(sorted);
			  return fin;
			}
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
				console.log(data);
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
				$(".chrt1Head").append("<h2 class='chartHead'>" + $(userCharts).val() + "</h2>");
			}

			function mkPic() {
				mkPie();
				grphBar();

				mkTitle();

				

			} 

			function addDat() {
				var dPop = {};
				var last;
				dPop.chartName = $(chtNam).val();
				if(dPop.chartName != $(".chrt1Head").text()){
					resetChart();
				}
				dPop.activity = $(nam).val();
				dPop.duration = Number($(hours).val());
				if(dataset.length === 0){
					dataset.push(dPop);
					last = dataset[dataset.length - 1].activity;
				}
				else if(dataset.length >= 1 && dataset[dataset.length - 1].activity === dPop.activity){
					dataset[dataset.length - 1].duration = dataset[dataset.length - 1].duration + dPop.duration;

				}
				else {
					console.log(dataset);

					for(var i = 0; i < dataset.length; i++){
						if(dataset[dataset.length - 1].activity === dPop.activity && !last){
							break;
						}
						else if(dataset[i].activity === dPop.activity ){
							console.log(dataset[i].activity);
							console.log(dPop.activity);
							console.log(dataset[i].duration = dataset[i].duration + dPop.duration);
							break;
						}
						else if(i === dataset.length - 1){
							dataset.push(dPop);
						}
					}
				}
				
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

			function nameMatch(){
				var nameArr = $(username).html().split("");
				var res = [];
				for(var i = 10; i <= nameArr.length; i++){
					res.push(nameArr[i]);
				}
				res = res.join("");
				return res;
			}


			

			$.ajax({
				type: 'GET',
				url: '../api/charts',
				success: function(chartdat) {
					var i,
					j,
					k,
				    obj={};
				    $(dropdown).append("<option>" + "all" + "</option>");
					for(i = 0; i < chartdat.length - 1; i++){
						
						console.log(namelist.push(chartdat[i].creator));
						
					}
					for (j=0;j<namelist.length;j++) {
			    		console.log(obj[namelist[j]]=0);
				  	}
				    for (j in obj) {
				    	optList.push(j);
				    }
				    for(k = 1; k <= optList.length - 1; k++) {
						$(dropdown).append("<option>" + optList[k] + "</option>");
					}
					$(chtNam).val(optList[-1]);
					
				}
			})
			var substringMatcher = function(strs) {
				return function findMatches(q, cb) {
				var matches, substringRegex;

				// an array that will be populated with substring matches
				matches = [];

				// regex used to determine if a string contains the substring `q`
				substrRegex = new RegExp(q, 'i');

				// iterate through the pool of strings and for any string that
				// contains the substring `q`, add it to the `matches` array
				$.each(strs, function(i, str) {
				  if (substrRegex.test(str)) {
				    matches.push(str);
				  }
				});

				cb(matches);
				};
			};

			$('.typeahead').typeahead({
				hint: true,
				highlight: true,
				minLength: 1
			},
			{
				name: 'optlist',
				source: substringMatcher(optList)
			});

			$("#add").click(addDat());
			$("#reset").click(resetChart());
			
			$(save).on('click', function(){
				var JSONObject = {"creator": $dropdown.val(), "chartName": $chartName.val(), "activity": $activityName.val(), "duration": $hours.val()};

				$.ajax({
					type: "POST",
					url: '../api/charts',
					dataType: 'json',
					data: JSONObject,
					success: function(newChart) {
						if(optList.indexOf(JSONObject.chartName) == -1){
							$(userCharts).append("<option>" + JSONObject.chartName + "</option>");
						}
						console.log(JSONObject.chartName)
						console.log("We win");
					}
				});

				$.ajax({
					type: "GET",
					url: '../api/charts',
					success: function(loadDat) {
						var popdat = {};
						color = d3.scale.category20();
						dataset.length = 0;
						var i,
						j,
						k,
					    obj={};

						for(i = 0; i <= loadDat.length - 1; i++){
							if(loadDat[i].creator === $dropdown.val()){
								console.log(namelist.push(loadDat[i].chartName));
							}
						}
						for (j=0;j<namelist.length;j++) {
				    		console.log(obj[namelist[j]]=0);
					  	}
					    for (j in obj) {
					    	optList.push(j);
					    }
						for(var n = 0; n <= loadDat.length - 1; n++){
							if(loadDat[n].chartName == $(chtNam).val()){
								dataset.push(loadDat[n]);
								
							}
							
						}
						dataset = formatter(dataset);
						mkPic();
						$(".chrt1Head").children().remove();
						$(".chrt1Head").append("<h2 class='chartHead'>" + $(chtNam).val() + "</h2>");

						color.domain().length = 0; 


					}


				});


			});

			$(loadUserCharts).on('click',function() {
				$.ajax({
					type: 'GET',
					url: '../api/charts',
					success: function(chartdat) {
						var i,
						j,
						k,
						m,
						memList = [],
						chartList = [],
					    obj={};
					    $(userCharts).empty();
						for(i = 0; i <= chartdat.length - 1; i++){
							if($(dropdown).val() === "all") {
								memList.push(chartdat[i].chartName);
							}
							else if(chartdat[i].creator === $(dropdown).val()){
								console.log(memList.push(chartdat[i].chartName));
							}
						}
						for (j=0;j<memList.length;j++) {
				    		console.log(obj[memList[j]]=0);
					  	}
					    for (j in obj) {
					    	chartList.push(j);
					    }
					    for(k = 0; k < chartList.length; k++) {
							$(userCharts).append("<option>" + chartList[k] + "</option>");
						}
						$(chtNam).val(chartList[-1]);
						
					}
				});
			})

			$(changeStatus).on('click', function() {
				var JSONObj = {"username": $(dropdown).val(), "status": $(memberType).val()};
				$.ajax({
					type: "PUT",
					url: "admin",
					dataType: "json",
					data: JSONObj,
					success: function(fin){
						console.log("Status Changed");
					},
					error: function() {
						console.log("not yet");
					} 
				})
			})

			$(del).on('click', function() {
				var dat = [];
				$.ajax({
					type: "GET",
					url: "../api/charts",
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
						for(var m = 0; m <= optList.length; m++){
							if(optList[m] == delVal){
								optList.splice(m);
							}
						}
						$("#dropdown :selected").remove();


					}

				});
				
				

			})

			$(load).on('click', function() {
				$.ajax({
					type: "GET",
					url: '../api/charts',
					success: function(loadDat) {
						var popdat = {};
						color = d3.scale.category20();
						dataset.length = 0;
						for(var n = 0; n <= loadDat.length - 1; n++){
							if(loadDat[n].chartName == $(userCharts).val()){
								dataset.push(loadDat[n]);
								
							}
							
						}
						dataset = formatter(dataset);
						mkPic();

						color.domain().length = 0; 


					}

				});
			});