function makeChart(type, name, ndx, attributeFunction, chart_width, chart_height) {
	var chartFunct = dc[type];
	var chart = chartFunct("#" + name)

	var dim = ndx.dimension(attributeFunction);

	chart.width(chart_width)
		.height(chart_height)
		.transitionDuration(1500)
		.dimension(dim)
		.group(dim.group())
		.renderLabel(false);

	return chart;
}

function addimage(url) {
	var img = new Image();
	img.src = url
	img_home.appendChild(img);
}

function null_check(val) {
	if (val == null) {
		return "N/A"
	} else {
		return val
	}
}

function looking_for(a) {
	prefs = ""
	for (var i = 0; i < a.length; i++) {
		if (a[i][0] != null) {
			prefs += a[i][0];
		}

	}
	return a;
}

function get_height(h) {
	var patt = /\d\.\d\d/g;
	var result = patt.exec(h);
	if (result == null) {
		return 0;
	}

	return (result[0] * 3.28);
}