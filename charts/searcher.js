function draw_search(okcMatches) {
	var ndx = crossfilter(okcMatches);

	// Match vs Friend
	matchVFriend = makeChart(
		"scatterPlot",
		"dc-matchvfriend-chart",
		ndx,
		function(d) {
			return [d.match_percentage, d.friend_percentage];
		},
		755, 210
	);
	matchVFriend
		.x(d3.scale.linear().domain([0, 100]))
		.y(d3.scale.linear().domain([0, 100]))

		.brushOn(true)
		.symbolSize(4)
		.clipPadding(10)
		.yAxisLabel("% Friendship")
		.xAxisLabel("% Match");

	// Age bar chart
	ageChart = makeChart(
		"barChart",
		"dc-age-chart",
		ndx,
		function(d) {
			return d.age;
		},
		500, 210
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
		});

	// Contacts vs Replies
	contactVReply = makeChart(
		"scatterPlot",
		"dc-contactvreply-chart",
		ndx,
		function(d) {
			return [d.recent_contacts, d.recent_replies];
		},
		755, 210
	);
	contactVReply
		.x(d3.scale.linear().domain([0, 1000]))
		.elasticX(true)
		.brushOn(true)
		.symbolSize(4)
		.clipPadding(10)
		.yAxisLabel("Replies")
		.xAxisLabel("Contacts");


	// Reply ratio line chart
	replyPercent = makeChart(
		"barChart",
		"dc-replypercent-chart",
		ndx,
		function(d) {
			return d.reply_perc;
		},
		755, 210
	);
	replyPercent
		.yAxisLabel("Count")
		.xAxisLabel("Reply Percentage")
		.x(d3.scale.linear().domain([-5, 105]))
		.elasticX(false)
		.elasticY(true)
		.xAxis().tickFormat(function(v) {
			return v;
		});


	// Questions Answered line chart
	// Reply ratio line chart
	foo = makeChart(
		"barChart",
		"dc-contactsweek-chart",
		ndx,
		function(d) {
			return Math.round(d.contacts_this_week);
		},
		500, 210
	);
	foo
		.yAxisLabel("Count")
		.xAxisLabel("Contacts this")
		.x(d3.scale.linear().domain([0, 100]))
		.elasticX(true)
		.elasticY(true);

	
	currTime = new Date().getTime() / 1000;
	lastLogin = makeChart(
			"barChart",
			"dc-lastlogin-chart",
			ndx,
			function(d) {
				diff = Math.round((currTime - d.last_login)/(3660));
				console.log(diff);
				return diff;
			},
			500, 210
		);
		lastLogin
			.yAxisLabel("Count")
			.xAxisLabel("Hours ago online")
			.x(d3.scale.linear().domain([0, 168]))
			.elasticX(false)
			.elasticY(true)
			.xAxis().tickFormat(function(v) {
				return v;
			});

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
				return d.match_percentage;
			},
			function(d) {
				return d.enemy_percentage;
			},
			function(d) {
				return d.reply_perc;
			},
			function(d) {
				return d.location_detail.location.city_name;
			},
		])
		.sortBy(function(d) {
			return d.match_percentage * 1e9 + d.reply_perc;
		})
		.order(d3.descending);
	dc.renderAll();
}