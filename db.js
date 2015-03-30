const DB_NAME = "okcProfiles";
const DB_VERSION = 1;
var db;

function openDb(callback) {
	console.log("openDb ...");
	var req = indexedDB.open(DB_NAME, DB_VERSION);
	req.onsuccess = function(evt) {
		db = this.result;
		if (callback != null) {
			callback();
		}
	};
	req.onerror = function(evt) {
		console.error("openDb:", evt.target.errorCode);
	};

	req.onupgradeneeded = function(evt) {
		console.log("openDb.onupgradeneeded");

		if (!evt.currentTarget.result.objectStoreNames.contains("spotlight")) {
			var spotlightStore = evt.currentTarget.result.createObjectStore(
				"spotlight", {
					keyPath: 'username',
					autoIncrement: true
				});

			spotlightStore.createIndex("userid", "userid", {
				unique: true
			});
		}

		if (!evt.currentTarget.result.objectStoreNames.contains("inbox")) {
			var inboxStore = evt.currentTarget.result.createObjectStore(
				"inbox", {
					keyPath: 'username',
					autoIncrement: true
				});
			inboxStore.createIndex("userid", "userid", {
				unique: true
			});
		}

		if (!evt.currentTarget.result.objectStoreNames.contains("visitors")) {
			var visitorsStore = evt.currentTarget.result.createObjectStore(
				"visitors", {
					keyPath: 'username',
					autoIncrement: true
				});
			visitorsStore.createIndex("userid", "userid", {
				unique: true
			});
		}
	};
}

function addProfileNow(username, storeName) {
	db.transaction(storeName).objectStore(storeName).get(username).onsuccess = function(event) {
		if (event.target.result != null) {
			console.log("Skipping insert of " + username);
			return;
		}

		var xhr = new XMLHttpRequest();
		xhr.open("GET", "https://www.okcupid.com/profile/" + username + "?okc_api=1", true);

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				var resp = JSON.parse(xhr.responseText);
				console.log(resp);
				if (resp.status != 1) {
					console.log("Error fetching " + username);
					return;
				}

				var req = db.transaction([storeName], "readwrite").objectStore(storeName).add(resp);
				req.onsuccess = function(evt) {
					console.log("Inserted user " + resp.username + " in to db.")
				};
				req.onerror = function() {
					console.error("addProfile error", this.error);
				};
			}
		}
		xhr.send();
	}
}

function addProfile(username, storeName) {
	if (db == null) {
		setTimeout(function() {
			addProfileNow(username, storeName);
		}, 500);
	} else {
		addProfileNow(username, storeName);
	}
}


function cleanup() {
	var objectStore = db.transaction("spotlight").objectStore("spotlight");

	objectStore.openCursor().onsuccess = function(event) {
		var cursor = event.target.result;
		if (cursor) {
			console.log("Dropping " + cursor.key);
			var request = db.transaction(["spotlight"], "readwrite")
				.objectStore("spotlight")
				.delete(cursor.key);
			request.onsuccess = function(event) {
				// It's gone!
			};
			cursor.continue();
		}
	};
}