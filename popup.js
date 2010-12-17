var colorMap = new Array();
colorMap['red'] = new Array(255,0,0,255);
colorMap['green'] = new Array(0,255,0,255);
colorMap['blue'] = new Array(0,0,255,255);
colorMap['yellow'] = new Array(255,255,0,255);

function openBZ(num) {
	chrome.tabs.create({"url": "http://bugzilla.redhat.com/"+num, "selected": false});
} 

function newBug() {
	chrome.tabs.create({"url": "http://bugzilla.redhat.com/enter_bug.cgi", "selected": false});
}

function showOptions() {
	chrome.tabs.create({"url": chrome.extension.getURL('options.html')});
	window.setTimeout(window.close, 10);
}

function setBadgeText(data) {
	chrome.browserAction.setBadgeBackgroundColor({color: colorMap[getBadgeColor()]});
	chrome.browserAction.setBadgeText({text: ""+data});
}

function setAssignedBugs(data) {
	localStorage['assignedBugs'] = JSON.stringify(data);
}

function getAssignedBugs() {
	return JSON.parse(localStorage['assignedBugs']);
}

function setOwnerBugs(data) {
	localStorage['ownerBugs'] = JSON.stringify(data);
}

function getOwnerBugs() {
	return JSON.parse(localStorage['ownerBugs']);
}

function updateBugCount() {
	if (getAssignedTo()) {
		updateAssignedBugs();
	}

	/*
	if (getOwner()) {
		updateOwnerBugs();
	}

	if (getNeedinfo()) {
		updateNeedinfoBugs();
	}
	*/
}

function updateAssignedBugs() {
	console.log('Updating assigned bugs');
	var myObject = null;

	if (getUseSprint()) {
		myObject = { "version": "1.1",
				"method": "Bug.search",
				"params": {"assigned_to": getUserName(),
						"target_milestone": "sprint "+getSprint() }}
	} else {
		myObject = { "version": "1.1",
				"method": "Bug.search",
				"params": {"assigned_to": getUserName()}}
	}

	if (myObject != null) {
		var enc = $.toJSON(myObject);
		$.ajax({"contentType":"application/json",
				"data": enc, 
				"dataType": "json", 
				"url": "https://bugzilla.redhat.com/jsonrpc.cgi",
				"type": "POST",
				success: function(d, ts) {
					console.log('Returned',d);
					console.dir(d);
					setAssignedBugs(d.result);
				},
				error: function(r, ts, et) {
					console.log('ERR', ts);
					setBadgeText("ERR");
				},		
		});
	} else {
		setBadgeText("ERR");
	}
}

function updateOwnerBugs() {
	console.log('Updating owner bugs');
	var myObject = null;

	if (getUseSprint()) {
		myObject = { "version": "1.1",
				"method": "Bug.search",
				"params": {"creator": getUserName(),
						"target_milestone": "sprint "+getSprint() }}
	} else {
		myObject = { "version": "1.1",
				"method": "Bug.search",
				"params": {"creator": getUserName()}}
	}

	if (myObject != null) {
		var enc = $.toJSON(myObject);
		$.ajax({"contentType":"application/json",
				"data": enc, 
				"dataType": "json", 
				"url": "https://bugzilla.redhat.com/jsonrpc.cgi",
				"type": "POST",
				success: function(d, ts) {
					console.log('Returned',d);
					console.dir(d);
					setOwnerBugs(d.result);
				},
				error: function(r, ts, et) {
					console.log('ERR', ts);
					setBadgeText("ERR");
				},		
		});
	} else {
		setBadgeText("ERR");
	}

}

function getBugHTML(bug, count) {
	var html = '';
	if (count % 2 == 0) {
		html = '<div class="bug even" onclick="openBZ('+bug.bug_id+')">';
	} else {
		html = '<div class="bug odd" onclick="openBZ('+bug.bug_id+')">';
	}

	html = html + '<div class="bug_info">';
	html = html + '<div class="bug_number"><a href="#" onclick="openBZ('+bug.bug_id+')">'+bug.bug_id+'</a></div>';
	html = html + '<div class="bug_status">'+bug.bug_status+'</div>';
	html = html + '</div>';
	html = html + '<div class="bug_desc">'+bug.short_desc+'</div>';
	html = html + '</div>';

	return html;
}

