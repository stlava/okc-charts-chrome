function draw_matches(chartName, okcMatches) {
	var ndx = crossfilter(okcMatches);

	// Match vs Friend
	scatter = makeChart(
		"scatterPlot",
		"dc-composite-chart",
		ndx,
		function(d) {
			return [d.matchpercentage, d.friendpercentage];
		},
		755, 210
	);
	scatter
		.x(d3.scale.linear().domain([0, 100]))
		.y(d3.scale.linear().domain([0, 100]))
		.brushOn(true)
		.symbolSize(4)
		.clipPadding(10)
		.yAxisLabel("% Friendship")
		.xAxisLabel("% Match");

	// Distance bar chart
	distanceChart = makeChart(
		"barChart",
		"dc-distance-chart",
		ndx,
		function(d) {
			return d.distance;
		},
		400, 200
	);
	distanceChart.centerBar(true)
		.gap(1)
		.x(d3.scale.linear().domain([0, 30]))
		.yAxisLabel("Count")
		.xAxisLabel("Distance (Miles)")
		.elasticY(true)
		.xAxis().tickFormat(function(v) {
			return v;
		});

	// Height bar chart
	heightChart = makeChart(
		"barChart",
		"dc-height-chart",
		ndx,
		function(d) {
			return get_height(d.skinny.height)
		},
		400, 200
	);

	heightChart.width(450)
		.centerBar(true)
		.gap(10)
		.x(d3.scale.linear().domain([5, 7]))
		.xUnits(dc.units.fp.precision(0.1))
		.yAxisLabel("Count")
		.xAxisLabel("Height (feet)")
		.elasticY(true);

	// Age bar chart
	ageChart = makeChart(
		"barChart",
		"dc-age-chart",
		ndx,
		function(d) {
			return d.age;
		},
		400, 200
	);
	ageChart.centerBar(true)
		.gap(1)
		.yAxisLabel("Count")
		.xAxisLabel("Age")
		.x(d3.scale.linear().domain([0, 100]))
		.elasticX(true)
		.elasticY(true)
		.xAxis().tickFormat(function(v) {
			return v;
		})

	// Education pie chart
	educationChart = makeChart(
		"pieChart",
		"dc-education-chart",
		ndx,
		function(d) {
			return null_check(d.skinny.education_status + " " + null_check(d.skinny.education))
		},
		150, 150
	);
	educationChart.radius(75)
		.minAngleForLabel(0)
		.legend(dc.legend().x(175).y(0).gap(5))
		.renderLabel(false);

	// Looking For pie chart
	lookingForChart = makeChart(
		"pieChart", // Type
		"dc-looking-for-chart", // Name
		ndx, // Crossfilter
		function(d) {
			return d.skinny.lookingfor;
		},
		200, 200
	);
	lookingForChart.radius(90)
		.minAngleForLabel(0)
		.legend(dc.legend().x(200).y(0).gap(5))
		.renderLabel(false);

	// Religion pie chart
	religionChart = makeChart(
		"pieChart",
		"dc-religion-chart",
		ndx,
		function(d) {
			return null_check(d.skinny.religion)
		},
		150, 150
	);
	religionChart.radius(75)
		.minAngleForLabel(0)
		.legend(dc.legend().x(175).y(0).gap(5))
		.renderLabel(false);

	// Smoker pie chart
	smokerChart = makeChart(
		"pieChart",
		"dc-smoker-chart",
		ndx,
		function(d) {
			return null_check(d.skinny.smoker)
		},
		150, 150
	);
	smokerChart.radius(75)
		.minAngleForLabel(0)
		.legend(dc.legend().x(175).y(0).gap(5))
		.renderLabel(false);

	// Bodytype pie chart
	bodyTypeChart = makeChart(
		"pieChart",
		"dc-body-chart",
		ndx,
		function(d) {
			return null_check(d.skinny.bodytype)
		},
		150, 150
	);
	bodyTypeChart.radius(75)
		.minAngleForLabel(0)
		.legend(dc.legend().x(175).y(0).gap(5))
		.renderLabel(false);

	// User table
	var userTable = dc.dataTable("#dc-table-graph");
	userTable.width(800).height(800)
		.dimension(ndx.dimension(function(d) {
			return d.username;
		}))
		.group(function(d) {
			return "List of all Selected Matches"
		})
		.size(500)
		.columns([
			function(d) {
				return '<a href=\"https://okcupid.com/profile/' + d.username + '\" target=\"_blank\">' + d.username + '</a>'
			},
			function(d) {
				return d.location;
			},
			function(d) {
				return d.matchpercentage;
			},
			function(d) {
				return d.enemypercentage;
			},
			function(d) {
				return d.skinny.lookingfor
			},
			function(d) {
				return d.skinny.ethnicities
			},
		])
		.sortBy(function(d) {
			return d.matchpercentage;
		})
		.order(d3.descending);

	// Update the page
	setTimeout(function() { renderFromDB(ndx, dc, chartName); }, 1500)
	/*renderFromDB(ndx, dc, chartName);
	spotlightPoller = setInterval(function() {
		renderFromDB(ndx, dc, chartName);
	}, 60000);*/
}

var users = [];
function renderFromDB(ndx, dc, chartName) {
		console.log("Rendering from db");
		var objectStore = db.transaction(chartName).objectStore(chartName);
		objectStore.openCursor().onsuccess = function(event) {
		var cursor = event.target.result;
		if (cursor) {
			if (users.indexOf(cursor.key) > -1) {
				return;
			}
			console.log(cursor.value);
			users.push(cursor.key);
			ndx.add([cursor.value]);
			cursor.continue();
		} else {
			dc.renderAll();
		}
	};
}