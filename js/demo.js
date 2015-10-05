'use strict';

var demoCounter = 0;

function upgradeClass(divName) {
	var div = $(divName);
	for (var i = 20; i >= 1; i--) {
		var oldClass = "v" + i;
		var newClass = "v" + (i + 1);
		if (div.hasClass(oldClass)) {
			div.addClass(newClass);
			//make sure we get rid of the v1 class
			div.removeClass("v1");
			return;
		}		
	}
}

function resetClass(divName) {
	var div = $(divName);
	for (var i = 2; i <= 20; i++) {
		div.removeClass("v" + i);
	}
	div.addClass("v1");
}

function updateDemo() {
	if (demoCounter === 0 ) upgradeClass(".demoh1");
	if (demoCounter === 1 ) upgradeClass(".demop");
	if (demoCounter === 2 ) upgradeClass(".demonav");
	if (demoCounter >= 3 && demoCounter <= 5) upgradeClass(".demoh1");
	if (demoCounter == 6) upgradeClass(".demo");
	if (demoCounter >= 7 && demoCounter <= 9) upgradeClass(".demonav");
	if (demoCounter == 10) upgradeClass(".demop");
	if (demoCounter >= 11 && demoCounter <= 25) upgradeClass(".demopost");
	if (demoCounter === 26 ) upgradeClass(".demoh1");
	demoCounter++;
	if (demoCounter > 45) {
		demoCounter = 0;
		resetClass(".demo");
		resetClass(".demoh1");
		resetClass(".demonav");
		resetClass(".demop");
		resetClass(".demopost");
		resetClass(".demoposts");
	}
}

$(document).ready(function () {
	setInterval(updateDemo, 300);
});