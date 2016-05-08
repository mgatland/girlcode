'use strict';

var spinners = [];

$(".mg-spin").each(function (i, s) {
	spinners.push(s);
	s.rotation = 0;
	s.spinning = false;
});

$(".mg-spin").hover(
	function(e) {
		e.target.spinning = true;
	},
	function(e) {
		e.target.spinning = false;
		}
	);

setInterval(function () {
	spinners.forEach(function (s) {
		if (s.spinning) {
			rotate(s, 0.9);
		} else if (s.rotation > 0) {
			rotate(s, (s.rotation > 180) ? 0.45 : -0.45);
		}
	}, 1);
});

var rotate = function(s, degrees) {
	s.rotation += degrees;
	if (s.rotation > 360) s.rotation -= 360;

    $(s).css({'-webkit-transform' : 'rotate('+ s.rotation +'deg)',
                 '-moz-transform' : 'rotate('+ s.rotation +'deg)',
                 '-ms-transform' : 'rotate('+ s.rotation +'deg)',
                 'transform' : 'rotate('+ s.rotation +'deg)'});
};