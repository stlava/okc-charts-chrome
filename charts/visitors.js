function drawCharts(chartName) {
	d3.json("", function(okc_matches) {
		draw_matches("visitors", [])
	})
}

var drawFunctDelay = function() {setTimeout(function() { drawCharts(); }, 1000)};


function fetchVisitors() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://www.okcupid.com/visitors?okc_api=1", true);

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var visitors = JSON.parse(xhr.responseText);
			for (var i in visitors.stalkers) {
				var user = visitors.stalkers[i].username;
				addProfile(user, "visitors")
			}
			openDb(drawFunctDelay);
		}
	}

	xhr.send();
}

fetchVisitors();
