var spotlightPoller;
openDb(function() {cleanup();});

/*********************************************************
 *                                                       *
 *   Spotlight Polling                                   *
 *                                                       *
 ********************************************************/
var spotlightUsers = {}

function pollSpotlight() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://www.okcupid.com/json/spotlight/sync", true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			var spotlight = JSON.parse(xhr.responseText);
			// Promo over
			if (spotlight.promo == null) {
				stopSpotlight();
				return;
			}
			// Only add new users to the internal user list
			for (var i in spotlight.queue) {
				var user = spotlight.queue[i].username;

				if (spotlightUsers[user] != true) {
					console.log("Adding user " + user);
					spotlightUsers[user] = true;
					addProfile(user, "spotlight");
				}
			}
		}
	}
	xhr.send();
}

function stopSpotlight() {
	console.log("Stopping polling spotlight");
	clearInterval(spotlightPoller);
	spotlightPoller = null;
}

function initSpotlight() {
	if (spotlightPoller) {
		console.log("Spotlight polling already started");
		return "Spotlight polling already started";
	}

	spotlightUsers = {}
	console.log("Starting polling spotlight");
	spotlightPoller = setInterval(function() {
		pollSpotlight();
	}, 3000);

	return "Spotlight polling started";
}

/*********************************************************
 *                                                       *
 *   Chrome Popup Listener                               *
 *                                                       *
 ********************************************************/
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(sender);
		switch (request.directive) {
			case "spotlight":
				resp = initSpotlight();
				sendResponse({});
				break;
			case "search":
				sendResponse({});
				break;
			case "inbox":
				sendResponse({});
				break;
			case "visitors":
				sendResponse({});
				break;
			case "help":
				sendResponse({});
				break;
			default:
				alert("Unmatched request of '" + request + "' from script to background.js from " + sender);
		}
	}
);