function updateBadge() {
/*	if (getSuspended()) {
		jQuery('#suspendUpdates').addClass('hidden');
		jQuery('#resumeUpdates').removeClass('hidden');
		return;
	} else {
		jQuery('#suspendUpdates').removeClass('hidden');
		jQuery('#resumeUpdates').addClass('hidden');
	}
*/

	var bugCount = 0;
	var bugStatus = ['NEW', 'ASSIGNED', 'MODIFIED', 'ON_DEV', 'ON_QA', 'VERIFIED', 'RELEASE_PENDING', 'POST', 'CLOSED'];
	var errored = false;
	var bugz = new Array();

	jQuery('#bugList').html('');

	for (i in bugStatus) {
		bugz[bugStatus[i]] = new Array();
	}

	if (getAssignedTo()) {
		var assignedBugs = getAssignedBugs();
		if (assignedBugs == undefined) {
			console.log('assignedBugs undefined');
			updateAssignedBugs();
			assignedBugs = getAssignedBugs();
		}

		if (assignedBugs != undefined) {
			for (i in assignedBugs.bugs) {
				var bug = assignedBugs.bugs[i];
				bugz[bug.bug_status].push(bug);
			}
		}
	}

/*
	if (getOwner()) {
		var ownerBugs = getOwnerBugs();
		if (ownerBugs == undefined) {
			console.log('ownerBugs undefined');
			updateOwnerBugs();
			ownerBugs = getOwnerBugs();
		}

		if (ownerBugs != undefined) {
			for (i in ownerBugs.bugs) {
				var bug = ownerBugs.bugs[i];
				bugz[bug.bug_status].push(bug);
			}
		}
	}

	if (getNeedinfo()) {
		var needinfoBugs = getNeedinfoBugs();
		if (needinfoBugs == undefined) {
			console.log('needinfoBugs undefined');
			updateNeedinfoBugs();
			needinfoBugs = getNeedinfoBugs();
		}

		if (needinfoBugs != undefined) {
			for (i in needinfoBugs.bugs) {
				var bug = needinfoBugs.bugs[i];
				bugz[bug.bug_status].push(bug);
			}
		}
	}

*/

	for (i in bugStatus) {
		if (getStatus(bugStatus[i])) {
			console.log(bugStatus[i], bugz[bugStatus[i]].length);
			var bugsForStatus = bugz[bugStatus[i]];
			for (j in bugsForStatus) {
				var bug = bugsForStatus[j];
				var html = getBugHTML(bug, bugCount);

				jQuery('#bugList').append(html);
				bugCount++;
			}
		}
	}


	if (errored) {
		setBadgeText("ERR");
	} else if (bugCount == 0) {
		setBadgeText("");
	} else {
		setBadgeText(""+bugCount);
	}

}

var timerId;

function startRequest() {
	var pollInterval = getRefreshTime() * 1000 * 60;

	window.clearTimeout(timerId);

	console.log('Calling updateBugCount');
	updateBugCount();
	console.log('Calling updateBadge');
	updateBadge();

	console.log('Setting time out for '+pollInterval+' seconds');
	timerId = window.setTimeout(startRequest, pollInterval);
}

function suspend() {
	setSuspended(true);
	console.log('Suspending - Status '+getSuspended());
	window.clearTimeout(timerId);
	jQuery('#suspendUpdates').addClass('hidden');
	jQuery('#resumeUpdates').removeClass('hidden');
}

function resume() {
	setSuspended(false);
	console.log('Resuming');
	jQuery('#suspendUpdates').removeClass('hidden');
	jQuery('#resumeUpdates').addClass('hidden');
	
	console.log('Calling startRequest');
	startRequest();
}

function refresh() {
	window.clearTimeout(timerId);
	startRequest();
/*	var suspendStatus = getSuspended();
	console.log('Saving status of '+suspendStatus);
	setSuspended(false);

	console.log('Calling startRequest');
	startRequest();
	setSuspended(suspendStatus);

	if (getSuspended()) {
          jQuery('#suspendUpdates').addClass('hidden');
          jQuery('#resumeUpdates').removeClass('hidden');
		window.clearTimeout(timerId);
     } else {
          jQuery('#suspendUpdates').removeClass('hidden');
          jQuery('#resumeUpdates').addClass('hidden');
     }
*/
}
