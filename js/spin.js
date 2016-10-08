'use strict';

var spinners = [];

$(".mg-spin").each(function (i, s) {
	spinners.push(s);
	s.rotation = 0;
	s.spinning = false;
	s.momentum = 0;
	s.spinTime = 0;
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
			if (s.momentum < 0.9) s.momentum = 0.9;
			var speed = s.momentum;
			rotate(s, 0.9 * speed);
			s.spinTime++;
			if (s.spinTime > 1000) {
				s.momentum += 0.001;
			}
		} else {
			s.spinTime = 0;
			s.momentum *= 0.98;
			if (s.rotation < -1 || s.rotation > 1) {
				s.momentum += (s.rotation > 180) ? 0.07 : -0.07;
			}
			rotate(s, s.momentum);
			//settle
			if (s.rotation > -1 && s.rotation < 1 && s.momentum > -0.2 && s.momentum < 0.2) {
				s.momentum = 0;
				s.rotation = 0;
				rotate(s, 0);
			}
		}
	}, 1);
});

var rotate = function(s, degrees) {
	s.rotation += degrees;
	while (s.rotation > 360) s.rotation -= 360;
	while (s.rotation < 0) s.rotation += 360;

    $(s).css({'-webkit-transform' : 'rotate('+ s.rotation +'deg)',
                 '-moz-transform' : 'rotate('+ s.rotation +'deg)',
                 '-ms-transform' : 'rotate('+ s.rotation +'deg)',
                 'transform' : 'rotate('+ s.rotation +'deg)'});
};