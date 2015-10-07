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

function addN(value, len) {
  for (var i = 0; i < len; i++) {
    upgrades.push(value);
  }
}

var upgrades = [];
addN(".demoh1", 1);
addN(".demonav", 1);
addN(".demoinput", 1);
addN(".demoh1", 3);
addN(".demo", 1);
addN(".demonav", 3);
addN(".demopost", 2);
addN(".demoinput", 5);
addN(".demopost", 15);
addN(".demoinput", 3);
addN(".demoh1", 1);

function updateDemo() {
	if (demoCounter < upgrades.length) {
		upgradeClass(upgrades[demoCounter]);
	}
	demoCounter++;
	if (demoCounter > 49) {
		demoCounter = 0;
		resetClass(".demo");
		resetClass(".demoh1");
		resetClass(".demonav");
		resetClass(".demoinput");
		resetClass(".demopost");
	}
}

$(document).ready(function () {
	setInterval(updateDemo, 275);
});