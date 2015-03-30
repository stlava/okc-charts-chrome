function drawCharts() {
	d3.json("https://www.okcupid.com/match?okc_api=1&count=1000", function(okc_matches) {
		draw_search(okc_matches.amateur_results);
	})
}
drawCharts();