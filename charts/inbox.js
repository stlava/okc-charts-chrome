function drawCharts(chartName) {
	d3.json("", function(okc_matches) {
		draw_matches("inbox", [])
	})
}

var drawFunctDelay = function() {setTimeout(function() { drawCharts(); }, 1000)};


function fetchInbox() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://www.okcupid.com/messages?okc_api=1", true);

	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var inbox = JSON.parse(xhr.responseText);
			for (var i in inbox.messages) {
				var user = inbox.messages[i].person;
				addProfile(user, "inbox")
			}
			openDb(drawFunctDelay);
		}
	}

	xhr.send();
}

fetchInbox();