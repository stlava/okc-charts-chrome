var drawFunct = (function drawCharts(chartName) {
	d3.json("", function(okc_matches) {
		draw_matches("spotlight", [])
	})
});

openDb(drawFunct);