var defaultColor = "red";
var defaultUser = "";
var defaultStatus = true;
var defaultSprint = 0;
var defaultRefresh = 5;

var statusMap = new Array();
statusMap['NEW'] = 'statusNew';
statusMap['ASSIGNED'] = 'statusAssigned';
statusMap['MODIFIED'] = 'statusModified';
statusMap['ON_DEV'] = 'statusOnDev';
statusMap['ON_QA'] = 'statusOnQA';
statusMap['VERIFIED'] = 'statusVerified';
statusMap['RELEASE_PENDING'] = 'statusReleasePending';
statusMap['POST'] = 'statusPost';
statusMap['CLOSED'] = 'statusClosed';

function changeUseSprint() {
	if (jQuery('#useSprint').attr('checked')) {
		jQuery('#sprintSpan').removeClass('hidden');
	} else {
		jQuery('#sprintSpan').addClass('hidden');
	}
}

function getUseSprint() {
	var use = localStorage['useSprint'];
	if (use == undefined || (use != true && use != false)) {
		use = defaultStatus;
	}

	return use;
}

function setUseSprint(data) {
	localStorage['useSprint'] = data;
}

function getSuspended() {
	var suspend = localStorage['suspended'];
	console.log('Got value suspended = '+suspend);
	return suspend;
}

function setSuspended(data) {
	console.log('Setting value suspended = '+data);
	localStorage['suspended'] = data;
}

function getAssignedTo() {
	var assigned = localStorage['assignedTo'];
	if (assigned == undefined || (assigned != true && assigned != false)) {
          assigned = defaultStatus;
     }
     
     return assigned;
}

function setAssignedTo(data) {
	localStorage['assignedTo'] = data;
}

function getOwner() {
	var assigned = localStorage['owner'];
	if (assigned == undefined || (assigned != true && assigned != false)) {
          assigned = defaultStatus;
     }
     
     return assigned;
}

function setOwner(data) {
	localStorage['owner'] = data;
}

function getNeedinfo() {
	var assigned = localStorage['needinfo'];
	if (assigned == undefined || (assigned != true && assigned != false)) {
          assigned = defaultStatus;
     }
     
     return assigned;
}

function setNeedinfo(data) {
	localStorage['needinfo'] = data;
}

function getBadgeColor() {
	var badgeColor = localStorage['badgeColor'];

	if (badgeColor == undefined || (badgeColor != "red" && badgeColor != "blue" && badgeColor != "green" && badgeColor != "yellow")) {
		badgeColor = defaultColor;
	}

	return badgeColor;
}

function setBadgeColor(data) {
	localStorage['badgeColor'] = data;
}

function getRefreshTime() {
	var refresh = localStorage['refreshTime'];
	if (refresh == undefined || refresh == "" || refresh <= 0) {
		refresh = defaultRefresh;
	}

	return refresh;
}

function setRefreshTime(data) {
	localStorage['refreshTime'] = data;
}

function getSprint() {
	var sprint = localStorage['sprintNumber'];
	if (sprint == undefined || sprint == "" || sprint < 0) {
		sprint = defaultSprint;
	}

	return sprint;
}

function setSprint(data) {
	localStorage['sprintNumber'] = data;
}

function getUserName() {
	var userName = localStorage['userName'];
	if (userName == undefined || userName == "") {
		userName = defaultUser;
	}

	return userName;
}

function setUserName(data) {
	localStorage['userName'] = data;
}

function setStatus(stat, data) {
	localStorage[statusMap[stat]] = data;
}

function getStatus(stat) {
	var currStatus = localStorage[statusMap[stat]];
	if (currStatus == undefined || (currStatus != true && currStatus != false)) {
		currStatus = defaultStatus;
	}

	return currStatus;
}

function loadOptions() {
	jQuery('#username').val(getUserName());

	jQuery('#useSprint').attr('checked', getUseSprint());
	changeUseSprint();
	jQuery('#sprint').val(getSprint());
	jQuery('#assignedTo').attr('checked', getAssignedTo());
	jQuery('#owner').attr('checked', getOwner());
	jQuery('#needinfo').attr('checked', getNeedinfo());

	jQuery('#refresh').val(getRefreshTime());

	var badgeColor = getBadgeColor();
	
	var select = document.getElementById("color");
	for (var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
		if (child.value == badgeColor) {
			child.selected = "true";
			break;
		}
	}

	jQuery('#new').attr('checked', getStatus('NEW'));
	jQuery('#assigned').attr('checked', getStatus('ASSIGNED'));
	jQuery('#modified').attr('checked', getStatus('MODIFIED'));
	jQuery('#ondev').attr('checked', getStatus('ON_DEV'));
	jQuery('#onqa').attr('checked', getStatus('ON_QA'));
	jQuery('#verified').attr('checked', getStatus('VERIFIED'));
	jQuery('#releasepending').attr('checked', getStatus('RELEASE_PENDING'));
	jQuery('#post').attr('checked', getStatus('POST'));
	jQuery('#closed').attr('checked', getStatus('CLOSED'));
}

function saveOptions() {
	setBadgeColor(jQuery('#color').val());
	setUserName(jQuery('#username').val());
	setUseSprint(jQuery('#useSprint').val());
	setSprint(jQuery('#sprint').val());

	setAssignedTo(jQuery('#assignedTo').val());
	setOwner(jQuery('#owner').val());
	setNeedinfo(jQuery('#needinfo').val());

	setRefreshTime(jQuery('#refresh').val());

	setStatus('NEW', jQuery('#new').val());
	setStatus('ASSIGNED', jQuery('#assigned').val());
	setStatus('MODIFIED', jQuery('#modified').val());
	setStatus('ON_DEV', jQuery('#ondev').val());
	setStatus('ON_QA', jQuery('#onqa').val());
	setStatus('VERIFIED', jQuery('#verified').val());
	setStatus('RELEASE_PENDING', jQuery('#releasepending').val());
	setStatus('POST', jQuery('#post').val());
	setStatus('CLOSED', jQuery('#closed').val());

	updateBugCount();
	updateBadge();
}
